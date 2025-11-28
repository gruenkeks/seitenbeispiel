'use client';

import { useConfigStore } from '@/store/config-store';
import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function AboutSection() {
  const { config } = useConfigStore();
  const [cacheBust, setCacheBust] = useState('');

  useEffect(() => {
    setCacheBust(`?t=${Date.now()}`);
  }, []);
  
  if (!config.aboutSection.show) return null;

  // Encode address for Google Maps Embed
  const encodedAddress = encodeURIComponent(config.address);

  return (
    <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          
          {/* Text Content */}
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
              {config.aboutSection.title}
            </h2>
            <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed whitespace-pre-wrap">
              {config.aboutSection.text}
            </div>
            
            {/* Address & Map */}
            <div className="pt-6">
              <h3 className="font-semibold text-lg mb-2">Unser Standort</h3>
              <p className="text-slate-500 mb-4">{config.address}</p>
              
              <div className="w-full h-[300px] rounded-xl overflow-hidden shadow-sm border border-slate-200 bg-slate-100">
                <iframe 
                  width="100%" 
                  height="100%" 
                  src={`https://maps.google.com/maps?q=${encodedAddress}&t=m&z=15&output=embed&iwloc=A`}
                  style={{ border: 0 }}
                  title="Standort Karte"
                  allowFullScreen
                  loading="lazy"
                ></iframe>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="relative h-[500px] w-full rounded-2xl overflow-hidden shadow-xl">
             {config.aboutSection.imageUrl ? (
                <img
                  src={`${config.aboutSection.imageUrl}${cacheBust}`}
                  alt="Über uns"
                  className="object-cover w-full h-full"
                />
             ) : (
               <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-400">
                 Kein Bild gewählt
               </div>
             )}
          </div>

        </div>
      </div>
    </section>
  );
}
