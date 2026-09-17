"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, UploadCloud } from "lucide-react";

export function InvoiceUpload({ aiConfigured }: { aiConfigured: boolean }) {
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const files = inputRef.current?.files;
    if (!files || files.length === 0) {
      setMessage("Choose at least one invoice image first.");
      return;
    }

    const formData = new FormData();
    Array.from(files).forEach((f) => formData.append("invoices", f));

    setPending(true);
    setMessage(null);
    try {
      const res = await fetch("/api/orders/extract", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error ?? "Something went wrong extracting the invoices.");
      } else {
        const total = data.results.reduce((sum: number, r: { itemCount: number }) => sum + r.itemCount, 0);
        setMessage(`Extracted ${total} line item${total === 1 ? "" : "s"} from ${data.results.length} invoice${data.results.length === 1 ? "" : "s"}.`);
        if (inputRef.current) inputRef.current.value = "";
        router.refresh();
      }
    } catch {
      setMessage("Upload failed. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="glass-card flex w-full flex-col gap-4 rounded-3xl p-6">
      <div>
        <h2 className="text-xl font-bold">Upload order invoices</h2>
        <p className="text-sm text-foreground/70">
          Upload photos or scans of your last 30 days of purchase invoices. AI extracts product names,
          order frequency and pack/unit quantities.
        </p>
      </div>

      {!aiConfigured && (
        <p className="rounded-xl bg-amber-500/15 px-4 py-2.5 text-sm text-amber-700 dark:text-amber-300">
          Add a <code>GEMINI_API_KEY</code> to your .env file to enable AI extraction.
        </p>
      )}

      <input
        ref={inputRef}
        type="file"
        name="invoices"
        accept="image/*,.pdf"
        multiple
        disabled={!aiConfigured || pending}
        className="rounded-xl border border-dashed border-maroon/30 bg-white/60 px-4 py-3 text-sm file:mr-3 file:rounded-full file:border-0 file:bg-maroon file:px-4 file:py-2 file:text-white dark:bg-white/5"
      />

      <button
        type="submit"
        disabled={!aiConfigured || pending}
        className="flex items-center justify-center gap-2 self-start rounded-full bg-maroon px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-maroon-dark disabled:cursor-not-allowed disabled:opacity-50"
      >
        {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <UploadCloud className="h-4 w-4" />}
        {pending ? "Analyzing invoices..." : "Extract with AI"}
      </button>

      {message && <p className="text-sm text-foreground/80">{message}</p>}
    </form>
  );
}
