// components/prompt/PromptViewTracker.tsx
"use client";

import { useEffect } from "react";

export function PromptViewTracker({ id }: { id: string }) {
  useEffect(() => {
    fetch(`/api/prompts/${id}/view`, { method: "POST" }).catch(() => {});
  }, [id]);

  return null;
}
