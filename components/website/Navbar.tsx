'use client';

import { useConfigStore } from '@/store/config-store';
import { Button } from '@/components/ui/button';
import { Phone, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface NavbarProps {
  onOpenQuote: () => void;
  onOpenBooking: () => void;
}

export default function Navbar({ onOpenQuote, onOpenBooking }: NavbarProps) {
  const { config } = useConfigStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isConsultation = config.navbarButtonType === 'Consultation';
  const isQuote = config.navbarButtonType === 'Quote';
  const showButton = config.showNavbarCta;
  
  // Short labels for Navbar
  const defaultLabel = isConsultation ? "Termin buchen" : "Angebot anfordern";
  const buttonLabel = config.navbarButtonText || defaultLabel;
  const onAction = isConsultation ? onOpenBooking : onOpenQuote;

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Logo / Company Name */}
        <div className="font-bold text-xl md:text-2xl text-slate-800">
          {config.companyName}
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {config.navLinks.services && (
            <a href="#services" className="text-slate-600 hover:text-slate-900 font-medium transition-colors">Leistungen</a>
          )}
          {(config.navLinks.about || config.navLinks.contact) && (
            <a href="#about" className="text-slate-600 hover:text-slate-900 font-medium transition-colors">Über uns & Kontakt</a>
          )}
          
          {showButton && (
             <div className="ml-4">
                 <Button 
                   style={{ backgroundColor: config.primaryColor }}
                   onClick={onAction}
                   className="shadow-lg hover:scale-105 transition-transform"
                 >
                   {buttonLabel}
                 </Button>
             </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden p-2 text-slate-600"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 p-4 flex flex-col gap-4 shadow-lg absolute w-full">
           {config.navLinks.services && <a href="#services" className="block py-2 text-slate-600">Leistungen</a>}
           {(config.navLinks.about || config.navLinks.contact) && <a href="#about" className="block py-2 text-slate-600">Über uns & Kontakt</a>}
           
           {showButton && (
               <Button 
                 style={{ backgroundColor: config.primaryColor }}
                 onClick={onAction}
                 className="w-full mt-2"
               >
                 {buttonLabel}
               </Button>
           )}
        </div>
      )}
    </nav>
  );
}

