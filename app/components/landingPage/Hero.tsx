"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative w-full overflow-hidden bg-[#030712] text-white">
      {/* Animated Background Glow */}
      <div className="absolute inset-0 z-0">
        <motion.div
          className="absolute w-[500px] h-[500px] bg-purple-600 rounded-full blur-[120px] opacity-30"
          animate={{
            x: [0, 100, -50, 0],
            y: [0, -80, 60, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ top: "10%", left: "20%" }}
        />

        <motion.div
          className="absolute w-[500px] h-[500px] bg-emerald-500 rounded-full blur-[120px] opacity-30"
          animate={{
            x: [0, -120, 60, 0],
            y: [0, 100, -50, 0],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ bottom: "10%", right: "20%" }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-24 text-center flex flex-col items-center">
        {/* Badge */}
        <div className="mb-6 px-4 py-1 text-sm rounded-full border border-purple-500/30 bg-purple-500/10 backdrop-blur">
          ✨ The #1 Prompt Engineering Community
        </div>

        {/* Heading */}
        <h1 className="text-4xl md:text-6xl font-bold leading-tight max-w-4xl">
          Where Prompt Engineers
          <br />
          <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 text-transparent bg-clip-text">
            Share, Learn & Earn
          </span>
        </h1>

        {/* Description */}
        <p className="mt-6 text-gray-400 max-w-2xl text-base md:text-lg">
          Discover prompts that work. Share your creations with the world. Build
          a following and monetize your expertise.
        </p>

        {/* Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <Link href="/explore">
            <button className="px-6 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-cyan-500 hover:opacity-90 transition font-medium">
              Explore Prompts →
            </button>
          </Link>
          <Link href="/shareOrEditPrompt">
            <button className="px-6 py-3 rounded-lg border border-gray-700 hover:bg-white/5 transition">
              Share a Prompt
            </button>
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 w-full max-w-4xl text-center">
          {[
            { value: "50K+", label: "Prompts" },
            { value: "12K+", label: "Creators" },
            { value: "2M+", label: "Remixes" },
            { value: "$1.2M", label: "Earned" },
          ].map((stat, i) => (
            <div key={i}>
              <p className="text-2xl md:text-3xl font-semibold text-blue-400">
                {stat.value}
              </p>
              <p className="text-gray-500 text-sm mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
