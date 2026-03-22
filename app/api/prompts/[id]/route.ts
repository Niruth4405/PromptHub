// app/api/prompts/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import cloudinary from "@/lib/cloudinary";

type Params = { params: { id: string } };

export async function PATCH(req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const existing = await prisma.prompt.findUnique({
    where: { id: params.id },
    select: { authorId: true },
  });

  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (existing.authorId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const formData = await req.formData();

  const title = formData.get("title")?.toString();
  const description = formData.get("description")?.toString();
  const promptText = formData.get("promptText")?.toString();
  const tagsRaw = formData.get("tags")?.toString();
  const outputType = formData.get("outputType")?.toString();
  const visibility = formData.get("visibility")?.toString();
  const isDraftRaw = formData.get("isDraft")?.toString();

  const file = formData.get("image") as File | null;

  const data: any = {};

  if (title !== undefined) data.title = title;
  if (description !== undefined) data.description = description;
  if (promptText !== undefined) data.promptText = promptText;
  if (tagsRaw !== undefined) {
    data.tags = tagsRaw
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
  }
  if (outputType !== undefined) data.outputType = outputType;
  if (visibility !== undefined) data.visibility = visibility;
  if (isDraftRaw !== undefined) data.isDraft = isDraftRaw === "true";

  if (file) {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadResult = await new Promise<{ secure_url: string }>(
      (resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: "prompts" }, (error, result) => {
            if (error || !result) return reject(error);
            resolve(result as any);
          })
          .end(buffer);
      },
    );

    data.image = uploadResult.secure_url;
  }

  const updated = await prisma.prompt.update({
    where: { id: params.id },
    data,
  });

  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const prompt = await prisma.prompt.findUnique({
    where: { id: params.id },
    select: { authorId: true },
  });

  if (!prompt) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (prompt.authorId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.prompt.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
