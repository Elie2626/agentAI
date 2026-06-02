import { getIdToken } from "./firebase";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function fetchApi(path: string, options: RequestInit = {}) {
  const token = await getIdToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.detail || `Erreur ${res.status}`);
  }

  return res.json();
}

export const api = {
  // Users
  getMe: () => fetchApi("/api/v1/users/me"),

  // Chatbots
  createChatbot: (data: {
    name: string;
    chatbot_type: string;
    website_url: string;
  }) => fetchApi("/api/v1/chatbots", { method: "POST", body: JSON.stringify(data) }),

  listChatbots: () => fetchApi("/api/v1/chatbots"),

  getChatbot: (id: string) => fetchApi(`/api/v1/chatbots/${id}`),

  updateChatbot: (id: string, data: Record<string, unknown>) =>
    fetchApi(`/api/v1/chatbots/${id}`, { method: "PATCH", body: JSON.stringify(data) }),

  deleteChatbot: (id: string) =>
    fetchApi(`/api/v1/chatbots/${id}`, { method: "DELETE" }),

  getEmbedCode: (id: string) => fetchApi(`/api/v1/chatbots/${id}/embed`),

  getChatbotAnalytics: (id: string) => fetchApi(`/api/v1/chatbots/${id}/analytics`),

  // Chat
  sendMessage: (chatbot_id: string, message: string) =>
    fetchApi("/api/v1/chat", {
      method: "POST",
      body: JSON.stringify({ chatbot_id, message }),
    }),

  resetConversation: (chatbot_id: string) =>
    fetchApi(`/api/v1/chat/${chatbot_id}/reset`, { method: "POST" }),

  // Billing
  createCheckout: (plan: string, billing: "monthly" | "annual" = "monthly", referralCode?: string) =>
    fetchApi("/api/v1/billing/checkout", {
      method: "POST",
      body: JSON.stringify({ plan, billing, referral_code: referralCode }),
    }),

  createPortal: () =>
    fetchApi("/api/v1/billing/portal", { method: "POST" }),

  getUsage: () => fetchApi("/api/v1/billing/usage"),

  syncSubscription: () =>
    fetchApi("/api/v1/billing/sync", { method: "POST" }),

  // Support
  createTicket: (data: { subject: string; message: string; category: string }) =>
    fetchApi("/api/v1/support", { method: "POST", body: JSON.stringify(data) }),

  listTickets: () => fetchApi("/api/v1/support"),

  // Affiliate
  getAffiliate: () => fetchApi("/api/v1/affiliate"),
  getAffiliateStats: () => fetchApi("/api/v1/affiliate/stats"),
  getPayoutInfo: () => fetchApi("/api/v1/affiliate/payout-info"),
  savePayoutInfo: (data: { full_name: string; iban: string }) =>
    fetchApi("/api/v1/affiliate/payout-info", {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  // Leads
  getLeads: (chatbotId: string) => fetchApi(`/api/v1/leads/${chatbotId}`),
};
