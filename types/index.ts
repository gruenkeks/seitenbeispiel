export type NicheType = "General" | "PlumbingOnly" | "HeatingOnly";
export type HeroButtonType = "Consultation" | "Quote" | "Both";
export type NotificationType = "Email" | "SMS" | "Both";
export type CtaLocation = "Header" | "Navbar" | "Both" | "None";

export interface ServiceItem {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  imagePrompt?: string;
}

export interface ReviewItem {
  id: string;
  author: string;
  rating: number; // Should be 4 or 5 for display
  text: string;
  date: string;
  imageUrl?: string; // Profile pic or context image
}

export interface BusinessConfig {
  // Core Identity
  companyName: string;
  slogan: string;
  address: string; // Street, Zip, City
  contact: {
    phone: string;
    email: string;
  };
  smsSenderName: string; // Max 11 chars, alphanumeric
  telegramChatId?: string; // NEW: Optional Telegram Chat ID

  // Design & Content
  niche: NicheType;
  primaryColor: string; // Hex
  
  // Header & Navigation
  heroButtonType: HeroButtonType; // Determines text "Unverbindliches Angebot" vs "Beratungstermin" for Header
  navbarButtonType: HeroButtonType; // Separate control for Navbar button text/type
  navbarButtonText?: string; // Custom text for the navbar button
  
  consultationButtonText?: string;
  quoteButtonText?: string;
  
  consultationButtonLocation: CtaLocation; // Legacy? Might need refactor, but keeping for compatibility
  quoteButtonLocation: CtaLocation; 
  
  // New specific toggles
  showNavbarCta: boolean;
  showHeaderCta: boolean;

  navLinks: {
    services: boolean;
    about: boolean;
    contact: boolean;
  };
  
  // Content Sections
  heroImage: string; // Customizable large hero image
  heroImagePrompt?: string;
  aboutSection: {
    show: boolean;
    title: string;
    text: string; // Template text
    imageUrl?: string; // Optional about image
    imagePrompt?: string;
  };
  
  // Services
  servicesList: ServiceItem[];

  // Reviews
  reviews: ReviewItem[]; // 4-5 star mock reviews

  // Feature Toggles
  enableChatWidget: boolean;
  enableBookingSystem: boolean;
  enableReputationPage: boolean; // If true, enables /bewerten route

  // Integration Settings
  ownerNotificationType: NotificationType;
  googleReviewLink: string;
  githubRepo?: string;

  // Calendar Configuration
  slotDuration: 15 | 30 | 45;
  availableHours: {
    start: string; // "08:00"
    end: string; // "17:00"
  };
  blockedDays: number[]; // 0=Sunday, 1=Monday, etc.
}

export interface LeadPayload {
  meta: {
    source: "website-builder";
    ownerPhone: string;
    ownerEmail: string;
    smsSenderName: string;
    telegramChatId?: string; // NEW
    notificationType: NotificationType;
  };
  lead: {
    type: "chat" | "quote" | "booking" | "feedback";
    name: string;
    phone: string;
    email: string;
    message?: string;
    requestedSlot?: string; // ISO Date string
  };
}
