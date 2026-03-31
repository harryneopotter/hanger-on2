import type { Metadata } from "next";
import NextAuthProvider from '@/components/providers/NextAuthProvider';
import { DarkModeProvider } from '@/contexts/DarkModeContext';
import "./globals.css";

export const metadata: Metadata = {
  title: "Hanger On - Digital Wardrobe Manager",
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
        <NextAuthProvider>
          <DarkModeProvider>
            {children}
          </DarkModeProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
