import type { MetadataRoute } from "next";
import { siteDefaults } from "@/lib/seo/siteDefaults";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = siteDefaults.baseUrl;

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
