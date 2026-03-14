import { NextResponse } from "next/server";

export type PaymentPayload = {
  wallet?: string;
  amount?: number;
  cart?: Array<{ id: string | number; quantity: number; price: string | number }>;
  proof?: {
    signature?: string; // For Solana
    tx_hash?: string;   // For TON
    boc?: string;       // For TON
  };
};

export async function handlePayment(request: Request, chain: "solana" | "ton") {
  let payload: PaymentPayload;

  try {
    payload = (await request.json()) as PaymentPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  if (!payload.wallet || typeof payload.amount !== "number") {
    return NextResponse.json({ error: "wallet and amount are required." }, { status: 400 });
  }

  // SECURITY: The backend 'store' service MUST recalculate the total amount from the cart.
  // Do NOT trust the 'amount' field from the client for the final charge.

  const verifierUrl = process.env.STORE_PAYMENTS_URL;

  if (!verifierUrl) {
    console.warn(`STORE_PAYMENTS_URL not set. Running ${chain} payment in mock mode.`);
    return NextResponse.json({
      status: "accepted",
      chain: chain,
      mode: "mock",
      message: "Set STORE_PAYMENTS_URL to enable backend verification.",
      tx: payload.proof,
    });
  }

  try {
    const response = await fetch(verifierUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, chain }),
      cache: "no-store",
    });
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error(`Failed to forward payment verification to store service for chain: ${chain}`, error);
    return NextResponse.json({ error: "Payment verification service is unavailable." }, { status: 503 });
  }
}