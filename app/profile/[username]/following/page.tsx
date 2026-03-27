import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import FollowList, {
  FollowUser,
} from "../../../components/profile/FollowList";

export default async function FollowingPage({
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
  const followingData = await prisma.follow.findMany({
    where: {
      followerId: profileUser.id,
    },
    include: {
      following: {
        select: {
          id: true,
          username: true,
          name: true,
          image: true,
        },
      },
    },
  });

  const following: FollowUser[] = followingData.map((f) => ({
    id: f.following.id,
    username: f.following.username,
    name: f.following.name,
    image: f.following.image,
  }));

  return (
    <div className="min-h-screen bg-[#0b0f1a] text-white px-4 sm:px-6 lg:px-8 py-10">
      <div className="max-w-2xl mx-auto space-y-4">
        <h1 className="text-2xl font-semibold">
          People you are following
        </h1>

        <FollowList
          users={following}
          emptyLabel="You are not following anyone yet."
          actionLabel="Unfollow"
          mode="unfollow"
        />
      </div>
    </div>
  );
}
