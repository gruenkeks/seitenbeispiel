'use client';

import { useConfigStore } from '@/store/config-store';
import { getNicheDefaults } from '@/lib/niche-defaults';
import { Button } from '@/components/ui/button';
import { Phone, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';

interface HeroProps {
  onOpenQuote: () => void;
  onOpenBooking: () => void;
}

export default function Hero({ onOpenQuote, onOpenBooking }: HeroProps) {
  const { config } = useConfigStore();
  const defaults = getNicheDefaults(config.niche);
  const [cacheBust, setCacheBust] = useState('');

  useEffect(() => {
    setCacheBust(`?t=${Date.now()}`);
  }, []);

  const showCta = config.showHeaderCta;
  const showConsultation = showCta && (config.heroButtonType === 'Consultation' || config.heroButtonType === 'Both');
  const showQuote = showCta && (config.heroButtonType === 'Quote' || config.heroButtonType === 'Both');

  return (
    <section className="relative min-h-[600px] w-full overflow-hidden bg-slate-900 text-white flex items-center justify-center text-center">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-700 ease-in-out"
        style={{ backgroundImage: `url(${config.heroImage || defaults.heroImage}${cacheBust})` }}
      >
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <div className="relative z-10 container mx-auto px-6 py-20 flex flex-col items-center max-w-4xl">
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight tracking-tight">
            {defaults.heroTitle}
          </h1>
          <p className="text-xl md:text-2xl text-slate-200 max-w-2xl mx-auto leading-relaxed">
            {config.slogan || defaults.heroDescription}
          </p>
          
          {(showConsultation || showQuote) && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              {showConsultation && (
                <Button 
                  size="lg" 
                  className="text-lg font-semibold px-8 py-6 shadow-lg hover:scale-105 transition-transform"
                  style={{ backgroundColor: config.primaryColor }}
                  onClick={onOpenBooking}
                >
                  {config.consultationButtonText || 'Kostenlosen Beratungstermin buchen'}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              )}

              {showQuote && (
                <Button 
                  size="lg" 
                  className="text-lg font-semibold px-8 py-6 shadow-lg hover:scale-105 transition-transform"
                  style={{ backgroundColor: config.primaryColor }}
                  onClick={onOpenQuote}
                >
                  {config.quoteButtonText || 'Unverbindliches Angebot anfordern'}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
