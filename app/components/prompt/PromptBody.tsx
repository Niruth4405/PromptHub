"use client";

import { useState } from "react";
import { Check, Copy as CopyIcon } from "lucide-react";

export default function PromptBody({ prompt }: { prompt: any }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const text = prompt.promptText || "";
    if (!text) return;

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  };

  return (
    <section className="bg-[#05060a] border border-white/10 rounded-2xl p-4 sm:p-5">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xs font-medium text-gray-300">Prompt</h2>
        <div className="flex items-center gap-2 text-[11px]">
          <button className="text-gray-400 hover:text-gray-200">
            Improve with AI
          </button>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-[11px] text-gray-100 hover:bg-white/15"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <CopyIcon className="w-3 h-3" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="rounded-xl bg-black/60 border border-white/10 px-3 py-3 text-[12px] sm:text-[13px] text-gray-200 font-mono whitespace-pre-wrap break-words">
        {prompt.promptText || "No prompt text provided."}
      </div>
    </section>
  );
}
