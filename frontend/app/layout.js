import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import CursorFollower from "@/components/layout/CursorFollower";
import FooterSection from "@/components/layout/FooterSection";
import ScrollToTop from "@/components/common/ScrollToTop";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL('http://localhost:3000'),
  title: "Tridev Labels - Precision Printing",
  description: "Excellence in label printing and packaging.",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://i.pinimg.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="http://localhost:5000" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://i.pinimg.com" />
        <link rel="dns-prefetch" href="http://localhost:5000" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* <CursorFollower /> */}
        <Header />
        <ScrollToTop />
        <main className="">
          {children}
        </main>
              <FooterSection />
      </body>
    </html>
  );
}
