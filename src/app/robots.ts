import type { MetadataRoute } from "next";
import { siteDefaults } from "@/lib/seo/site-defaults";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = siteDefaults.baseUrl;

  return {
    rules: [
      {
        allow: "/",
        disallow: ["/admin/", "/api/"],
        userAgent: "*",
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
