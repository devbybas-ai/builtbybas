import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SkipToContent } from "@/components/shared/SkipToContent";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default:
      "Custom Software & Web Development for Small Business - BuiltByBas",
    template: "%s - BuiltByBas",
  },
  description:
    "BuiltByBas delivers custom software, websites, and marketing solutions for small businesses. Agency-quality work at freelancer speed.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://builtbybas.com"
  ),
  openGraph: {
    type: "website",
    siteName: "BuiltByBas",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${inter.variable}`}>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <SkipToContent />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
