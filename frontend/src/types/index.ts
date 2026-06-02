export type ChatbotType =
  | "support"
  | "sales"
  | "booking"
  | "restaurant"
  | "real_estate"
  | "ecommerce"
  | "other";

export interface Chatbot {
  id: string;
  name: string;
  chatbot_type: ChatbotType;
  website_url: string;
  logo_url: string;
  favicon_url: string;
  primary_color: string;
  secondary_color: string;
  text_color: string;
  font_family: string;
  industry: string;
  welcome_message: string;
  placeholder_text: string;
  position: string;
  widget_size: string;
  status: string;
  created_at: string;
  embed_code: string;
  allowed_domains: string[];
  lead_capture_enabled?: boolean;
  lead_capture_fields?: string[];
}

export interface Usage {
  plan: string;
  subscription_status?: string;
  trial_ends_at?: string | null;
  has_used_trial?: boolean;
  messages_used: number;
  messages_limit: number;
  chatbots_used: number;
  chatbots_limit: number;
  can_deploy: boolean;
  period_start: string;
  period_end: string;
  features: {
    custom_branding: boolean;
    analytics: boolean;
    email_support: boolean;
    priority_support: boolean;
  };
}

export interface AffiliateInfo {
  referral_code: string;
  referral_link: string;
}

export interface AffiliateStats {
  total_referrals: number;
  total_earned: number;
  pending: number;
  paid: number;
  referrals: {
    id: string;
    plan: string;
    commission: number;
    status: string;
    created_at: string;
  }[];
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  session_id: string;
  created_at: string;
}

export interface LeadsData {
  total: number;
  leads: Lead[];
}

export interface ChatbotAnalytics {
  total_messages: number;
  total_sessions: number;
  recent_messages: number;
  avg_messages_per_session: number;
  hourly_distribution: number[];
  daily_activity: { date: string; count: number }[];
  top_questions: { question: string; count: number }[];
  period_days: number;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
}

export const CHATBOT_TYPES: { value: ChatbotType; label: string; icon: string; description: string }[] = [
  { value: "support", label: "Support client", icon: "Headphones", description: "Répondre aux questions et résoudre les problèmes" },
  { value: "sales", label: "Commercial / Vente", icon: "TrendingUp", description: "Qualifier les prospects et guider les achats" },
  { value: "booking", label: "Prise de rendez-vous", icon: "Calendar", description: "Planifier et gérer les rendez-vous" },
  { value: "restaurant", label: "Restaurant", icon: "UtensilsCrossed", description: "Menu, réservations et commandes" },
  { value: "real_estate", label: "Immobilier", icon: "Home", description: "Recherche de biens et visites" },
  { value: "ecommerce", label: "E-commerce", icon: "ShoppingCart", description: "Assistance produits et commandes" },
  { value: "other", label: "Autre", icon: "Bot", description: "Assistant personnalisé" },
];
