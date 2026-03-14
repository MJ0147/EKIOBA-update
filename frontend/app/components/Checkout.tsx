"use client";

import { useMemo, useState } from "react";
import {
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { TonConnectButton, useTonConnectUI, useTonWallet } from "@tonconnect/ui-react";

type CartItem = {
  id: string;
  name: string;
  price: string | number;
  quantity: number;
};

type Props = {
  cart: CartItem[];
  totalAmount: number;
  onPaid: () => void;
};

function shortAddress(value: string): string {
  if (value.length < 16) {
    return value;
  }
  return `${value.slice(0, 6)}...${value.slice(-6)}`;
}

function formatIdia(value: number): string {
  return `Idia ${new Intl.NumberFormat("en-NG", { maximumFractionDigits: 2 }).format(value)}`;
}

export default function Checkout({ cart, totalAmount, onPaid }: Props) {
  const [status, setStatus] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const [tonConnectUI] = useTonConnectUI();
  const tonWallet = useTonWallet();

  const { connection } = useConnection();
  const { connected, publicKey, sendTransaction } = useWallet();

  const canCheckout = cart.length > 0 && totalAmount > 0;

  const cartPayload = useMemo(
    () => cart.map(({ id, quantity, price }) => ({ id, quantity, price })),
    [cart],
  );

  const payWithTON = async () => {
    if (!canCheckout || !tonWallet) {
      setStatus("Connect your TON wallet and add at least one item to checkout.");
      return;
    }

    const merchantAddress = process.env.NEXT_PUBLIC_TON_MERCHANT_WALLET;
    if (!merchantAddress) {
      setStatus("Missing NEXT_PUBLIC_TON_MERCHANT_WALLET configuration.");
      return;
    }

    try {
      setIsProcessing(true);
      setStatus("Processing TON payment...");

      const amountNano = BigInt(Math.round(totalAmount * 1_000_000_000)).toString();
      const txResult = await tonConnectUI.sendTransaction({
        validUntil: Math.floor(Date.now() / 1000) + 5 * 60,
        messages: [
          {
            address: merchantAddress,
            amount: amountNano,
          },
        ],
      });

      const tonResponse = await fetch("/api/pay/ton", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chain: "ton",
          wallet: tonWallet.account.address,
          amount: totalAmount,
          cart: cartPayload,
          proof: {
            boc: txResult.boc,
          },
        }),
      });

      if (!tonResponse.ok) {
        const errorPayload = (await tonResponse.json()) as { error?: string };
        throw new Error(errorPayload.error ?? "TON payment verification failed.");
      }

      setStatus("TON payment complete!");
      onPaid();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "TON payment failed.");
    } finally {
      setIsProcessing(false);
    }
  };

  const payWithSolana = async () => {
    if (!canCheckout || !connected || !publicKey) {
      setStatus("Connect Phantom and add at least one item to checkout.");
      return;
    }

    const merchantWallet = process.env.NEXT_PUBLIC_SOLANA_MERCHANT_WALLET;
    if (!merchantWallet) {
      setStatus("Missing NEXT_PUBLIC_SOLANA_MERCHANT_WALLET configuration.");
      return;
    }

    try {
      setIsProcessing(true);
      setStatus("Requesting transaction from server...");

      // 1. Fetch the transaction from our new Solana Pay endpoint
      const transactionResponse = await fetch("/api/checkout/solana", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          account: publicKey.toBase58(),
          cart: cartPayload,
        }),
      });

      if (!transactionResponse.ok) {
        throw new Error("Failed to create transaction.");
      }

      const { transaction: base64Transaction, message } = await transactionResponse.json();
      setStatus(message || "Please approve the transaction in your wallet.");

      // 2. Deserialize, sign, and send the transaction provided by the server
      const transaction = Transaction.from(Buffer.from(base64Transaction, "base64"));
      const signature = await sendTransaction(transaction, connection);

      // 3. Wait for confirmation
      await connection.confirmTransaction(signature, "confirmed");
      setStatus("Transaction confirmed! Verifying with store...");

      // 4. Call the original verification API to finalize the order
      const verificationResponse = await fetch("/api/pay/solana", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          wallet: publicKey.toBase58(),
          amount: totalAmount,
          cart: cartPayload,
          proof: { signature },
        }),
      });

      if (!verificationResponse.ok) {
        const errorPayload = (await verificationResponse.json()) as { error?: string };
        throw new Error(errorPayload.error ?? "Solana payment verification failed.");
      }

      setStatus("Solana payment complete!");
      onPaid();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Solana payment failed.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <section className="mt-8 rounded-2xl border border-ink/15 bg-white/80 p-5">
      <h3 className="text-lg font-semibold text-ink">Checkout</h3>
      <p className="mt-1 text-sm text-ink/70">Pay securely with TON Connect or your Phantom wallet.</p>
      <p className="mt-2 text-sm font-medium text-ink/80">Order amount: {formatIdia(totalAmount)}</p>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <TonConnectButton className="!rounded-xl" />
      </div>

      <div className="mt-4 grid gap-2 text-xs text-ink/75 md:grid-cols-2">
        <p>Solana wallet: {publicKey ? shortAddress(publicKey.toBase58()) : "Not connected"}</p>
        <p>TON wallet: {tonWallet?.account?.address ? shortAddress(tonWallet.account.address) : "Not connected"}</p>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={payWithTON}
          disabled={!canCheckout || isProcessing}
          className="rounded-xl bg-ink px-4 py-2 text-sm font-medium text-canvas disabled:cursor-not-allowed disabled:opacity-40"
        >
          Pay with TON
        </button>
        <button
          type="button"
          onClick={payWithSolana}
          disabled={!canCheckout || isProcessing}
          className="rounded-xl border border-ink/20 bg-white px-4 py-2 text-sm font-medium text-ink disabled:cursor-not-allowed disabled:opacity-40"
        >
          Pay with Solana
        </button>
      </div>

      {status ? <p className="mt-3 text-sm text-ink/80">{status}</p> : null}
    </section>
  );
}
