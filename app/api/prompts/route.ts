// app/api/prompts/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import cloudinary from "@/lib/cloudinary";


export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();

  const title = formData.get("title")?.toString() || "";
  const description = formData.get("description")?.toString() || "";
  const promptText = formData.get("promptText")?.toString() || "";
  const tagsRaw = formData.get("tags")?.toString() || "";
  const outputType = formData.get("outputType")?.toString() || "image"; // default
  const visibility = formData.get("visibility")?.toString() || "public"; // default
  const isDraft = formData.get("isDraft") === "true";

  const file = formData.get("image") as File | null;

  if (!title || !description) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const tags = tagsRaw
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  let imageUrl: string | undefined;

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

    imageUrl = uploadResult.secure_url;
  }

  const prompt = await prisma.prompt.create({
    data: {
      title,
      description,
      promptText,
      image: imageUrl,
      tags,
      outputType,
      visibility,
      isDraft,
      authorId: session.user.id,
    },
  });

  return NextResponse.json(prompt, { status: 201 });
}


export async function GET(_req: NextRequest) {
  const prompts = await prisma.prompt.findMany({
    orderBy: { createdAt: "desc" },
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

  return NextResponse.json(prompts);
}
