// Run this script with Node.js to register your webhook
// Usage: node scripts/setup-ton-webhook.js

// If you are on Node < 18, uncomment the line below:
// import fetch from "node-fetch";

// --- Configuration ---
const TON_API_KEY = process.env.TON_API_KEY; // Your TonConsole API Key
const MERCHANT_ADDRESS = process.env.NEXT_PUBLIC_TON_MERCHANT_WALLET;
// CHANGE THIS to your actual deployed domain or ngrok URL
const YOUR_PUBLIC_DOMAIN = "https://your-ekioba-domain.com"; 

// The public URL is now passed as a command-line argument.
const YOUR_PUBLIC_DOMAIN = process.argv[2];

if (!YOUR_PUBLIC_DOMAIN) {
  console.error("Usage: node scripts/setup-ton-webhook.js <your-public-ngrok-url>");
  console.error("Example: node scripts/setup-ton-webhook.js https://1234-abcd.ngrok.io");
  process.exit(1);
}

const WEBHOOK_ENDPOINT = `${YOUR_PUBLIC_DOMAIN}/api/webhooks/ton`;

async function registerWebhook() {
  if (!TON_API_KEY) {
    console.error("Error: TON_API_KEY environment variable is not set.");
    return;
  }
  if (!MERCHANT_ADDRESS) {
    console.error("Error: NEXT_PUBLIC_TON_MERCHANT_WALLET environment variable is not set.");
    return;
  }

  console.log(`Registering webhook for wallet: ${MERCHANT_ADDRESS}`);
  console.log(`Endpoint: ${WEBHOOK_ENDPOINT}`);

  try {
    // Using the endpoint you provided
    const response = await fetch("https://rt.tonapi.io/webhooks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${TON_API_KEY}`
      },
      body: JSON.stringify({
        account_ids: [MERCHANT_ADDRESS],
        url: WEBHOOK_ENDPOINT
      })
    });

    const data = await response.json();
    console.log("Response from TonAPI:", data);
  } catch (error) {
    console.error("Failed to register webhook:", error);
  }
}

registerWebhook();
