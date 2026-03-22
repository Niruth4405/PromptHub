"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null; // prevents hydration error

  return (
    <div className="fixed top-6 right-6 flex bg-surface border border-border rounded-full p-1">
      <button
        onClick={() => setTheme("dark")}
        className={`px-4 py-1 rounded-full text-sm ${
          theme === "dark"
            ? "bg-accent text-white"
            : "text-muted"
        }`}
      >
        🌙 Dark
      </button>

      <button
        onClick={() => setTheme("light")}
        className={`px-4 py-1 rounded-full text-sm ${
          theme === "light"
            ? "bg-accent text-white"
            : "text-muted"
        }`}
      >
        ☀️ Light
      </button>
    </div>
  );
}