import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import Link from "next/link";
import { MapPin, Globe } from "lucide-react";
import { BsLinkedin } from "react-icons/bs";
import { SiGithub } from "react-icons/si";
import { PromptCard } from "../../components/prompt/PromptCard";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  if (!username) return notFound();

  const session = await auth();

  const user = await prisma.user.findUnique({
    where: { username },
    include: {
      prompts: {
        orderBy: { createdAt: "desc" },
      },
      promptSaves: true, // 👈 include collections
    },
  });

  if (!user) return notFound();

  const isOwner = session?.user?.id === user.id;

  return (
    <div className="min-h-screen bg-[#0b0f1a] text-white px-4 sm:px-6 lg:px-8 py-10">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between gap-6 mb-10">
          <div className="flex gap-6">
            {/* Avatar */}
            <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-3xl font-bold">
              {user.name?.charAt(0) || "U"}
            </div>

            {/* Info */}
            <div>
              <h1 className="text-3xl font-bold">
                {user.name || "Unnamed User"}
              </h1>

              <p className="text-gray-400">@{user.username}</p>

              {user.designation && (
                <p className="text-gray-400">{user.designation}</p>
              )}

              {user.bio && (
                <p className="text-gray-300 mt-2 max-w-xl">{user.bio}</p>
              )}

              {/* ICON LINKS */}
              <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-400">
                {user.location && (
                  <div className="flex items-center gap-1">
                    <MapPin size={14} />
                    {user.location}
                  </div>
                )}

                {user.website && (
                  <Link
                    href={user.website}
                    target="_blank"
                    className="flex items-center gap-1 text-purple-400 hover:underline"
                  >
                    <Globe size={14} />
                    Website
                  </Link>
                )}

                {user.linkedin && (
                  <Link
                    href={user.linkedin}
                    target="_blank"
                    className="flex items-center gap-1 text-purple-400 hover:underline"
                  >
                    <BsLinkedin size={14} />
                    Linkedin
                  </Link>
                )}

                {user.github && (
                  <Link
                    href={user.github}
                    target="_blank"
                    className="flex items-center gap-1 text-purple-400 hover:underline"
                  >
                    <SiGithub size={14} />
                    GitHub
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* EDIT BUTTON */}
          {isOwner && (
            <Link
              href="/profile/edit"
              className="h-fit px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-cyan-500 text-sm"
            >
              Edit Profile
            </Link>
          )}
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <StatCard label="Prompts" value={user.prompts.length} />
          <StatCard label="Collections" value={user.promptSaves.length} />
          <StatCard
            label="Total Likes"
            value={user.prompts.reduce((a, p) => a + p.likes, 0)}
          />
          <StatCard
            label="Total Views"
            value={user.prompts.reduce((a, p) => a + p.views, 0)}
          />
        </div>

        {/* EXPERTISE */}
        {user.expertise?.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-3">Areas of Expertise</h2>

            <div className="flex flex-wrap gap-2">
              {user.expertise.map((item) => (
                <span
                  key={item}
                  className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-sm"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* TOOLS */}
        {user.tools?.length > 0 && (
          <div className="mb-10">
            <h2 className="text-lg font-semibold mb-3">Tools Mastered</h2>

            <div className="flex flex-wrap gap-2">
              {user.tools.map((tool) => (
                <span
                  key={tool}
                  className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-sm"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* PROMPTS */}
        <div>
          <h2 className="text-xl font-semibold mb-6">My Prompts</h2>

          {user.prompts.length === 0 ? (
            <p className="text-gray-400">No prompts yet.</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {user.prompts.map((prompt) => (
                <PromptCard
                  key={prompt.id}
                  id={prompt.id}
                  title={prompt.title}
                  description={prompt.description}
                  image={prompt.image}
                  tags={prompt.tags}
                  tool={prompt.outputType || undefined}
                  likes={prompt.likes}
                  views={prompt.views}
                  author={{
                    id: user.id,
                    username: user.username,
                    name: user.name,
                    image: user.image,
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* STAT CARD */
function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-[#111827] border border-white/10 rounded-xl p-4">
      <p className="text-xl font-bold">{value}</p>
      <p className="text-sm text-gray-400">{label}</p>
    </div>
  );
}
