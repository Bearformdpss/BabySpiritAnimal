import type { Metadata } from "next";
import { Fredoka } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

// Kid-friendly rounded font
const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Baby Spirit Animal Trading Card Creator",
  description: "Discover your magical baby spirit animal and create your own Ultra Rare trading card!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${fredoka.className} antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
