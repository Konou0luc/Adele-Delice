import type { MetadataRoute } from "next";

const siteUrl = "https://adele-delice.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "/",
    "/about",
    "/menu",
    "/gallery",
    "/reviews",
    "/contact",
    "/blog",
    "/login",
    "/register",
  ];

  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "/" ? "daily" : "weekly",
    priority: route === "/" ? 1 : 0.7,
  }));
}