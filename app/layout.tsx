import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HangarOn - Digital Wardrobe Manager",
  description: "Your privacy-focused digital wardrobe manager",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className="antialiased font-sans">
        {children}
      </body>
    </html>
  );
}