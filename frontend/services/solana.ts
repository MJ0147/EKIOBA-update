import { Connection, clusterApiUrl } from "@solana/web3.js";

// Use the RPC URL from environment variables or default to mainnet-beta.
const RPC_URL = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || clusterApiUrl("mainnet-beta");

export const CONNECTION = new Connection(RPC_URL, "confirmed");