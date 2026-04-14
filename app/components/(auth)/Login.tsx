"use client";

import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  const callbackUrl = searchParams.get("callbackUrl") || "/";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill in all fields.");
      return;
    }

    setLoading(true);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      toast.error("Invalid email or password.");
    } else {
      toast.success("Welcome back! 👋");
      router.push(callbackUrl);
      router.refresh();
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
          <button className="flex-1 py-2 rounded-md bg-[#0f172a] text-white text-sm font-medium">
            Sign In
          </button>
          <Link href="/signup" className="flex-1 py-2 text-center text-gray-400 text-sm hover:text-white transition">
            Sign Up
          </Link>
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Welcome back</h1>
        <p className="text-gray-400 text-sm mb-6">Sign in to continue to your workspace.</p>

        {/* Social Login */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => {
              toast.loading("Redirecting to Google...", { id: "oauth", duration: 4000 });
              signIn("google", { callbackUrl });
            }}
            className="flex-1 py-2 border border-white/10 rounded-lg text-white text-sm hover:bg-white/5 transition"
          >
            Google
          </button>
          <button
            onClick={() => {
              toast.loading("Redirecting to GitHub...", { id: "oauth", duration: 4000 });
              signIn("github", { callbackUrl });
            }}
            className="flex-1 py-2 border border-white/10 rounded-lg text-white text-sm hover:bg-white/5 transition"
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="w-full mt-1 px-3 py-2 bg-[#0b0f1a] border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
            />
          </div>

          <div>
            <div className="flex justify-between text-sm text-gray-400">
              <label>Password</label>
              <Link href="#" className="text-purple-400 hover:text-purple-300 transition">Forgot password?</Link>
            </div>
            <div className="relative mt-1">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="w-full px-3 py-2 bg-[#0b0f1a] border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2.5 text-gray-400">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-lg bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-medium hover:opacity-90 transition disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? (<><Loader2 size={16} className="animate-spin" />Signing in...</>) : "Sign In"}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-gray-400 text-sm mt-6">
          {"Don't have an account?"}
          <Link href="/signup" className="text-purple-400 hover:text-purple-300 transition">Create one</Link>
        </p>
      </div>
    </div>
  );
}
