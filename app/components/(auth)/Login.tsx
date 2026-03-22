"use client";

import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      alert("Invalid credentials");
    } else {
      router.push("/dashboard");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b0f1a] px-4">
      <div className="w-full max-w-md bg-[#0f172a] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl">

        {/* Header */}
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500" />
          <span className="text-white font-semibold text-lg">PromptHub</span>
        </div>

        {/* Tabs */}
        <div className="flex bg-[#0b0f1a] rounded-lg p-1 mb-6">
          <button className="flex-1 py-2 rounded-md bg-[#0f172a] text-white text-sm">
            Sign In
          </button>
          <Link
            href="/signup"
            className="flex-1 py-2 text-center text-gray-400 text-sm"
          >
            Sign Up
          </Link>
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
          Welcome back
        </h1>
        <p className="text-gray-400 text-sm mb-6">
          Sign in to continue to your workspace.
        </p>

        {/* Social */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => signIn("google")}
            className="flex-1 py-2 border border-white/10 rounded-lg text-white hover:bg-white/5"
          >
            Google
          </button>
          <button
            onClick={() => signIn("github")}
            className="flex-1 py-2 border border-white/10 rounded-lg text-white hover:bg-white/5"
          >
            GitHub
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-2 text-gray-500 text-xs mb-6">
          <div className="flex-1 h-px bg-white/10" />
          OR CONTINUE WITH EMAIL
          <div className="flex-1 h-px bg-white/10" />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-gray-400">Email address</label>
            <input
              type="email"
              placeholder="you@example.com"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 px-3 py-2 bg-[#0b0f1a] border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <div className="flex justify-between text-sm text-gray-400">
              <label>Password</label>
              <Link href="#" className="text-purple-400">
                Forgot password?
              </Link>
            </div>

            <div className="relative mt-1">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 bg-[#0b0f1a] border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-gray-400"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full py-2 rounded-lg bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-medium hover:opacity-90 transition"
          >
            Sign In
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-gray-400 text-sm mt-6">
          Don’t have an account?{" "}
          <Link href="/signup" className="text-purple-400">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}