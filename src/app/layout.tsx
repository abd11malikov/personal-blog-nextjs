import type { Metadata } from "next";
import "./globals.css";
import ConditionalNavbar from "@/components/ConditionalNavbar";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: "WebNotes — Engineering the Future of Web",
  description:
    "A bespoke full-stack CMS built with Spring Boot 3 and Next.js 16. Engineered for performance, scale, and mastery.",
  openGraph: {
    title: "WebNotes — Engineering the Future of Web",
    description:
      "A bespoke full-stack CMS built with Spring Boot 3 and Next.js 16.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300&family=Syne:wght@400;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <AuthProvider>
          <ConditionalNavbar />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
