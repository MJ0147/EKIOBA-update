const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
// e.g. "https://api.ekioba.com" set in your .env

// Define types for API responses for better type safety
export interface TokenInfo {
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: string;
}

export interface Balance {
  balance: string;
}

// A generic fetch wrapper for robust error handling and typing
async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${BACKEND_URL}${endpoint}`;
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!res.ok) {
      // Try to parse a structured error from the backend, otherwise throw a generic error
      const errorBody = await res.json().catch(() => ({ message: "An unknown API error occurred" }));
      throw new Error(errorBody.detail || errorBody.message || `Request failed with status ${res.status}`);
    }

    return res.json() as Promise<T>;
  } catch (error) {
    console.error(`API call to ${url} failed:`, error);
    // Re-throw to allow UI components to handle it (e.g., show a toast notification)
    throw error;
  }
}

export async function getTokenInfo(): Promise<TokenInfo> {
  return fetchApi<TokenInfo>("/api/ton/token-info");
}

export async function getBalance(address: string): Promise<Balance> {
  return fetchApi<Balance>(`/api/ton/idia-balance/${address}`);
}

export async function transferIdia(to: string, amount: number) {
  return fetchApi("/api/ton/transfer-idia", {
    method: "POST",
    body: JSON.stringify({ to_address: to, amount }),
  });
}

export async function estimateGas() {
  return fetchApi("/api/ton/estimate-gas");
}

export async function verifyContract() {
  return fetchApi("/api/ton/verify-contract");
}
