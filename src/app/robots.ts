import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.gannahaat.online";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/buyer/marketplace", "/login", "/register", "/farmer/listings/new"],
        disallow: [
          "/admin/",
          "/admin/*",
          "/farmer/dashboard/",
          "/farmer/dashboard/*",
          "/buyer/my-bids/",
          "/buyer/my-bids/*",
          "/api/",
          "/api/*",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/admin/", "/api/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
