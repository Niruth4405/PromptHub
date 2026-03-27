// api/follow/route.ts

import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// FOLLOW
export async function POST(req: Request) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { targetUserId } = await req.json();

  if (!targetUserId || targetUserId === userId) {
    return NextResponse.json({ error: "Invalid target" }, { status: 400 });
  }

  await prisma.follow.upsert({
    where: {
      followerId_followingId: {
        followerId: userId,
        followingId: targetUserId,
      },
    },
    update: {},
    create: {
      followerId: userId,     // YOU
      followingId: targetUserId, // THEM
    },
  });

  return NextResponse.json({ ok: true });
}

// UNFOLLOW / REMOVE FOLLOWER
export async function DELETE(req: Request) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { targetUserId, mode } = await req.json();

  if (!targetUserId || targetUserId === userId) {
    return NextResponse.json({ error: "Invalid target" }, { status: 400 });
  }

  if (mode === "remove-follower") {
    // someone follows YOU → remove them
    await prisma.follow.deleteMany({
      where: {
        followerId: targetUserId,
        followingId: userId,
      },
    });
  } else {
    // YOU unfollow someone
    await prisma.follow.deleteMany({
      where: {
        followerId: userId,
        followingId: targetUserId,
      },
    });
  }

  return NextResponse.json({ ok: true });
}