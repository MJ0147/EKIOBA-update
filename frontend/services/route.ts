import { NextResponse } from "next/server";
import {
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { CONNECTION } from "../../../lib/solana";

// --- Merchant Configuration ---
const MERCHANT_WALLET = new PublicKey(
  process.env.NEXT_PUBLIC_SOLANA_MERCHANT_WALLET!
);
const MERCHANT_LABEL = "Ekioba Store";
// IMPORTANT: Replace this with a real, publicly accessible URL to your store's icon
const MERCHANT_ICON = "https://ekioba.com/logo.png";

// --- Type Definitions for Solana Pay ---
type GetResponse = {
  label: string;
  icon: string;
};

type PostRequest = {
  account: string; // The account that will pay
  cart: Array<{ id: number; quantity: number; price: string | number }>;
};

type PostResponse = {
  transaction: string; // base64 encoded transaction
  message: string;
};

/**
 * GET handler for Solana Pay spec.
 * Wallets and QR code scanners use this to get merchant info.
 */
export async function GET() {
  const response: GetResponse = {
    label: MERCHANT_LABEL,
    icon: MERCHANT_ICON,
  };
  return NextResponse.json(response);
}

/**
 * POST handler for Solana Pay spec.
 * The frontend or a wallet uses this to request a transaction.
 */
export async function POST(request: Request) {
  try {
    const { account, cart } = (await request.json()) as PostRequest;
    if (!account || !cart || cart.length === 0) {
      return NextResponse.json(
        { error: "Account and cart are required." },
        { status: 400 }
      );
    }

    // --- SERVER-SIDE AMOUNT CALCULATION ---
    // SECURITY: Fetch product prices from your database here based on cart item IDs
    // to prevent client-side price manipulation. For this example, we'll use the
    // cart prices, but DO NOT do this in a real production environment.
    const totalAmount = cart.reduce(
      (sum, item) => sum + Number(item.price) * item.quantity,
      0
    );

    const payer = new PublicKey(account);
    const lamports = Math.round(totalAmount * LAMPORTS_PER_SOL);
    const { blockhash } = await CONNECTION.getLatestBlockhash();

    const transaction = new Transaction({ recentBlockhash: blockhash, feePayer: payer });
    transaction.add(SystemProgram.transfer({ fromPubkey: payer, toPubkey: MERCHANT_WALLET, lamports }));

    const serializedTransaction = transaction.serialize({ requireAllSignatures: false });
    const base64Transaction = serializedTransaction.toString("base64");

    const response: PostResponse = {
      transaction: base64Transaction,
      message: `Ekioba Store Order - ${totalAmount.toFixed(2)} SOL`,
    };
    return NextResponse.json(response);
  } catch (error) {
    console.error("Error creating Solana Pay transaction:", error);
    return NextResponse.json({ error: "Error creating transaction." }, { status: 500 });
  }
}