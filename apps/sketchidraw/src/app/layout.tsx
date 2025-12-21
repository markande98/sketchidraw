import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import { SessionProvider } from "next-auth/react";
import { auth } from "../../auth";
import { ThemeSync } from "@/components/theme-sync";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  icons: {
    icon: "/images/sketchidraw.svg",
    shortcut: "/images/sketchidraw.svg",
    apple: "/images/sketchidraw.svg",
  },
  title:
    "Sketchidraw | Collaborative Whiteboard 👉 Secure 👋 Hand-drawn look & feel",
  description: "Collaborative Whiteboard with Secure Hand-drawn look & feel",
  openGraph: {
    title: "Sketchidraw | Collaborative Whiteboard",
    description: "Collaborative Whiteboard with Secure Hand-drawn look & feel",
    images: [
      {
        url: "https://sketchidraw.com/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "Sketchidraw - Collaborative Whiteboard",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sketchidraw | Collaborative Whiteboard",
    description: "Collaborative Whiteboard with Secure Hand-drawn look & feel",
    images: ["/images/Banner.png"],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <SessionProvider session={session}>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <Toaster />
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ThemeSync />
            {children}
            <Analytics />
          </ThemeProvider>
        </body>
      </html>
    </SessionProvider>
  );
}
