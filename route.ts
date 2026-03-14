import { NextResponse } from "next/server";

// This endpoint receives real-time notifications from TonAPI
export async function POST(request: Request) {
  try {
    const payload = await request.json();

    // For security, you should verify the incoming request is legitimate.
    // In a production app, verify the transaction details against the blockchain
    // or check a shared secret if TonAPI supports it in the future.

    console.log("Received TON Webhook Event:", JSON.stringify(payload, null, 2));

    // Typical TonAPI webhook payload structure inspection
    // You will likely receive an array of events or a specific transaction object
    const { account_id, tx_hash, utime } = payload;

    if (account_id && tx_hash) {
      // TODO: Implement your business logic here:
      // 1. Find the Order in your database associated with this payment (e.g. match amount or comment)
      // 2. Verify the amount matches the expected order total.
      // 3. Mark the order as 'PAID'.
      // 4. Trigger fulfillment (e.g., send confirmation email).
      
      console.log(`Processing payment for account ${account_id}, Hash: ${tx_hash}`);
    }

    // Always return 200 OK quickly to acknowledge receipt
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Error processing TON webhook:", error);
    // Return 500 so TonAPI knows to retry later if it supports retries
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}