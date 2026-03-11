"use client";

import { useState, useEffect } from "react";

export default function EmailPopup() {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Don't show if already subscribed or dismissed recently
    const dismissed = localStorage.getItem("popup_dismissed");
    const subscribed = localStorage.getItem("popup_subscribed");
    if (subscribed) return;
    if (dismissed && Date.now() - parseInt(dismissed) < 1000 * 60 * 60 * 24 * 3) return;

    // Show after 8 seconds
    const timer = setTimeout(() => setVisible(true), 8000);
    return () => clearTimeout(timer);
  }, []);

  const dismiss = () => {
    setVisible(false);
    localStorage.setItem("popup_dismissed", Date.now().toString());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("success");
        setMessage("You're in. Check your inbox to confirm.");
        localStorage.setItem("popup_subscribed", "true");
        setTimeout(() => setVisible(false), 3000);
      } else {
        setStatus("error");
        setMessage(data.error || "Something went wrong.");
      }
    } catch {
      setStatus("error");
      setMessage("Network error. Try again.");
    }
  };

  if (!visible) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={dismiss}
        style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)",
          zIndex: 999, backdropFilter: "blur(2px)",
        }}
      />

      {/* Popup */}
      <div style={{
        position: "fixed", top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 1000, width: "min(520px, 92vw)",
        background: "#f5f0e8", border: "2px solid #1a1a1a",
        boxShadow: "8px 8px 0px #1a1a1a",
        fontFamily: "'Georgia', serif",
      }}>

        {/* Masthead stripe */}
        <div style={{ background: "#1a1a1a", padding: "10px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: "#c9a84c" }}>
            OpenClaw News — Free Newsletter
          </div>
          <button onClick={dismiss} style={{ background: "none", border: "none", color: "#888", fontSize: 18, cursor: "pointer", lineHeight: 1, padding: "0 4px" }}>
            ✕
          </button>
        </div>

        <div style={{ padding: "32px 36px 36px" }}>
          {/* Headline */}
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <div style={{ fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: "#888", marginBottom: 10 }}>
              Issue delivered every week
            </div>
            <h2 style={{ fontSize: 28, fontWeight: 900, lineHeight: 1.2, margin: "0 0 12px", color: "#1a1a1a" }}>
              Stay Ahead of the<br />AI Agent Revolution
            </h2>
            <p style={{ fontSize: 14, color: "#555", lineHeight: 1.6, margin: 0 }}>
              Get the sharpest takes on OpenClaw, AI agents, and the builder economy — straight to your inbox. Free, weekly, no spam.
            </p>
          </div>

          {/* Bullets */}
          <div style={{ background: "#fff", border: "1px solid #d4c9a8", padding: "14px 18px", marginBottom: 24 }}>
            {[
              "📰 Weekly AI agent news digest",
              "🛠 Builder tutorials & OpenClaw guides",
              "⚡ Early access to new features & tools",
            ].map((item) => (
              <div key={item} style={{ fontSize: 13, padding: "5px 0", color: "#333", borderBottom: "1px solid #f0ebe0" }}>
                {item}
              </div>
            ))}
            <div style={{ fontSize: 13, padding: "5px 0 0", color: "#333" }}>
              🎯 Zero fluff. Builders only.
            </div>
          </div>

          {/* Form */}
          {status === "success" ? (
            <div style={{ textAlign: "center", padding: "16px", background: "#f0fdf4", border: "1px solid #86efac", color: "#166534", fontSize: 14 }}>
              ✓ {message}
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{ display: "flex", gap: 8 }}>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  style={{
                    flex: 1, padding: "12px 14px", fontSize: 14,
                    border: "2px solid #1a1a1a", background: "#fff",
                    fontFamily: "Georgia, serif", outline: "none",
                  }}
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  style={{
                    padding: "12px 20px", background: "#1a1a1a", color: "#f5f0e8",
                    border: "none", cursor: status === "loading" ? "not-allowed" : "pointer",
                    fontSize: 12, fontWeight: 700, letterSpacing: 2,
                    textTransform: "uppercase", fontFamily: "Georgia, serif",
                    opacity: status === "loading" ? 0.7 : 1,
                    whiteSpace: "nowrap",
                  }}
                >
                  {status === "loading" ? "..." : "Subscribe →"}
                </button>
              </div>
              {status === "error" && (
                <p style={{ color: "#dc2626", fontSize: 12, marginTop: 8 }}>{message}</p>
              )}
              <p style={{ fontSize: 11, color: "#aaa", marginTop: 10, textAlign: "center" }}>
                No spam. Unsubscribe anytime. Powered by Beehiiv.
              </p>
            </form>
          )}
        </div>

        {/* Bottom bar */}
        <div style={{ background: "#1a1a1a", padding: "8px 20px", textAlign: "center" }}>
          <span style={{ fontSize: 10, color: "#555", letterSpacing: 1 }}>
            JOIN {" "}
            <span style={{ color: "#c9a84c", fontWeight: 700 }}>OPENCLAW NEWS</span>
            {" "} · EST. 2024
          </span>
        </div>
      </div>
    </>
  );
}
