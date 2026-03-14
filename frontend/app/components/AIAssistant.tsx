"use client";

import { useState } from "react";

export default function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("Ask Iyobo anything about EKIOBA...");

  const endpoint =
    process.env.NEXT_PUBLIC_IYOBO_URL ??
    process.env.NEXT_PUBLIC_AI_ASSISTANT_URL ??
    "http://localhost:8005/chat";

  const sendMessage = async () => {
    const text = message.trim();
    if (!text || loading) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: text }),
      });
      const data = (await response.json()) as { reply?: string; error?: string };
      setReply(data.reply ?? data.error ?? "Iyobo has no response right now.");
      setMessage("");
    } catch {
      setReply("Failed to connect to Iyobo service.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4">
      <button onClick={() => setOpen(!open)} className="rounded-full bg-blue-600 p-3 text-white">
        Iyobo
      </button>
      {open && (
        <div className="h-96 w-80 overflow-y-auto bg-white p-4 shadow-lg">
          <p className="mb-4 text-sm text-gray-800">{reply}</p>
          <div className="flex gap-2">
            <input
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  void sendMessage();
                }
              }}
              placeholder="Type your question"
              className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
            />
            <button
              onClick={() => void sendMessage()}
              disabled={loading}
              className="rounded bg-blue-600 px-3 py-1 text-sm text-white disabled:opacity-60"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
