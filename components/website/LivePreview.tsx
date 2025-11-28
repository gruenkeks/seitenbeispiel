'use client';

import { useState } from 'react';
import { useConfigStore } from '@/store/config-store';
import Navbar from './Navbar';
import Hero from './Hero';
import AboutSection from './AboutSection';
import ReviewsSection from './ReviewsSection';
import ChatWidget from './ChatWidget';
import QuoteModal from './QuoteModal';
import BookingModal from './BookingModal';
import Footer from './Footer';
import { Lock } from 'lucide-react';
import Image from 'next/image';

export default function LivePreview() {
  const { config } = useConfigStore();
  
  // Modal State
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  return (
    <div className="h-full flex flex-col bg-slate-100 p-4 md:p-8 overflow-hidden">
      {/* Browser Chrome */}
      <div className="bg-white rounded-t-xl border border-slate-200 border-b-0 shadow-sm p-3 flex items-center gap-4 shrink-0">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-400" />
          <div className="w-3 h-3 rounded-full bg-yellow-400" />
          <div className="w-3 h-3 rounded-full bg-green-400" />
        </div>
        
        {/* Address Bar */}
        <div className="flex-1 bg-slate-100 rounded-md px-3 py-1.5 flex items-center gap-2 text-xs text-slate-500">
          <Lock className="h-3 w-3" />
          <span>{config.companyName.toLowerCase().replace(/[^a-z0-9]/g, '')}.de</span>
        </div>
      </div>

      {/* Website Content */}
      <div className="flex-1 bg-white rounded-b-xl border border-slate-200 shadow-sm overflow-y-auto relative scroll-smooth">
        
        <Navbar 
          onOpenQuote={() => setIsQuoteOpen(true)}
          onOpenBooking={() => setIsBookingOpen(true)}
        />
        
        <Hero 
          onOpenQuote={() => setIsQuoteOpen(true)}
          onOpenBooking={() => setIsBookingOpen(true)}
        />

        {/* Services Grid */}
        {config.navLinks.services && (
          <section id="services" className="py-20 bg-slate-50">
            <div className="container mx-auto px-6">
              <h2 className="text-3xl font-bold mb-12 text-center text-slate-800">Unsere Leistungen</h2>
              <div className="grid md:grid-cols-3 gap-8">
                {config.servicesList.map((service) => (
                  <div key={service.id} className="bg-white rounded-xl shadow-sm overflow-hidden group hover:shadow-md transition-shadow">
                    <div className="h-48 w-full bg-slate-200 relative overflow-hidden">
                       {service.imageUrl ? (
                          <img 
                            src={service.imageUrl} 
                            alt={service.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                          />
                       ) : (
                         <div className="w-full h-full flex items-center justify-center text-slate-400">
                           Kein Bild
                         </div>
                       )}
                    </div>
                    <div className="p-6">
                      <h3 className="font-semibold text-xl mb-3 text-slate-900">{service.name}</h3>
                      <p className="text-slate-600 text-sm leading-relaxed">{service.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        <AboutSection />

        <ReviewsSection />
        
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
    </div>
  );
}
