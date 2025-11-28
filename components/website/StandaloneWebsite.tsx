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
  const { config, updateConfig } = useConfigStore();
  const [isLoaded, setIsLoaded] = useState(!enableConfigFetch);
  
  // Modal State
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  useEffect(() => {
    if (!enableConfigFetch) return;

    // Try to load config from public/website-config.json
    fetch('/website-config.json')
      .then(res => {
        if (res.ok) return res.json();
        throw new Error('Config not found');
      })
      .then((data: BusinessConfig) => {
        // Hydrate the store with the external config
        // This overrides whatever is in localStorage/default
        Object.keys(data).forEach(key => {
             // @ts-ignore
             updateConfig({ [key]: data[key] });
        });
        setIsLoaded(true);
      })
      .catch(err => {
        console.warn("Standalone mode: Could not load website-config.json, using default/storage.", err);
        setIsLoaded(true);
      });
  }, [updateConfig, enableConfigFetch]);

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

