// app/api/comments/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

type Params = { params: Promise<{ id: string }> };

function isValidObjectId(id: string) {
  return /^[0-9a-fA-F]{24}$/.test(id);
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { id } = await params;

  if (!isValidObjectId(id)) {
    return NextResponse.json(
      { error: "Invalid comment id" },
      { status: 400 },
    );
  }

  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 },
    );
  }

  const existing = await prisma.comment.findUnique({
    where: { id },
    include: {
      user: { select: { id: true } },
      prompt: { select: { authorId: true } },
    },
  });

  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const userId = session.user.id;

  const isAuthor = existing.userId === userId;
  const isPromptOwner = existing.prompt.authorId === userId;

  if (!isAuthor && !isPromptOwner) {
    return NextResponse.json(
      { error: "Forbidden" },
      { status: 403 },
    );
  }

  await prisma.comment.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
