import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";
import { LocalBusinessSchema } from "@/components/seo/SchemaOrg";
import { siteConfig } from "@/config/site";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "Centre Ashifa | Roqya-Thérapie & TCC à Strasbourg",
    template: "%s | Centre Ashifa",
  },
  description: siteConfig.description,
  keywords: [
    "roqya",
    "roqya strasbourg",
    "roqya thérapie",
    "centre ashifa",
    "thérapie cognitive comportementale",
    "TCC strasbourg",
    "séances au cabinet",
    "roqya coran",
    "mal occulte",
    "sihr",
    "mauvais oeil",
  ],
  authors: [{ name: siteConfig.practitioner.name }],
  creator: siteConfig.name,
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: "Centre Ashifa | Roqya-Thérapie & TCC à Strasbourg",
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: "Centre Ashifa | Roqya-Thérapie à Strasbourg",
    description: siteConfig.description,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        <LocalBusinessSchema />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Header />
        <main>{children}</main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
