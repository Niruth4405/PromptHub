"use client";

import { motion } from "framer-motion";

const categories = [
  "Art",
  "Development",
  "Marketing",
  "Writing",
  "Video",
  "Product",
  "Fantasy",
  "Portraits",
  "Architecture",
  "Nature",
];

export default function Categories() {
  return (
    <section className="relative bg-black text-white py-20 px-6">
      {/* Background glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-[500px] h-[200px] bg-purple-600/10 blur-[120px]" />
      </div>

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-semibold">
          Browse by Category
        </h2>
        <p className="mt-3 text-gray-400 text-sm md:text-base">
          Find prompts for any creative need
        </p>
      </div>

      {/* Categories */}
      <div className="mt-10 flex flex-wrap justify-center gap-3 max-w-5xl mx-auto">
        {categories.map((category, index) => (
          <motion.button
            key={index}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="px-5 py-2 text-sm rounded-full border border-white/10 bg-white/[0.02] backdrop-blur-md
                       hover:border-purple-400/40 hover:text-white hover:bg-white/5
                       transition-all duration-200"
          >
            {category}
          </motion.button>
        ))}
      </div>

      {/* Bottom divider */}
      <div className="mt-16 h-px w-full bg-white/5" />
    </section>
  );
}