"use client";

import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  const callbackUrl = searchParams.get("callbackUrl") || "/";

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();

    if (!firstName.trim() || !email || !password) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }

    if (!agreed) {
      toast.error("Please accept the Terms and Privacy Policy.");
      return;
    }

    setLoading(true);

    const name = `${firstName.trim()} ${lastName.trim()}`.trim();

    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setLoading(false);
      toast.error(data.error || "Signup failed. Please try again.");
      return;
    }

    // Auto login after successful signup
    const signInRes = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (signInRes?.error) {
      // Account created but auto-login failed — send to login page
      toast.success("Account created! Please sign in.");
      router.push("/login");
      return;
    }

    toast.success("Account created! Welcome to PromptHub 🎉");
    router.push(callbackUrl);
    router.refresh();
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
            className="flex-1 py-2 text-center text-gray-400 text-sm hover:text-white transition"
          >
            Sign In
          </Link>
          <button className="flex-1 py-2 rounded-md bg-[#0f172a] text-white text-sm font-medium">
            Sign Up
          </button>
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
          Create account
        </h1>
        <p className="text-gray-400 text-sm mb-6">
          Join the PromptHub community today.
        </p>

        {/* Social */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => signIn("google", { callbackUrl })}
            className="flex-1 py-2 border border-white/10 rounded-lg text-white text-sm hover:bg-white/5 transition"
          >
            Google
          </button>
          <button
            onClick={() => signIn("github", { callbackUrl })}
            className="flex-1 py-2 border border-white/10 rounded-lg text-white text-sm hover:bg-white/5 transition"
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
              placeholder="First name *"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              disabled={loading}
              className="w-1/2 px-3 py-2 bg-[#0b0f1a] border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
            />
            <input
              type="text"
              placeholder="Last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              disabled={loading}
              className="w-1/2 px-3 py-2 bg-[#0b0f1a] border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
            />
          </div>

          <input
            type="email"
            placeholder="Email address *"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            className="w-full px-3 py-2 bg-[#0b0f1a] border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Create a strong password *"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              className="w-full px-3 py-2 bg-[#0b0f1a] border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 text-gray-400"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              placeholder="Confirm password *"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
              className="w-full px-3 py-2 bg-[#0b0f1a] border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-2.5 text-gray-400"
            >
              {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="accent-purple-500"
            />
            I agree to the{" "}
            <span className="text-purple-400">Terms</span> and{" "}
            <span className="text-purple-400">Privacy Policy</span>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-lg bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-medium hover:opacity-90 transition disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Creating account...
              </>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <p className="text-center text-gray-400 text-sm mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-purple-400 hover:text-purple-300 transition">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}