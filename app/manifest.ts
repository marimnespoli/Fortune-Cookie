import type { MetadataRoute } from "next";

// Installable as a phone app ("Add to Home Screen").
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Fortune Cookie",
    short_name: "Fortune",
    description: "Crack a cookie and get a fortune written just for you.",
    start_url: "/",
    display: "standalone",
    background_color: "#1b2254",
    theme_color: "#1b2254",
    icons: [
      { src: "/icon.png", sizes: "512x512", type: "image/png" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
