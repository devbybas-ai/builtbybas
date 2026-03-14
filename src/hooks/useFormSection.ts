import { useState, useEffect } from "react";

type Status = "idle" | "saving" | "success" | "error";

export function useFormSection() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "success" || status === "error") {
      const timer = setTimeout(() => setStatus("idle"), 3000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  return { status, setStatus, error, setError };
}
