import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "botexpress — Chatbot IA pour votre site web en 2 minutes";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #07051a 0%, #110d35 45%, #0a0820 100%)",
          fontFamily: "system-ui, -apple-system, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Grid background */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(99,102,241,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.12) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Radial glow center */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 900,
            height: 450,
            background:
              "radial-gradient(ellipse, rgba(99,102,241,0.28) 0%, rgba(129,140,248,0.1) 40%, transparent 70%)",
            borderRadius: "50%",
          }}
        />

        {/* Top-left corner bracket */}
        <svg
          style={{ position: "absolute", top: 40, left: 40 }}
          width={80} height={80} viewBox="0 0 80 80"
          stroke="rgba(99,102,241,0.5)" strokeWidth="2" fill="none"
        >
          <path d="M80 0 L16 0 Q0 0 0 16 L0 80" />
        </svg>

        {/* Top-right corner bracket */}
        <svg
          style={{ position: "absolute", top: 40, right: 40, transform: "scaleX(-1)" }}
          width={80} height={80} viewBox="0 0 80 80"
          stroke="rgba(99,102,241,0.5)" strokeWidth="2" fill="none"
        >
          <path d="M80 0 L16 0 Q0 0 0 16 L0 80" />
        </svg>

        {/* Bottom-left corner bracket */}
        <svg
          style={{ position: "absolute", bottom: 40, left: 40, transform: "scaleY(-1)" }}
          width={80} height={80} viewBox="0 0 80 80"
          stroke="rgba(99,102,241,0.5)" strokeWidth="2" fill="none"
        >
          <path d="M80 0 L16 0 Q0 0 0 16 L0 80" />
        </svg>

        {/* Bottom-right corner bracket */}
        <svg
          style={{ position: "absolute", bottom: 40, right: 40, transform: "scale(-1)" }}
          width={80} height={80} viewBox="0 0 80 80"
          stroke="rgba(99,102,241,0.5)" strokeWidth="2" fill="none"
        >
          <path d="M80 0 L16 0 Q0 0 0 16 L0 80" />
        </svg>

        {/* Main content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 28,
            zIndex: 1,
            padding: "0 60px",
          }}
        >
          {/* Icon */}
          <div
            style={{
              width: 96,
              height: 96,
              background: "linear-gradient(135deg, #6366f1, #818cf8)",
              borderRadius: 24,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 40px rgba(99,102,241,0.5)",
            }}
          >
            <svg width="56" height="56" viewBox="0 0 100 100" fill="white">
              <circle cx="50" cy="9" r="7" />
              <rect x="46" y="16" width="8" height="14" rx="4" />
              <rect x="12" y="30" width="76" height="54" rx="22" />
              <rect x="5" y="42" width="11" height="22" rx="5.5" />
              <rect x="84" y="42" width="11" height="22" rx="5.5" />
              <rect x="29" y="46" width="14" height="20" rx="7" fill="#6366f1" />
              <rect x="57" y="46" width="14" height="20" rx="7" fill="#6366f1" />
            </svg>
          </div>

          {/* Brand */}
          <div
            style={{
              fontSize: 80,
              fontWeight: 800,
              color: "white",
              letterSpacing: -3,
              lineHeight: 1,
            }}
          >
            botexpress
          </div>

          {/* Tagline */}
          <div
            style={{
              fontSize: 30,
              color: "rgba(165,180,252,0.9)",
              textAlign: "center",
              maxWidth: 680,
              lineHeight: 1.4,
            }}
          >
            Créez un chatbot IA pour votre site web en 2 minutes
          </div>

          {/* URL pill */}
          <div
            style={{
              marginTop: 4,
              background: "rgba(99,102,241,0.15)",
              border: "1.5px solid rgba(99,102,241,0.45)",
              borderRadius: 100,
              padding: "10px 32px",
              color: "#a5b4fc",
              fontSize: 20,
              letterSpacing: 0.5,
            }}
          >
            www.botexpress.fr
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
