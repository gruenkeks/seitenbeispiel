'use client';

import { useConfigStore } from '@/store/config-store';

export default function Footer() {
  const { config } = useConfigStore();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-400 py-8">
      <div className="container mx-auto px-6 flex flex-col items-center gap-6">
        
        {/* Legal Links - Small */}
        <div className="text-xs flex gap-6">
          <a href="#" className="hover:text-white transition-colors">Impressum</a>
          <a href="#" className="hover:text-white transition-colors">Datenschutz</a>
        </div>

        {/* Copyright - Centered */}
        <div className="text-xs text-slate-500 text-center">
          © {year} {config.companyName}. Alle Rechte vorbehalten.
        </div>
      </div>
    </footer>
  );
}
