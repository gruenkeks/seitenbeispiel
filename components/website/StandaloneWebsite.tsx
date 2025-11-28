'use client';

import { useEffect, useState } from 'react';
import { useConfigStore } from '@/store/config-store';
import Navbar from './Navbar';
import Hero from './Hero';
import AboutSection from './AboutSection';
import ServicesSection from './ServicesSection';
import ReviewsSection from './ReviewsSection';
import ChatWidget from './ChatWidget';
import QuoteModal from './QuoteModal';
import BookingModal from './BookingModal';
import Footer from './Footer';
import { BusinessConfig } from '@/types';

export default function StandaloneWebsite({ enableConfigFetch = true }: { enableConfigFetch?: boolean }) {
  const { config, updateConfig, hydrateFromConfigFile } = useConfigStore();
  const [isLoaded, setIsLoaded] = useState(!enableConfigFetch);

  // Modal State
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  useEffect(() => {
    if (!enableConfigFetch) return;

    // Try to load config from public/config.json or website-config.json
    hydrateFromConfigFile().then(() => {
      setIsLoaded(true);
    }).catch((err: any) => {
      console.warn("Standalone mode: Could not load config file.", err);
      setIsLoaded(true);
    });
  }, [hydrateFromConfigFile, enableConfigFetch]);

  if (!isLoaded) return <div className="min-h-screen bg-white flex items-center justify-center">Laden...</div>;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar 
        onOpenQuote={() => setIsQuoteOpen(true)} 
        onOpenBooking={() => setIsBookingOpen(true)} 
      />
      
      <main className="flex-1">
        <Hero 
           onOpenQuote={() => setIsQuoteOpen(true)} 
           onOpenBooking={() => setIsBookingOpen(true)} 
        />
        
        <ServicesSection />
        
        <AboutSection />

        <ReviewsSection />
      </main>
      
      <Footer />

      {/* Overlays */}
      <ChatWidget />
      
      <QuoteModal 
        isOpen={isQuoteOpen} 
        onClose={() => setIsQuoteOpen(false)} 
      />
      
      <BookingModal 
        isOpen={isBookingOpen} 
        onClose={() => setIsBookingOpen(false)} 
      />
    </div>
  );
}
