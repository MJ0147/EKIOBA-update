import type { Metadata } from "next";
import BlockchainProviders from "./components/BlockchainProviders";
import "@solana/wallet-adapter-react-ui/styles.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ekioba Frontend",
  description: "Unified frontend for the Ekioba platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#020617" />
      </head>
      <body>
        <BlockchainProviders>{children}</BlockchainProviders>
      </body>
    </html>
  );
}
