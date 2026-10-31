import type { MetadataRoute } from "next";
import { getAll144CompatibilitySlugs } from "@/lib/metaphysics/compatibility";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://qicosmos.com";
  const now = new Date();

  const coreRoutes = [
    "",
    "/calculator/bazi",
    "/compatibility",
    "/calculator/iching",
    "/knowledge",
    "/about",
  ];

  const sitemapEntries: MetadataRoute.Sitemap = [];

  // Core pages in both en and zh
  for (const route of coreRoutes) {
    sitemapEntries.push({
      url: `${baseUrl}/en${route}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: route === "" ? 1.0 : 0.9,
    });
    sitemapEntries.push({
      url: `${baseUrl}/zh${route}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: route === "" ? 0.9 : 0.8,
    });
  }

  // Programmatic SEO 144 combinations
  const compatibilityPairs = getAll144CompatibilitySlugs();
  for (const pair of compatibilityPairs) {
    sitemapEntries.push({
      url: `${baseUrl}/en/compatibility/${pair.slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    });
    sitemapEntries.push({
      url: `${baseUrl}/zh/compatibility/${pair.slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    });
  }

  return sitemapEntries;
}
