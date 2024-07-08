import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google"
import "./globals.css";
import { cn } from "@/lib/utils";
import DotGridPattern from "@/components/DotGridPattern";
import { Navbar } from "@/components/Navbar";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Array-2-CSV Converter",
  description: "Easily transform your array of objects into downloadable CSV files.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased relative z-10",
          fontSans.variable
        )}
      >
        <DotGridPattern className="opacity-30 -z-10" />
        <Navbar />
        {children}
      </body>
    </html>
  );
}
