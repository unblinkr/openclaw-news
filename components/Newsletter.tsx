"use client";

import { useState } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    
    // TODO: Connect to Beehiiv API
    // For now, just simulate success
    setTimeout(() => {
      setStatus("success");
      setEmail("");
    }, 1000);
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 md:p-12">
      <div className="max-w-2xl mx-auto text-center">
        <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
          Stay Ahead of the AI Agent Revolution
        </h3>
        <p className="text-slate-600 mb-6">
          Get the latest OpenClaw news, tutorials, and insights delivered to your inbox every week.
        </p>
        
        {status === "success" ? (
          <div className="bg-green-100 text-green-800 px-6 py-4 rounded-lg">
            ✓ Thanks! Check your email to confirm your subscription.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="flex-1 px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {status === "loading" ? "..." : "Subscribe"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
