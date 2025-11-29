import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import AuthProvider from "@/components/AuthProvider";

export const metadata: Metadata = {
  title: "Movie List System",
  description: "Simple CRUD movie list application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
