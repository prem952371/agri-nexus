import React, { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight, TrendingUp, Users, ShoppingBag, Truck, CheckCircle,
  BarChart2, Leaf, MapPin, Shield, Zap, ChevronRight, Package, Star,
  ArrowUpRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const STATS = [
  { value: '12,400+', label: 'Farmers Connected', icon: Users },
  { value: '340+', label: 'FPOs Onboarded', icon: Leaf },
  { value: '2,80,000 kg', label: 'Produce Listed', icon: Package },
  { value: '48,500+', label: 'Orders Delivered', icon: Truck },
];

const HOW_IT_WORKS = [
  { icon: Users, title: 'Farmer/FPO Registration', desc: 'Farmers and FPOs register and list their available produce with prices, quality, and quantity.', step: '01' },
  { icon: Package, title: 'List Produce', desc: 'Upload produce details including quantity, price per kg, quality grade, and harvest date.', step: '02' },
  { icon: ShoppingBag, title: 'Buyer Places Order', desc: 'Consumers and bulk buyers browse the marketplace and place direct orders.', step: '03' },
  { icon: TrendingUp, title: 'AI Demand Forecasting', desc: 'Our AI analyzes historical sales data to predict demand and recommend optimal pricing.', step: '04' },
  { icon: Truck, title: 'Smart Logistics', desc: 'Route optimization groups nearby orders to reduce delivery costs by up to 35%.', step: '05' },
  { icon: CheckCircle, title: 'Farmer Gets Paid', desc: 'Farmers receive payments directly — up to 33% more earnings than through traditional channels.', step: '06' },
];

const FEATURES = [
  { icon: TrendingUp, title: 'AI Demand Forecasting', desc: 'Predict market demand using historical patterns to help farmers plan supply and pricing.', color: 'text-blue-600 bg-blue-50' },
  { icon: Truck, title: 'Smart Route Optimization', desc: 'Group orders intelligently to reduce delivery costs and carbon footprint.', color: 'text-orange-600 bg-orange-50' },
  { icon: Shield, title: 'Direct Price Transparency', desc: 'Eliminate hidden margins. Farmers see what buyers pay, buyers see what farmers earn.', color: 'text-purple-600 bg-purple-50' },
  { icon: BarChart2, title: 'Real-Time Analytics', desc: 'Supply chain visibility with live dashboards for farmers, buyers, and administrators.', color: 'text-green-600 bg-green-50' },
  { icon: Users, title: 'FPO Integration', desc: 'Farmer Producer Organisations can list collective produce for bulk buyers.', color: 'text-teal-600 bg-teal-50' },
  { icon: Zap, title: 'Instant Settlement', desc: 'Digital payments directly to farmer bank accounts upon order confirmation.', color: 'text-yellow-600 bg-yellow-50' },
];

export default function LandingPage() {
  const { role } = useApp();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (role) {
      const routes = { farmer: '/farmer', consumer: '/buyer', bulk_buyer: '/buyer', logistics: '/logistics', admin: '/admin' };
      navigate(routes[role] || '/marketplace');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-white to-agri-light overflow-hidden">
        {/* Decorative background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-forest-50/60 to-transparent" />
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-green-100/40 rounded-full blur-3xl" />
          <div className="absolute top-40 left-0 w-64 h-64 bg-emerald-100/30 rounded-full blur-3xl" />
        </div>

        <div className="page-container relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center py-16 lg:py-24">
            {/* Left: Text */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-forest-100 text-forest-700 rounded-full text-xs font-semibold mb-6">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                SIH 2024 — Problem Statement #26033
              </div>
              
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-forest-900 leading-tight mb-6">
                Connecting Farms
                <span className="block text-forest-600">Directly to Markets</span>
              </h1>
              
              <p className="text-lg text-gray-600 leading-relaxed mb-8 max-w-lg">
                AgriNexus empowers farmers and FPOs to reach consumers and bulk buyers directly, 
                while AI-powered insights and smart logistics build a more efficient agricultural 
                supply chain.
              </p>
              
              <div className="flex flex-wrap gap-3 mb-10">
                <Link to="/marketplace" className="btn-primary text-base px-6 py-3">
                  <ShoppingBag size={18} />
                  Explore Marketplace
                  <ArrowRight size={16} />
                </Link>
                <button onClick={handleGetStarted} className="btn-secondary text-base px-6 py-3">
                  View Demo Dashboard
                </button>
              </div>

              {/* Trust indicators */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-agri-muted">
                <span className="flex items-center gap-1.5">
                  <CheckCircle size={14} className="text-green-500" />
                  No Intermediaries
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle size={14} className="text-green-500" />
                  AI-Powered Insights
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle size={14} className="text-green-500" />
                  Smart Logistics
                </span>
              </div>
            </div>

            {/* Right: Visual */}
            <div className="relative">
              <div className="relative">
                {/* Main visual card */}
                <div className="bg-white rounded-3xl shadow-2xl border border-agri-border p-6 mx-auto max-w-sm">
                  <div className="text-center mb-5">
                    <div className="text-5xl mb-2">🌾</div>
                    <h3 className="font-bold text-forest-800">Today's Market</h3>
                    <p className="text-xs text-agri-muted">Live prices from verified farmers</p>
                  </div>
                  
                  {[
                    { name: 'Basmati Rice', farmer: 'Sukhdev Singh, Punjab', price: 65, qty: '1,500 kg', badge: 'Grade A', emoji: '🌾' },
                    { name: 'Tomatoes', farmer: 'Lakshmi Devi, Nashik', price: 22, qty: '800 kg', badge: 'Grade A', emoji: '🍅' },
                    { name: 'Red Apples', farmer: 'Harpreet Kaur, Punjab', price: 95, qty: '600 kg', badge: 'Grade A', emoji: '🍎' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                      <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                        {item.emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm text-gray-800">{item.name}</div>
                        <div className="text-xs text-agri-muted truncate">{item.farmer}</div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="font-bold text-forest-700">₹{item.price}/kg</div>
                        <div className="text-xs text-gray-400">{item.qty}</div>
                      </div>
                    </div>
                  ))}

                  <Link to="/marketplace" className="btn-primary w-full justify-center mt-4">
                    View All Products
                    <ArrowRight size={14} />
                  </Link>
                </div>

                {/* Floating badges */}
                <div className="absolute -top-4 -left-4 bg-white rounded-2xl shadow-lg border border-agri-border p-3 flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <TrendingUp size={14} className="text-green-600" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-800">+33% Earnings</div>
                    <div className="text-[10px] text-agri-muted">For farmers</div>
                  </div>
                </div>

                <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl shadow-lg border border-agri-border p-3 flex items-center gap-2">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <Truck size={14} className="text-orange-600" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-800">-35% Logistics</div>
                    <div className="text-[10px] text-agri-muted">Cost savings</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-forest-800 text-white py-12">
        <div className="page-container">
          <p className="text-center text-forest-300 text-xs mb-6 uppercase tracking-wider font-medium">
            Platform Demo Statistics
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {STATS.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="flex justify-center mb-3">
                  <div className="w-12 h-12 bg-forest-700 rounded-xl flex items-center justify-center">
                    <stat.icon size={20} className="text-forest-200" />
                  </div>
                </div>
                <div className="text-2xl lg:text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-forest-300 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="page-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-forest-800 mb-3">How AgriNexus Works</h2>
            <p className="text-agri-muted max-w-xl mx-auto">
              A simple six-step process from farm to market, powered by technology and AI.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {HOW_IT_WORKS.map((step, i) => (
              <div key={i} className="relative">
                <div className="card h-full">
                  <div className="flex items-start gap-4">
                    <div className="text-4xl font-black text-forest-100 leading-none flex-shrink-0">{step.step}</div>
                    <div>
                      <div className="w-10 h-10 bg-forest-100 rounded-xl flex items-center justify-center mb-3">
                        <step.icon size={18} className="text-forest-700" />
                      </div>
                      <h3 className="font-bold text-forest-800 mb-2">{step.title}</h3>
                      <p className="text-sm text-agri-muted leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                </div>
                {i < HOW_IT_WORKS.length - 1 && (
                  <div className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-6 h-6 bg-forest-600 rounded-full items-center justify-center">
                    <ChevronRight size={14} className="text-white" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Traditional vs AgriNexus */}
      <section className="py-20 bg-agri-light">
        <div className="page-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-forest-800 mb-3">The Problem We Solve</h2>
            <p className="text-agri-muted max-w-xl mx-auto">
              Multiple intermediaries in the traditional supply chain reduce farmers' earnings and increase consumer prices.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Traditional */}
            <div className="card border-l-4 border-red-400">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                  <span className="text-red-600 font-bold text-lg">!</span>
                </div>
                <h3 className="font-bold text-gray-800 text-lg">Traditional Supply Chain</h3>
              </div>
              <div className="space-y-3">
                {['Farmer', 'Village Trader', 'Commission Agent', 'Wholesaler', 'Distributor', 'Retailer', 'Consumer'].map((step, i, arr) => (
                  <div key={i}>
                    <div className={`flex items-center gap-3 p-2 rounded-lg ${step === 'Farmer' ? 'bg-red-50' : step === 'Consumer' ? 'bg-red-50' : 'bg-gray-50'}`}>
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${step === 'Farmer' || step === 'Consumer' ? 'bg-red-400' : 'bg-gray-300'}`} />
                      <span className="text-sm font-medium text-gray-700">{step}</span>
                      {(step === 'Village Trader' || step === 'Commission Agent' || step === 'Wholesaler' || step === 'Distributor' || step === 'Retailer') && (
                        <span className="ml-auto text-xs text-red-500 font-medium">+margin</span>
                      )}
                    </div>
                    {i < arr.length - 1 && <div className="ml-4 w-0.5 h-3 bg-gray-200" />}
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 bg-red-50 rounded-xl">
                <div className="text-sm font-semibold text-red-700">Farmer gets ₹18/kg • Consumer pays ₹32/kg</div>
                <div className="text-xs text-red-500 mt-1">₹14/kg absorbed by 5 intermediaries</div>
              </div>
            </div>

            {/* AgriNexus */}
            <div className="card border-l-4 border-green-400">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <Leaf size={18} className="text-green-600" />
                </div>
                <h3 className="font-bold text-gray-800 text-lg">AgriNexus Platform</h3>
              </div>
              <div className="space-y-3">
                {['Farmer / FPO', 'AgriNexus Platform', 'Consumer / Bulk Buyer'].map((step, i, arr) => (
                  <div key={i}>
                    <div className={`flex items-center gap-3 p-2 rounded-lg ${step === 'AgriNexus Platform' ? 'bg-green-50 border border-green-200' : 'bg-gray-50'}`}>
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${step === 'AgriNexus Platform' ? 'bg-green-500' : 'bg-forest-500'}`} />
                      <span className={`text-sm font-medium ${step === 'AgriNexus Platform' ? 'text-forest-700' : 'text-gray-700'}`}>{step}</span>
                      {step === 'AgriNexus Platform' && (
                        <span className="ml-auto text-xs text-green-600 font-medium flex items-center gap-1">
                          <Zap size={10} /> AI-powered
                        </span>
                      )}
                    </div>
                    {i < arr.length - 1 && <div className="ml-4 w-0.5 h-6 bg-green-200" />}
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 bg-green-50 rounded-xl">
                <div className="text-sm font-semibold text-green-700">Farmer gets ₹24/kg • Consumer pays ₹29/kg</div>
                <div className="text-xs text-green-600 mt-1">+33% farmer earnings • -9.4% consumer prices</div>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {[
                  { label: 'Fewer intermediaries', icon: '✓' },
                  { label: 'Price transparency', icon: '✓' },
                  { label: 'Efficient logistics', icon: '✓' },
                  { label: 'Better market access', icon: '✓' },
                ].map((b, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-xs text-green-700 font-medium">
                    <span className="text-green-500">{b.icon}</span>
                    {b.label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="for-farmers" className="py-20 bg-white">
        <div className="page-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-forest-800 mb-3">Platform Features</h2>
            <p className="text-agri-muted max-w-xl mx-auto">
              Built with modern technology to serve India's agricultural ecosystem.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <div key={i} className="card-hover p-6">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${f.color}`}>
                  <f.icon size={22} />
                </div>
                <h3 className="font-bold text-forest-800 mb-2">{f.title}</h3>
                <p className="text-sm text-agri-muted leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="for-buyers" className="py-20 bg-forest-800 text-white">
        <div className="page-container text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-forest-300 mb-8 max-w-lg mx-auto">
            Join thousands of farmers and buyers already using AgriNexus to build a better agricultural supply chain.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/marketplace" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-forest-800 font-semibold rounded-lg hover:bg-forest-50 transition-colors">
              <ShoppingBag size={18} />
              Explore Marketplace
            </Link>
            <Link to="/login" className="inline-flex items-center gap-2 px-6 py-3 border-2 border-forest-400 text-white font-semibold rounded-lg hover:bg-forest-700 transition-colors">
              Enter Demo Dashboard
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
