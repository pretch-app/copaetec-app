import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Copa ETec 2026",
    short_name: "Copa ETec",
    description:
      "Torneo intercolegial de fútbol 6: fixture, resultados en vivo, tabla de posiciones, goleadores y galería.",
    start_url: "/",
    id: "/",
    display: "standalone",
    orientation: "portrait",
    lang: "es-AR",
    dir: "ltr",
    background_color: "#09090b",
    theme_color: "#09090b",
    categories: ["sports"],
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  }
}
