import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Silence Possibilities — What You Could Build With MPC",
  description:
    "Interactive previews of privacy-preserving computation applications across financial services, AI, and beyond. Powered by Silence Laboratories.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
