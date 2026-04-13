import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Bricolage_Grotesque, DM_Sans } from 'next/font/google'
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const bricolage = Bricolage_Grotesque({
  variable: '--font-display',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
})

const dmSans = DM_Sans({
  variable: '--font-body',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
})

export const metadata: Metadata = {
  title: "DPEMS - Digital Patient Experience Monitoring System | RSU Ja'far Medika",
  description:
    "Sistem monitoring pengalaman pasien berbasis digital untuk RSU Ja'far Medika Karanganyar. Fokus pada Integrative Medicine: Akupuntur, Herbal, dan Stroke Rehabilitation.",
  keywords: [
    "DPEMS",
    "Patient Experience",
    "RSU Ja'far Medika",
    "Integrative Medicine",
    "Akupuntur",
    "Herbal",
    "Stroke Rehabilitation",
    "SERVQUAL",
  ],
  authors: [{ name: "Imam Maliki Ja'far" }],
  icons: {
    icon: '/icon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${bricolage.variable} ${dmSans.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}