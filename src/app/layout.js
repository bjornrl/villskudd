import { Host_Grotesk, DM_Mono } from "next/font/google";

import ClientLayout from "@/client-layout";
import { SanityLive } from "@/sanity/lib/live";
import { sanityFetch } from "@/sanity/lib/live";
import { NAV_QUERY } from "@/sanity/lib/queries";

import "./globals.css";

const hostGrotesk = Host_Grotesk({
  subsets: ["latin"],
  variable: "--font-host-grotesk",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-dm-mono",
});

export const metadata = {
  title: "Villskudd",
  description: "Villskudd — official site",
};

export default async function RootLayout({ children }) {
  const { data: nav } = await sanityFetch({ query: NAV_QUERY });

  return (
    <html lang="en">
      <body className={`${hostGrotesk.variable} ${dmMono.variable}`}>
        <ClientLayout navSettings={nav}>{children}</ClientLayout>
        <SanityLive />
      </body>
    </html>
  );
}
