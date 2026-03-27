// app/api/prompts/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

// helper
function isValidObjectId(id: string) {
  return /^[0-9a-fA-F]{24}$/.test(id);
}

// GET single prompt (if you have it)
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;

  if (!isValidObjectId(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const prompt = await prisma.prompt.findUnique({
    where: { id },
    include: {
      author: {
        select: {
          id: true,
          username: true,
          name: true,
          image: true,
        },
      },
    },
  });

  if (!prompt) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(prompt);
}

// PATCH update prompt (this is the one mentioned in the error)
export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;

  if (!isValidObjectId(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { title, description, promptText, tags, image, outputType } = body;

  const existing = await prisma.prompt.findUnique({
    where: { id },
    select: { authorId: true },
  });

  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (existing.authorId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const updated = await prisma.prompt.update({
    where: { id },
    data: {
      title,
      description,
      promptText,
      tags,
      image,
      outputType,
    },
  });

  return NextResponse.json(updated);
}

// DELETE prompt (if you have this)
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;

  if (!isValidObjectId(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const existing = await prisma.prompt.findUnique({
    where: { id },
    select: { authorId: true },
  });

  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (existing.authorId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.prompt.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
