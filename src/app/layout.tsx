import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mechanic Booking System",
  description: "Feature-complete CRUD for mechanic service bookings",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}