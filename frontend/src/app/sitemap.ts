import type { MetadataRoute } from "next";

const BASE = "https://www.botexpress.fr";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: BASE,
      lastModified: new Date("2026-06-02"),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${BASE}/auth/register`,
      lastModified: new Date("2026-06-02"),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${BASE}/auth/login`,
      lastModified: new Date("2026-06-02"),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE}/chatbot-restaurant`,
      lastModified: new Date("2026-06-02"),
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${BASE}/chatbot-immobilier`,
      lastModified: new Date("2026-06-02"),
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${BASE}/chatbot-ecommerce`,
      lastModified: new Date("2026-06-02"),
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${BASE}/chatbot-pme`,
      lastModified: new Date("2026-06-02"),
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${BASE}/chatbot-sante`,
      lastModified: new Date("2026-06-02"),
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${BASE}/chatbot-services`,
      lastModified: new Date("2026-06-02"),
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${BASE}/blog`,
      lastModified: new Date("2026-06-04"),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE}/blog/integrer-chatbot-site-web`,
      lastModified: new Date("2026-06-04"),
      changeFrequency: "monthly",
      priority: 0.95,
    },
    {
      url: `${BASE}/blog/chatbot-wordpress`,
      lastModified: new Date("2026-06-04"),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${BASE}/blog/chatbot-shopify`,
      lastModified: new Date("2026-06-04"),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${BASE}/blog/chatbot-html`,
      lastModified: new Date("2026-06-04"),
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${BASE}/affiliation`,
      lastModified: new Date("2026-06-02"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE}/privacy`,
      lastModified: new Date("2026-06-02"),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BASE}/legal`,
      lastModified: new Date("2026-06-01"),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
