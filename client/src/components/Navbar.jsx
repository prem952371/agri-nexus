import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingCart, ChevronDown, Leaf } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { cartCount, role, logout } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'Marketplace', to: '/marketplace' },
    { label: 'How It Works', to: '/#how-it-works' },
    { label: 'For Farmers', to: '/#for-farmers' },
    { label: 'For Buyers', to: '/#for-buyers' },
    { label: 'About', to: '/#about' },
  ];

  const isActive = (to) => location.pathname === to;

  return (
    <nav className="bg-white border-b border-agri-border sticky top-0 z-40 shadow-sm">
      <div className="page-container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-forest-800 rounded-lg flex items-center justify-center">
              <Leaf size={18} className="text-white" />
            </div>
            <div>
              <div className="text-lg font-bold text-forest-800 leading-none">AgriNexus</div>
              <div className="text-[10px] text-agri-muted font-medium leading-none mt-0.5">Digital Agricultural Marketplace</div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150 ${
                  isActive(link.to) 
                    ? 'text-forest-800 bg-forest-50' 
                    : 'text-gray-600 hover:text-forest-800 hover:bg-gray-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right actions */}
          <div className="hidden lg:flex items-center gap-3">
            {role ? (
              <>
                <Link to="/cart" className="relative btn-ghost">
                  <ShoppingCart size={18} />
                  <span>Cart</span>
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-forest-600 text-white text-xs rounded-full flex items-center justify-center font-bold">
                      {cartCount > 9 ? '9+' : cartCount}
                    </span>
                  )}
                </Link>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-forest-100 flex items-center justify-center">
                    <span className="text-forest-800 text-xs font-bold capitalize">{role[0]}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-700 capitalize">{role.replace('_', ' ')}</span>
                  <button onClick={logout} className="text-xs text-gray-400 hover:text-red-500 transition-colors">
                    Sign out
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/marketplace" className="btn-ghost">
                  Explore Marketplace
                </Link>
                <Link to="/login" className="btn-primary">
                  Login
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden items-center gap-2">
            {role && (
              <Link to="/cart" className="relative p-2 text-gray-600">
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-forest-600 text-white text-[10px] rounded-full flex items-center justify-center">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </Link>
            )}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 text-gray-600 hover:text-forest-800"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-gray-100 py-3 space-y-1">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2.5 text-sm font-medium text-gray-600 hover:text-forest-800 hover:bg-forest-50 rounded-lg"
              >
                {link.label}
              </Link>
            ))}
            {!role ? (
              <div className="flex gap-2 pt-2">
                <Link to="/login" onClick={() => setMobileOpen(false)} className="btn-primary flex-1 justify-center">
                  Login
                </Link>
              </div>
            ) : (
              <button onClick={() => { logout(); setMobileOpen(false); }} className="w-full text-left px-3 py-2.5 text-sm text-red-500">
                Sign out ({role.replace('_', ' ')})
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
