import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "गन्ना हाट (GannaHaat) — Sugarcane Bidding Platform",
    short_name: "GannaHaat",
    description: "ग्रामीण भारत के गन्ना किसानों और व्यापारियों के लिए डिजिटल नीलामी मंच",
    start_url: "/",
    display: "standalone",
    background_color: "#fcfdfa",
    theme_color: "#166534",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
