// app/api/prompts/[id]/view/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = {
  params: Promise<{ id: string }>;
};

export async function POST(_req: NextRequest, { params }: Params) {
  const { id } = await params; // 👈 unwrap the Promise

  const updated = await prisma.prompt.update({
    where: { id },
    data: {
      views: { increment: 1 },
    },
    select: {
      id: true,
      views: true,
    },
  });

  return NextResponse.json(updated);
}
