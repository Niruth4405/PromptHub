import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

type Params = {
  params: Promise<{ id: string }>;
};

export async function POST(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  const existing = await prisma.promptLike.findUnique({
    where: {
      userId_promptId: {
        userId,
        promptId: id,
      },
    },
  }).catch(() => null);

  let liked: boolean;
  let likesCount: number;

  if (existing) {
    // remove like
    await prisma.promptLike.delete({
      where: { id: existing.id },
    });

    const updatedPrompt = await prisma.prompt.update({
      where: { id },
      data: { likes: { decrement: 1 } },
      select: { likes: true },
    });

    liked = false;
    likesCount = updatedPrompt.likes;
  } else {
    // add like
    await prisma.promptLike.create({
      data: {
        userId,
        promptId: id,
      },
    });

    const updatedPrompt = await prisma.prompt.update({
      where: { id },
      data: { likes: { increment: 1 } },
      select: { likes: true },
    });

    liked = true;
    likesCount = updatedPrompt.likes;
  }

  return NextResponse.json({ liked, likes: likesCount });
}
