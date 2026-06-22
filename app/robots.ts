import type { MetadataRoute } from "next";

function resolveAppUrl() {
  const raw = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (!raw) return "http://localhost:3000";
  try {
    return new URL(raw).toString().replace(/\/$/, "");
  } catch {
    return "http://localhost:3000";
  }
}

const APP_URL = resolveAppUrl();

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/admin/",
          "/dashboard/",
          "/login/",
          "/verify/",
          "/auth/",
          "/preview/",
          "/sandbox/",
        ],
      },
    ],
    sitemap: new URL("/sitemap.xml", APP_URL).toString(),
  };
}
