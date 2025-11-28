import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { BusinessConfig } from '@/types';

interface ConfigState {
  config: BusinessConfig;
  updateConfig: (updates: Partial<BusinessConfig>) => void;
  resetConfig: () => void;
  updateNestedConfig: <K extends keyof BusinessConfig>(
    key: K, 
    updates: Partial<BusinessConfig[K]>
  ) => void;
}

const initialConfig: BusinessConfig = {
  companyName: "Rauch Sanitär-Heizungsbau",
  slogan: "Ihr Experte für Wärme und Wasser seit 1990",
  address: "Hauptstraße 42, 10115 Berlin",
  contact: {
    phone: "+4917621280315",
    email: "dennis@simontowsky.com"
  },
  smsSenderName: "RauchSHK",
  telegramChatId: "-5010244380",
  
  niche: "General",
  primaryColor: "#0ea5e9", // Sky 500
  
  // Header & Nav Defaults
  heroButtonType: "Consultation",
  navbarButtonType: "Consultation",
  
  consultationButtonText: "Kostenlosen Beratungstermin buchen",
  quoteButtonText: "Unverbindliches Angebot anfordern",
  
  // Default visibility
  showNavbarCta: true,
  showHeaderCta: true,
  
  consultationButtonLocation: "Both", // Deprecated/Legacy
  quoteButtonLocation: "Both", // Deprecated/Legacy
  
  navLinks: {
    services: true,
    about: true,
    contact: true
  },

  // Design defaults
  heroImage: "/images/hero-default.png",
  heroImagePrompt: "High quality hero image for General company, Rauch Sanitär-Heizungsbau. Professional, clean, modern architecture or plumbing.",
  aboutSection: {
    show: true,
    title: "Über uns",
    text: "Wir sind ein traditionsreicher Handwerksbetrieb, der sich auf moderne Sanitär- und Heizungslösungen spezialisiert hat. Unser Team steht für Qualität, Zuverlässigkeit und saubere Arbeit.",
    imageUrl: "/images/about-default.png",
    imagePrompt: "Team of professional plumbers or hvac technicians, friendly, german style, Rauch Sanitär-Heizungsbau"
  },

  servicesList: [
    { id: '1', name: "Rohrbruch & Notdienst", description: "Schnelle Hilfe bei Wasserschäden rund um die Uhr.", imageUrl: "/images/service-1.png", imagePrompt: "Professional photo for HVAC service: Rohrbruch & Notdienst. High quality, modern, clean." },
    { id: '2', name: "Heizungswartung", description: "Regelmäßige Wartung für effiziente Wärme.", imageUrl: "/images/service-2.png", imagePrompt: "Professional photo for HVAC service: Heizungswartung. High quality, modern, clean." },
    { id: '3', name: "Badsanierung", description: "Ihr Traumbad aus einer Hand geplant und realisiert.", imageUrl: "/images/service-3.png", imagePrompt: "Professional photo for HVAC service: Badsanierung. High quality, modern, clean." }
  ],

  reviews: [
    { id: '1', author: "Michael Schmidt", rating: 5, text: "Super Service, sehr pünktlich und sauber gearbeitet. Gerne wieder!", date: "vor 2 Wochen", imageUrl: "https://randomuser.me/api/portraits/men/32.jpg" },
    { id: '2', author: "Sabine Weber", rating: 5, text: "Die Badsanierung lief reibungslos. Tolles Team!", date: "vor 1 Monat", imageUrl: "https://randomuser.me/api/portraits/women/44.jpg" },
    { id: '3', author: "Thomas Müller", rating: 4, text: "Schnelle Terminvergabe bei der Heizungsstörung.", date: "vor 3 Monaten" }
  ],
  
  enableChatWidget: true,
  enableBookingSystem: true,
  enableReputationPage: true,
  
  ownerNotificationType: "Both",
  googleReviewLink: "https://g.page/r/placeholder/review",
  
  githubRepo: "https://github.com/gruenkeks/seitenbeispiel",

  slotDuration: 45,
  availableHours: {
    start: "08:00",
    end: "18:00"
  },
  blockedDays: [0, 6] // Sunday, Saturday
};

export const useConfigStore = create<ConfigState>()(
  persist(
    (set) => ({
      config: initialConfig,
      
      updateConfig: (updates) => set((state) => ({
        config: { ...state.config, ...updates }
      })),

      updateNestedConfig: (key, updates) => set((state) => ({
        config: {
          ...state.config,
          [key]: {
            ...(typeof state.config[key] === 'object' ? state.config[key] : {}),
            ...updates
          }
        }
      })),
      
      resetConfig: () => set({ config: initialConfig })
    }),
    {
      name: 'business-config-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
