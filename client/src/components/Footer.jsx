import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Mail, Phone, MapPin, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-forest-900 text-white">
      <div className="page-container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 bg-forest-700 rounded-lg flex items-center justify-center">
                <Leaf size={18} className="text-white" />
              </div>
              <div>
                <div className="text-lg font-bold">KrishiSetu</div>
                <div className="text-xs text-forest-300">Digital Agricultural Marketplace</div>
              </div>
            </div>
            <p className="text-forest-300 text-sm leading-relaxed mb-4">
              Empowering farmers and FPOs to connect directly with consumers and bulk buyers, 
              eliminating unnecessary intermediaries in India's agricultural supply chain.
            </p>
            <div className="text-xs text-forest-400 bg-forest-800 rounded-lg p-3">
              <strong className="text-forest-200">SIH Problem Statement #26033</strong><br />
              Ministry of Consumer Affairs, Food &amp; Public Distribution
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Platform</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Marketplace', to: '/marketplace' },
                { label: 'For Farmers', to: '/login' },
                { label: 'For Buyers', to: '/login' },
                { label: 'Logistics', to: '/login' },
                { label: 'Admin Portal', to: '/login' },
              ].map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="text-forest-300 hover:text-white text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Resources</h4>
            <ul className="space-y-2.5">
              {[
                  'About KrishiSetu',
                'How It Works',
                'Farmer Guide',
                'Buyer Guide',
                'API Documentation',
                'Terms of Service',
                'Privacy Policy',
              ].map(item => (
                <li key={item}>
                  <button className="text-forest-300 hover:text-white text-sm transition-colors">
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Contact</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-2 text-forest-300 text-sm">
                <Phone size={14} className="mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-white font-medium">Helpline</div>
                  <div>1800-xxx-xxxx (Toll Free)</div>
                  <div className="text-xs text-forest-400">Mon–Sat, 9 AM – 6 PM</div>
                </div>
              </div>
              <div className="flex items-start gap-2 text-forest-300 text-sm">
                <Mail size={14} className="mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-white font-medium">Email Support</div>
                  <div>help@krishisetu.gov.in</div>
                </div>
              </div>
              <div className="flex items-start gap-2 text-forest-300 text-sm">
                <MapPin size={14} className="mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-white font-medium">Office</div>
                  <div>Department of Consumer Affairs<br />Krishi Bhavan, New Delhi</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-forest-800">
        <div className="page-container py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-forest-400 text-xs text-center sm:text-left">
              © 2026 KrishiSetu — An initiative of Department of Consumer Affairs, Government of India.
              <span className="block sm:inline sm:ml-2">
                This is a demonstration platform for Smart India Hackathon 2024.
              </span>
            </p>
            <div className="flex items-center gap-4 text-xs text-forest-400">
              <button className="hover:text-forest-200 transition-colors">Terms</button>
              <button className="hover:text-forest-200 transition-colors">Privacy</button>
              <button className="hover:text-forest-200 transition-colors">Accessibility</button>
              <button className="flex items-center gap-1 hover:text-forest-200 transition-colors">
                <span>Feedback</span>
                <ExternalLink size={10} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
