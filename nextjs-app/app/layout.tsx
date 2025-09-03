import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { NavigationMenu } from "@/components/navigation-menu";
import { MobileNav } from "@/components/mobile-nav";
import { getUser } from "@/lib/utils/server";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Global (default) metadata for the entire site. Individual pages can override pieces.
export const metadata: Metadata = {
  // Updated to use www host (site enforces redirect to www)
  metadataBase: new URL("https://www.tudor-dev.com"),
  title: {
    default: "Tudor Caseru – Full‑Stack Developer Portfolio",
    template: "%s | Tudor Caseru"
  },
  description:
    "Portfolio of Tudor Caseru – Full‑stack engineer building performant web applications, APIs, and AI‑powered experiences.",
  applicationName: "Tudor Caseru Portfolio",
  authors: [{ name: "Tudor Caseru" }],
  creator: "Tudor Caseru",
  publisher: "Tudor Caseru",
  keywords: [
    "Tudor Caseru",
    "Full Stack Developer",
    "Software Engineer",
    "Portfolio",
    "React",
    "Next.js",
    "TypeScript",
    "ASP.NET Core",
    "PostgreSQL",
    "AI",
    "Chatbot"
  ],
  category: "technology",
  openGraph: {
    title: "Tudor Caseru – Full‑Stack Developer Portfolio",
    description:
      "Projects, skills, and experiments in web engineering, APIs, and AI integration.",
    url: "https://www.tudor-dev.com",
    siteName: "Tudor Caseru Portfolio",
    images: [
      {
        url: "/api/og?title=Tudor%20Caseru%20Portfolio",
        width: 1200,
        height: 630,
        alt: "Tudor Caseru – Portfolio"
      }
    ],
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Tudor Caseru – Full‑Stack Developer Portfolio",
    description:
      "Full‑stack web development, scalable APIs, and AI‑powered product features.",
    creator: "@tudorcaseru",
    images: ["/api/og?title=Tudor%20Caseru%20Portfolio"]
  },
  alternates: {
    canonical: "/"
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1
    }
  }
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUser();
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <div className="flex flex-col min-h-screen">
            <div className="w-full flex justify-end p-4">
              <NavigationMenu
                className="hidden md:flex"
                {...(user ? { user } : {})}
              />
              <MobileNav {...(user ? { user } : {})} />
            </div>
            <div className="flex-1 flex flex-col">{children}</div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
