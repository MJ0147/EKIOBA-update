const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
  runtimeCaching: [
    {
      // Cache TON RPC calls
      urlPattern: /^https:\/\/toncenter\.com\/api\/v2\/.*$/,
      handler: "NetworkFirst",
      options: {
        cacheName: "ton-rpc-cache",
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 300,
        },
      },
    },
    {
      // Cache Solana RPC calls
      urlPattern: /^https:\/\/api\.mainnet-beta\.solana\.com\/.*$/,
      handler: "NetworkFirst",
      options: {
        cacheName: "solana-rpc-cache",
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 300,
        },
      },
    },
    {
      // Cache Ekioba backend TON API calls
      urlPattern: /^https:\/\/api\.ekioba\.com\/api\/ton\/.*$/,
      handler: "NetworkFirst",
      options: {
        cacheName: "ekioba-api-cache",
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 300,
        },
      },
    },
  ],
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  reactStrictMode: true,
};

module.exports = withPWA(nextConfig);
