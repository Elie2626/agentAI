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
      url: `${BASE}/privacy`,
      lastModified: new Date("2026-06-01"),
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
