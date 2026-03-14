"use client";

import { ReactNode, useMemo } from "react";
import { clusterApiUrl } from "@solana/web3.js";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import { TonConnectUIProvider } from "@tonconnect/ui-react";

type Props = {
  children: ReactNode;
};

export default function BlockchainProviders({ children }: Props) {
  const network = process.env.NEXT_PUBLIC_SOLANA_NETWORK ?? "mainnet-beta";
  const endpoint =
    process.env.NEXT_PUBLIC_SOLANA_RPC_URL ??
    (network === "devnet" ? clusterApiUrl("devnet") : clusterApiUrl("mainnet-beta"));

  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);
  const manifestUrl =
    process.env.NEXT_PUBLIC_TONCONNECT_MANIFEST_URL ?? "http://localhost:3000/tonconnect-manifest.json";

  return (
    <TonConnectUIProvider manifestUrl={manifestUrl}>
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} autoConnect>
          <WalletModalProvider>{children}</WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </TonConnectUIProvider>
  );
}
