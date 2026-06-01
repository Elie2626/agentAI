"use client";

import { useState } from "react";
import { type Chatbot } from "@/types";
import { MessageSquare, Send, X, Minus } from "lucide-react";

interface ChatbotPreviewProps {
  chatbot: Chatbot;
}

function getLuminance(hex: string): number {
  const c = hex.replace("#", "");
  const r = parseInt(c.substring(0, 2), 16) / 255;
  const g = parseInt(c.substring(2, 4), 16) / 255;
  const b = parseInt(c.substring(4, 6), 16) / 255;
  const srgb = [r, g, b].map((v) =>
    v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
  );
  return 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2];
}

function getContrastColor(hex: string): string {
  try {
    return getLuminance(hex) > 0.4 ? "#111111" : "#ffffff";
  } catch {
    return "#ffffff";
  }
}

const SIZE_MAP: Record<string, { h: string }> = {
  small: { h: "h-[420px]" },
  medium: { h: "h-[500px]" },
  large: { h: "h-[580px]" },
};

export function ChatbotPreview({ chatbot }: ChatbotPreviewProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([
    { role: "assistant", content: chatbot.welcome_message || "Bonjour ! Comment puis-je vous aider ?" },
  ]);
  const [input, setInput] = useState("");

  function handleSend() {
    if (!input.trim()) return;
    setMessages((prev) => [
      ...prev,
      { role: "user" as const, content: input },
      { role: "assistant" as const, content: "Ceci est un aperçu. Les réponses IA seront générées en production." },
    ]);
    setInput("");
  }

  const primaryColor = chatbot.primary_color || "#6366f1";
  const textColor =
    chatbot.text_color && chatbot.text_color !== "auto"
      ? chatbot.text_color
      : getContrastColor(primaryColor);
  const size = SIZE_MAP[chatbot.widget_size] || SIZE_MAP.medium;
  const isDarkText = textColor === "#111111";

  return (
    <div className={`relative mx-auto ${size.h} w-full max-w-sm overflow-hidden rounded-2xl border bg-background shadow-xl`}>
      {isOpen ? (
        <div className="flex h-full flex-col">
          {/* Header */}
          <div
            className="flex items-center justify-between px-4 py-3"
            style={{ backgroundColor: primaryColor }}
          >
            <div className="flex items-center gap-3">
              {chatbot.logo_url ? (
                <img
                  src={chatbot.logo_url}
                  alt=""
                  className="h-8 w-8 rounded-full border-2 bg-white object-contain p-0.5"
                  style={{ borderColor: isDarkText ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.2)" }}
                />
              ) : (
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-full"
                  style={{ background: isDarkText ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.2)" }}
                >
                  <MessageSquare className="h-4 w-4" style={{ color: textColor }} />
                </div>
              )}
              <div>
                <p className="text-sm font-semibold" style={{ color: textColor }}>{chatbot.name}</p>
                <p className="text-xs" style={{ color: isDarkText ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.7)" }}>
                  En ligne
                </p>
              </div>
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => setIsOpen(false)}
                className="flex h-7 w-7 items-center justify-center rounded-md transition-colors"
                style={{ color: isDarkText ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.7)" }}
                aria-label="Réduire"
              >
                <Minus className="h-4 w-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="flex h-7 w-7 items-center justify-center rounded-md transition-colors"
                style={{ color: isDarkText ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.7)" }}
                aria-label="Fermer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "rounded-br-md"
                      : "rounded-bl-md bg-muted"
                  }`}
                  style={
                    msg.role === "user"
                      ? { backgroundColor: primaryColor, color: textColor }
                      : undefined
                  }
                >
                  {msg.content}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="border-t p-3">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={chatbot.placeholder_text || "Écrivez votre message..."}
                className="flex-1 rounded-xl border bg-muted/50 px-4 py-2.5 text-sm outline-none placeholder:text-muted-foreground focus:ring-2"
                style={{ "--tw-ring-color": primaryColor } as React.CSSProperties}
              />
              <button
                type="submit"
                className="flex h-10 w-10 items-center justify-center rounded-xl transition-opacity hover:opacity-90"
                style={{ backgroundColor: primaryColor, color: textColor }}
                aria-label="Envoyer"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
            <p className="mt-2 text-center text-[10px] text-muted-foreground">
              Propulsé par BotForge
            </p>
          </div>
        </div>
      ) : (
        <div className="flex h-full items-end justify-end p-4">
          <button
            onClick={() => setIsOpen(true)}
            className="flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-transform hover:scale-105"
            style={{ backgroundColor: primaryColor }}
            aria-label="Ouvrir le chat"
          >
            <MessageSquare className="h-6 w-6" style={{ color: textColor }} />
          </button>
        </div>
      )}
    </div>
  );
}
