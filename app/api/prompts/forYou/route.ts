// app/api/prompts/for-you/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET(_req: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  // 1. Get users current user follows
  const following = await prisma.follow.findMany({
    where: {
      followerId: userId,
    },
    select: {
      followingId: true,
    },
  });

  const followingIds = following.map((f) => f.followingId);

  // 🔥 Edge case: user follows nobody
  if (followingIds.length === 0) {
    const fallbackPrompts = await prisma.prompt.findMany({
      where: {
        isDraft: false,
        visibility: "public",
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 20,
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

    return NextResponse.json(fallbackPrompts);
  }

  // 2. Get prompts from followed users
  const prompts = await prisma.prompt.findMany({
    where: {
      authorId: { in: followingIds },
      isDraft: false,
      visibility: "public",
    },
    orderBy: {
      createdAt: "desc",
    },
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