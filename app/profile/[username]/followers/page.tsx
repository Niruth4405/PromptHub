import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import FollowList, {
  FollowUser,
} from "../../../components/profile/FollowList";

export default async function FollowersPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  if (!username) return notFound();

  const session = await auth();
  if (!session?.user?.id) return redirect("/login");

  const profileUser = await prisma.user.findUnique({
    where: { username },
    select: {
      id: true,
      username: true,
    },
  });

  if (!profileUser) return notFound();

  const isOwner = profileUser.id === session.user.id;
  if (!isOwner) {
    return redirect(`/profile/${username}`);
  }

  // ✅ FIXED DATA SOURCE (no relation confusion)
  const followersData = await prisma.follow.findMany({
    where: {
      followingId: profileUser.id,
    },
    include: {
      follower: {
        select: {
          id: true,
          username: true,
          name: true,
          image: true,
        },
      },
    },
  });

  const followers: FollowUser[] = followersData.map((f) => ({
    id: f.follower.id,
    username: f.follower.username,
    name: f.follower.name,
    image: f.follower.image,
  }));

  return (
    <div className="min-h-screen bg-[#0b0f1a] text-white px-4 sm:px-6 lg:px-8 py-10">
      <div className="max-w-2xl mx-auto space-y-4">
        <h1 className="text-2xl font-semibold">
          People who follow you
        </h1>

        <FollowList
          users={followers}
          emptyLabel="No followers yet."
          actionLabel="Remove"
          mode="remove-follower"
        />
      </div>
    </div>
  );
}

