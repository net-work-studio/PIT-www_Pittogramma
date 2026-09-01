import type { MetadataRoute } from "next";
import { siteDefaults } from "@/lib/seo/site-defaults";

export default function robots(): MetadataRoute.Robots {
  const { baseUrl } = siteDefaults;

  return {
    rules: [
      {
        allow: "/",
        disallow: ["/admin", "/admin/", "/api/"],
        userAgent: "*",
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
