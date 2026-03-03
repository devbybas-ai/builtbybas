import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/shared/Sidebar";

export const metadata: Metadata = {
  title: "BBB Demo Platform — BuiltByBas",
  description: "16 interactive business system demos by BuiltByBas",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen" style={{ background: "#0A0A0F" }}>
          <Sidebar />
          <main className="flex-1 ml-56 min-h-screen">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
