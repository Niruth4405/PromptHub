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

  const existing = await prisma.promptSave.findUnique({
    where: {
      userId_promptId: {
        userId,
        promptId: id,
      },
    },
  }).catch(() => null);

  let saved: boolean;

  if (existing) {
    await prisma.promptSave.delete({
      where: { id: existing.id },
    });
    saved = false;
  } else {
    await prisma.promptSave.create({
      data: {
        userId,
        promptId: id,
      },
    });
    saved = true;
  }

  return NextResponse.json({ saved });
}
