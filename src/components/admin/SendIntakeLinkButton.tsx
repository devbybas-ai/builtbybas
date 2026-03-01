"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

export function SendIntakeLinkButton() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  const [errorMsg, setErrorMsg] = useState("");
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  async function handleSend() {
    if (!email.trim()) return;
    setStatus("sending");
    setErrorMsg("");

    try {
      const res = await fetch("/api/intake/send-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          name: name.trim() || undefined,
          message: message.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setStatus("error");
        setErrorMsg(data.error ?? "Failed to send");
        return;
      }

      setStatus("sent");
      setTimeout(() => {
        setOpen(false);
        setEmail("");
        setName("");
        setMessage("");
        setStatus("idle");
      }, 2000);
    } catch {
      setStatus("error");
      setErrorMsg("Network error");
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="rounded-lg bg-primary/20 px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/30"
      >
        Send Intake Link
      </button>

      {open && (
        <div
          ref={panelRef}
          className="absolute right-0 top-full z-50 mt-2 w-80 rounded-xl border border-white/10 bg-[#111115] p-5 shadow-2xl"
        >
          <h3 className="text-sm font-semibold text-foreground">
            Send Intake Link
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Email someone a direct link to the intake form.
          </p>

          <div className="mt-4 space-y-3">
            <div>
              <label
                htmlFor="send-link-email"
                className="block text-xs font-medium text-muted-foreground"
              >
                Email *
              </label>
              <input
                id="send-link-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="prospect@company.com"
                className="mt-1 h-9 w-full rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="send-link-name"
                className="block text-xs font-medium text-muted-foreground"
              >
                Name (optional)
              </label>
              <input
                id="send-link-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Their first name"
                className="mt-1 h-9 w-full rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="send-link-message"
                className="block text-xs font-medium text-muted-foreground"
              >
                Custom message (optional)
              </label>
              <textarea
                id="send-link-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Add a personal note..."
                rows={2}
                className="mt-1 w-full resize-none rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none"
              />
            </div>

            <button
              onClick={handleSend}
              disabled={!email.trim() || status === "sending" || status === "sent"}
              className={cn(
                "w-full rounded-lg py-2 text-sm font-semibold transition-all",
                status === "sent"
                  ? "bg-emerald-500/20 text-emerald-400"
                  : status === "error"
                    ? "bg-red-500/20 text-red-400"
                    : "bg-primary text-background hover:bg-primary/90 disabled:opacity-50",
              )}
            >
              {status === "idle" && "Send Email"}
              {status === "sending" && "Sending..."}
              {status === "sent" && "Sent!"}
              {status === "error" && "Try Again"}
            </button>

            {errorMsg && (
              <p className="text-xs text-red-400">{errorMsg}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
