import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { WalletContextProvider } from "../components/wallet/wallet-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Aethel AI - Agent Management Platform",
  description: "Create, manage, and interact with multiple AI agents. Experience comprehensive agent lifecycle management with Aethel AI's intuitive interface.",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/favicon.ico",
  },
  other: {
    "wallet-connect-name": "Aethel AI",
    "wallet-connect-description": "Next Generation AI Platform",
    "wallet-connect-icon": "/favicon.ico",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="apple-touch-icon" href="/favicon.ico" />
        <meta name="application-name" content="Aethel AI" />
        <meta name="apple-mobile-web-app-title" content="Aethel AI" />
        <meta property="og:site_name" content="Aethel AI" />
        <meta property="og:image" content="/favicon.ico" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <WalletContextProvider>
          {children}
        </WalletContextProvider>
      </body>
    </html>
  );
}
