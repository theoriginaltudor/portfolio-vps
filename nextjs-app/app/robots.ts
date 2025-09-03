import type { MetadataRoute } from "next";

// Generates /robots.txt at build/runtime.
// Disallows sensitive/internal routes from being crawled.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        disallow: ["/login", "/data-transfer", "/check-transfer"],
      },
    ],
    // host & sitemap can be added if you have a canonical domain / sitemap route.
    host: "https://tudor-dev.com",
    // If you add an app/sitemap.ts later, keep this in sync.
    // sitemap: "https://tudor-dev.com/sitemap.xml",
  };
}
