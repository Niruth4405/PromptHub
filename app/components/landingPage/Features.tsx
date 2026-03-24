"use client";

import { motion } from "framer-motion";
import { Sparkles, GitBranch, DollarSign, Trophy } from "lucide-react";

const features = [
  {
    title: "Share & Discover",
    description:
      "Browse thousands of prompts from the community or share your own creations.",
    icon: Sparkles,
  },
  {
    title: "Remix & Improve",
    description:
      "Build on top of existing prompts. Fork, modify, and make them your own.",
    icon: GitBranch,
  },
  {
    title: "Monetize",
    description:
      "Sell your best prompts and templates. Earn from your expertise.",
    icon: DollarSign,
    highlight: true,
  },
  {
    title: "Compete",
    description:
      "Join benchmarks and challenges. Prove your prompt engineering skills.",
    icon: Trophy,
  },
];

export default function Features() {
  return (
    <section className="relative bg-black text-white py-24 px-6">
      {/* Subtle background glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-purple-600/10 blur-[120px]" />
      </div>

      {/* Header */}
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-semibold">
          Everything You Need
        </h2>
        <p className="mt-4 text-gray-400 text-sm md:text-base">
          A complete platform for prompt engineers to create, share, and grow.
        </p>
      </div>

      {/* Cards */}
      <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
        {features.map((feature, index) => {
          const Icon = feature.icon;

          return (
            <motion.div
              key={index}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.25 }}
              className={`group relative rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl p-6 transition-all
              ${
                feature.highlight
                  ? "border-purple-500/40 shadow-[0_0_40px_rgba(168,85,247,0.25)]"
                  : "hover:border-white/20"
              }`}
            >
              {/* Glow on hover */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition bg-gradient-to-br from-purple-500/10 to-transparent" />

              {/* Icon */}
              <div className="mb-4 w-10 h-10 flex items-center justify-center rounded-lg bg-purple-500/10 text-purple-400">
                <Icon size={20} />
              </div>

              {/* Title */}
              <h3 className="text-lg font-medium">{feature.title}</h3>

              {/* Description */}
              <p className="mt-2 text-sm text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}