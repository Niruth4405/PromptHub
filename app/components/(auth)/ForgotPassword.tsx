"use client";

import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff, Loader2, ArrowLeft, Mail, KeyRound, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

type Step = "email" | "otp" | "password";

export default function ForgotPassword() {
  const router = useRouter();

  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  // ── Step 1: request OTP ──────────────────────────────────────────
  async function handleRequestOtp(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return toast.error("Please enter your email.");

    setLoading(true);
    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      toast.error(data.error || "Something went wrong.");
      return;
    }

    toast.success("OTP sent! Check your inbox.");
    setStep("otp");
    startResendCooldown();
  }

  // ── Step 2: verify OTP ───────────────────────────────────────────
  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    if (otp.length !== 6) return toast.error("Please enter the 6-digit OTP.");

    setLoading(true);
    const res = await fetch("/api/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      toast.error(data.error || "Invalid OTP.");
      return;
    }

    toast.success("OTP verified!");
    setStep("password");
  }

  // ── Step 3: set new password ─────────────────────────────────────
  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword.length < 8) return toast.error("Password must be at least 8 characters.");
    if (newPassword !== confirmPassword) return toast.error("Passwords do not match.");

    setLoading(true);
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp, newPassword }),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      toast.error(data.error || "Something went wrong.");
      return;
    }

    toast.success("Password reset successfully! Please sign in.");
    router.push("/login");
  }

  // ── Resend cooldown ──────────────────────────────────────────────
  function startResendCooldown() {
    setResendCooldown(60);
    const interval = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) { clearInterval(interval); return 0; }
        return prev - 1;
      });
    }, 1000);
  }

  async function handleResend() {
    if (resendCooldown > 0) return;
    setLoading(true);
    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) { toast.error(data.error || "Something went wrong."); return; }
    toast.success("New OTP sent!");
    startResendCooldown();
  }

  // ── Step labels ──────────────────────────────────────────────────
  const steps: { key: Step; label: string }[] = [
    { key: "email", label: "Email" },
    { key: "otp", label: "Verify" },
    { key: "password", label: "Reset" },
  ];
  const currentStepIndex = steps.findIndex((s) => s.key === step);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b0f1a] px-4">
      <div className="w-full max-w-md bg-[#0f172a] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl">

        {/* Header */}
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500" />
          <span className="text-white font-semibold text-lg">PromptHub</span>
        </div>

        {/* Progress steps */}
        <div className="flex items-center gap-2 mb-6">
          {steps.map((s, i) => (
            <div key={s.key} className="flex items-center gap-2 flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                    i < currentStepIndex
                      ? "bg-gradient-to-br from-purple-500 to-cyan-500 text-white"
                      : i === currentStepIndex
                      ? "bg-gradient-to-br from-purple-500 to-cyan-500 text-white ring-2 ring-purple-400/40"
                      : "bg-white/5 text-gray-500"
                  }`}
                >
                  {i < currentStepIndex ? "✓" : i + 1}
                </div>
                <span className={`text-xs mt-1 ${
                  i <= currentStepIndex ? "text-gray-300" : "text-gray-600"
                }`}>{s.label}</span>
              </div>
              {i < steps.length - 1 && (
                <div className={`h-px flex-1 mb-4 transition-colors ${
                  i < currentStepIndex ? "bg-purple-500" : "bg-white/10"
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* ── STEP 1: Email ─────────────────────────────────── */}
        {step === "email" && (
          <>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-purple-500/10">
                <Mail size={20} className="text-purple-400" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Forgot password?</h1>
                <p className="text-gray-400 text-sm">We&apos;ll send an OTP to your email.</p>
              </div>
            </div>

            <form onSubmit={handleRequestOtp} className="space-y-4">
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

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 rounded-lg bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-medium hover:opacity-90 transition disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading ? (<><Loader2 size={16} className="animate-spin" />Sending OTP...</>) : "Send OTP"}
              </button>
            </form>
          </>
        )}

        {/* ── STEP 2: OTP ───────────────────────────────────── */}
        {step === "otp" && (
          <>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-purple-500/10">
                <KeyRound size={20} className="text-purple-400" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Enter OTP</h1>
                <p className="text-gray-400 text-sm">Sent to <span className="text-purple-400">{email}</span></p>
              </div>
            </div>

            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <label className="text-sm text-gray-400">6-digit OTP</label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="123456"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  disabled={loading}
                  className="w-full mt-1 px-3 py-3 bg-[#0b0f1a] border border-white/10 rounded-lg text-white text-center text-2xl font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 rounded-lg bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-medium hover:opacity-90 transition disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading ? (<><Loader2 size={16} className="animate-spin" />Verifying...</>) : "Verify OTP"}
              </button>
            </form>

            <div className="flex items-center justify-between mt-4">
              <button
                onClick={() => setStep("email")}
                className="flex items-center gap-1 text-gray-400 text-sm hover:text-white transition"
              >
                <ArrowLeft size={14} /> Change email
              </button>
              <button
                onClick={handleResend}
                disabled={resendCooldown > 0 || loading}
                className="text-sm text-purple-400 hover:text-purple-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend OTP"}
              </button>
            </div>
          </>
        )}

        {/* ── STEP 3: New Password ───────────────────────────── */}
        {step === "password" && (
          <>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-purple-500/10">
                <Lock size={20} className="text-purple-400" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Set new password</h1>
                <p className="text-gray-400 text-sm">Choose a strong password (min 8 chars).</p>
              </div>
            </div>

            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="text-sm text-gray-400">New password</label>
                <div className="relative mt-1">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={loading}
                    className="w-full px-3 py-2 bg-[#0b0f1a] border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2.5 text-gray-400">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-400">Confirm password</label>
                <div className="relative mt-1">
                  <input
                    type={showConfirm ? "text" : "password"}
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={loading}
                    className="w-full px-3 py-2 bg-[#0b0f1a] border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
                  />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-2.5 text-gray-400">
                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Password strength hint */}
              {newPassword.length > 0 && (
                <div className="flex gap-1">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-colors ${
                        newPassword.length >= (i + 1) * 3
                          ? newPassword.length >= 12 ? "bg-green-500" : newPassword.length >= 8 ? "bg-yellow-500" : "bg-red-500"
                          : "bg-white/10"
                      }`}
                    />
                  ))}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 rounded-lg bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-medium hover:opacity-90 transition disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading ? (<><Loader2 size={16} className="animate-spin" />Resetting...</>) : "Reset Password"}
              </button>
            </form>
          </>
        )}

        {/* Footer */}
        <p className="text-center text-gray-400 text-sm mt-6">
          Remembered it?{" "}
          <Link href="/login" className="text-purple-400 hover:text-purple-300 transition">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
