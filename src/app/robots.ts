import { MetadataRoute } from "next";

const SITE_URL = "https://www.novitaguok.com";

export default function RobotsTxt(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
