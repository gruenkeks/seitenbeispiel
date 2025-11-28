'use client';

import { useConfigStore } from '@/store/config-store';
import { useState, useEffect } from 'react';

export default function ServicesSection() {
  const { config } = useConfigStore();
  const [cacheBust, setCacheBust] = useState('');

  useEffect(() => {
    setCacheBust(`?t=${Date.now()}`);
  }, []);

  if (!config.navLinks.services) return null;

  return (
    <section id="services" className="py-20 bg-slate-50">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold mb-12 text-center text-slate-800">Unsere Leistungen</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {config.servicesList.map((service) => (
            <div key={service.id} className="bg-white rounded-xl shadow-sm overflow-hidden group hover:shadow-md transition-shadow">
              <div className="h-48 w-full bg-slate-200 relative overflow-hidden">
                 {service.imageUrl ? (
                    <img
                      src={`${service.imageUrl}${cacheBust}`}
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
  );
}
