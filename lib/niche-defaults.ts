import { NicheType } from "@/types";

export const getNicheDefaults = (niche: NicheType) => {
  switch (niche) {
    case "PlumbingOnly":
      return {
        heroImage: "/images/service-3.png",
        heroTitle: "Ihr Profi für Sanitärinstallationen",
        heroDescription: "Wir kümmern uns um Ihre Rohre, Bäder und Wasseranschlüsse. Schnell, sauber und zuverlässig."
      };
    case "HeatingOnly":
      return {
        heroImage: "/images/service-2.png",
        heroTitle: "Effiziente Heiztechnik für Ihr Zuhause",
        heroDescription: "Von der Wartung bis zur Neuinstallation – wir sorgen für Wärme und Behaglichkeit."
      };
    default: // General (SHK)
      return {
        heroImage: "/images/hero-default.png",
        heroTitle: "Meisterbetrieb für Sanitär & Heizung",
        heroDescription: "Ihr zuverlässiger Partner für Bad, Heizung und Haustechnik aus einer Hand."
      };
  }
};

