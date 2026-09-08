import React from 'react';
import { Globe, Accessibility, HelpCircle, Phone } from 'lucide-react';

export default function GovernmentTopbar() {
  return (
    <div className="gov-topbar">
      <div className="page-container">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-forest-200 font-medium">
              🇮🇳 Government of India Initiative — Ministry of Consumer Affairs, Food &amp; Public Distribution
            </span>
            <span className="hidden md:block text-forest-400">|</span>
            <span className="hidden md:block text-forest-300">Department of Consumer Affairs (DoCA)</span>
          </div>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-1 text-forest-300 hover:text-white transition-colors">
              <Accessibility size={12} />
              <span className="hidden sm:inline">Accessibility</span>
            </button>
            <button className="flex items-center gap-1 text-forest-300 hover:text-white transition-colors">
              <Globe size={12} />
              <span className="hidden sm:inline">हिंदी</span>
            </button>
            <button className="flex items-center gap-1 text-forest-300 hover:text-white transition-colors">
              <HelpCircle size={12} />
              <span className="hidden sm:inline">Help</span>
            </button>
            <a href="tel:1800-xxx-xxxx" className="flex items-center gap-1 text-forest-300 hover:text-white transition-colors">
              <Phone size={12} />
              <span className="hidden sm:inline">1800-xxx-xxxx</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
