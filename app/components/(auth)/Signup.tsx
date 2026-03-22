"use client";

import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();

    const name = `${firstName} ${lastName}`;

    const res = await fetch("/api/signup", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error);
      return;
    }

    // auto login
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    router.push("/dashboard");
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
          <Link
            href="/login"
            className="flex-1 py-2 text-center text-gray-400 text-sm"
          >
            Sign In
          </Link>
          <button className="flex-1 py-2 rounded-md bg-[#0f172a] text-white text-sm">
            Sign Up
          </button>
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
          Create account
        </h1>
        <p className="text-gray-400 text-sm mb-6">
          Join thousands of teams building with Vertex.
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
          OR REGISTER WITH EMAIL
          <div className="flex-1 h-px bg-white/10" />
        </div>

        {/* Form */}
        <form onSubmit={handleSignup} className="space-y-4">
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="First name"
              onChange={(e) => setFirstName(e.target.value)}
              className="w-1/2 px-3 py-2 bg-[#0b0f1a] border border-white/10 rounded-lg text-white"
            />
            <input
              type="text"
              placeholder="Last name"
              onChange={(e) => setLastName(e.target.value)}
              className="w-1/2 px-3 py-2 bg-[#0b0f1a] border border-white/10 rounded-lg text-white"
            />
          </div>

          <input
            type="email"
            placeholder="Email address"
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 bg-[#0b0f1a] border border-white/10 rounded-lg text-white"
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Create a strong password"
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 bg-[#0b0f1a] border border-white/10 rounded-lg text-white"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 text-gray-400"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <input
            type="password"
            placeholder="Confirm password"
            className="w-full px-3 py-2 bg-[#0b0f1a] border border-white/10 rounded-lg text-white"
          />

          <label className="flex items-center gap-2 text-sm text-gray-400">
            <input type="checkbox" className="accent-purple-500" />
            I agree to the{" "}
            <span className="text-purple-400">Terms</span> and{" "}
            <span className="text-purple-400">Privacy Policy</span>
          </label>

          <button
            type="submit"
            className="w-full py-2 rounded-lg bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-medium hover:opacity-90 transition"
          >
            Create Account
          </button>
        </form>

        <p className="text-center text-gray-400 text-sm mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-purple-400">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}