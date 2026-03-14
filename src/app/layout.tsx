import type { Metadata } from "next";
import Script from "next/script";
import { Inter, Outfit } from "next/font/google";
import { SkipToContent } from "@/components/shared/SkipToContent";
import { ScrollToTop } from "@/components/shared/ScrollToTop";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { Toaster } from "@/components/ui/sonner";
import { JsonLd } from "@/components/shared/JsonLd";
import { getOrganizationSchema } from "@/lib/json-ld";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
  weight: ["600", "700"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: {
    default:
      "Custom Software & Web Development - BuiltByBas",
    template: "%s - BuiltByBas",
  },
  description:
    "BuiltByBas delivers custom software, websites, and marketing solutions for businesses ready to grow. Full-stack development and strategic marketing — precision-engineered, no templates, no shortcuts.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://builtbybas.com"
  ),
  openGraph: {
    type: "website",
    siteName: "BuiltByBas",
    locale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "BuiltByBas - Custom Software & Web Development",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${outfit.variable} overflow-x-hidden`}>
      <head>
        <JsonLd data={getOrganizationSchema()} />
        <Script
          src={process.env.NEXT_PUBLIC_UMAMI_URL || "https://analytics.builtbybas.com/script.js"}
          data-website-id={process.env.NEXT_PUBLIC_UMAMI_ID || "1ff108d4-6963-4543-a838-a0d62a6ae979"}
          strategy="afterInteractive"
        />
      </head>
      <body className="min-h-screen overflow-x-hidden bg-background font-sans text-foreground antialiased">
        <SkipToContent />
        <ScrollToTop />
        <MotionProvider>
          {children}
        </MotionProvider>
        <Toaster />
      </body>
    </html>
  );
}
