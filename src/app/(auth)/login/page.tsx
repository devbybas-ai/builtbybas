import type { Metadata } from "next";
import { GlassCard } from "@/components/shared/GlassCard";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Login",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <GlassCard>
      <h2 className="text-lg font-semibold text-foreground">Sign in</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Enter your credentials to access your account.
      </p>
      <LoginForm />
    </GlassCard>
  );
}
