"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Sparkles } from "lucide-react";

export function AiActionButton({
  endpoint,
  label,
  disabled,
  disabledReason,
}: {
  endpoint: string;
  label: string;
  disabled?: boolean;
  disabledReason?: string;
}) {
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  async function run() {
    setPending(true);
    setMessage(null);
    try {
      const res = await fetch(endpoint, { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error ?? "Something went wrong.");
      } else {
        router.refresh();
      }
    } catch {
      setMessage("Request failed. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-1.5">
      <button
        type="button"
        onClick={run}
        disabled={disabled || pending}
        className="flex items-center gap-2 rounded-full bg-maroon px-4 py-2 text-sm font-semibold text-white transition hover:bg-maroon-dark disabled:cursor-not-allowed disabled:opacity-50"
      >
        {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
        {pending ? "Thinking..." : label}
      </button>
      {disabled && disabledReason && (
        <p className="text-xs text-foreground/60">{disabledReason}</p>
      )}
      {message && <p className="text-xs text-rose-600 dark:text-rose-400">{message}</p>}
    </div>
  );
}
