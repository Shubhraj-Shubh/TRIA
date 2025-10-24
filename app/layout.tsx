import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers"; 
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Contact Manager - Organize Your Contacts Easily",
  description: "A modern, feature-rich contact management system with search, filtering, sorting, and beautiful animations.",
  keywords: "contact manager, contacts, address book, CRM, contact management",
  authors: [{ name: "Contact Manager" }],
  openGraph: {
    title: "Contact Manager - Organize Your Contacts",
    description: "Modern contact management with advanced filtering and beautiful UI",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Manager",
    description: "Modern contact management system",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          {children}
          <Toaster 
            position="top-right" 
            richColors 
            closeButton
            duration={3000}
          />
        </Providers>
      </body>
    </html>
  );
}