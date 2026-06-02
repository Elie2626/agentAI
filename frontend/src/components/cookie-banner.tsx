"use client";

import { useEffect, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://agentai-23tt.onrender.com";
const STORAGE_KEY = "be_cookie_consent";

function getSessionId(): string {
  let id = localStorage.getItem("be_session_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("be_session_id", id);
  }
  return id;
}

async function recordConsent(accepted: boolean) {
  try {
    await fetch(`${API_URL}/api/v1/cookies/consent`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        session_id: getSessionId(),
        accepted,
        user_agent: navigator.userAgent,
        page: window.location.href,
      }),
    });
  } catch {}
}

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) setVisible(true);
  }, []);

  function accept() {
    localStorage.setItem(STORAGE_KEY, "accepted");
    recordConsent(true);
    setVisible(false);
  }

  function decline() {
    localStorage.setItem(STORAGE_KEY, "declined");
    recordConsent(false);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur-sm shadow-lg">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p className="text-sm text-muted-foreground">
          Nous utilisons des cookies pour améliorer votre expérience et analyser notre trafic.{" "}
          <a href="/privacy" className="underline hover:text-foreground">
            En savoir plus
          </a>
          .
        </p>
        <div className="flex shrink-0 gap-3">
          <button
            onClick={decline}
            className="rounded-lg border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
          >
            Refuser
          </button>
          <button
            onClick={accept}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Accepter
          </button>
        </div>
      </div>
    </div>
  );
}
