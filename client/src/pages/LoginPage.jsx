import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sprout, ShoppingBag, Building2, Truck, ShieldCheck, ArrowRight, Leaf } from 'lucide-react';
import { useApp } from '../context/AppContext';
import GovernmentTopbar from '../components/GovernmentTopbar';

const ROLES = [
  {
    id: 'farmer',
    label: 'Farmer / FPO',
    icon: Sprout,
    description: 'List your produce, track orders, view AI demand forecasts, and manage your earnings.',
    features: ['Add & manage produce listings', 'View incoming orders', 'Demand forecast & AI insights', 'Earnings dashboard'],
    color: 'border-green-200 hover:border-green-400',
    iconColor: 'text-green-600 bg-green-100',
    btnColor: 'bg-green-700 hover:bg-green-800',
    user: { name: 'Ramesh Kumar', location: 'Karnal, Haryana' },
  },
  {
    id: 'consumer',
    label: 'Consumer Buyer',
    icon: ShoppingBag,
    description: 'Browse fresh produce from verified farmers, add to cart, and track your orders.',
    features: ['Browse & search marketplace', 'Add to cart & checkout', 'Track delivery status', 'Order history'],
    color: 'border-blue-200 hover:border-blue-400',
    iconColor: 'text-blue-600 bg-blue-100',
    btnColor: 'bg-blue-700 hover:bg-blue-800',
    user: { name: 'Priya Mehta', location: 'Delhi' },
  },
  {
    id: 'bulk_buyer',
    label: 'Bulk Buyer',
    icon: Building2,
    description: 'Place large volume orders from FPOs, get bulk pricing, and view supply analytics.',
    features: ['Bulk order (100kg+ per item)', 'Estimated savings vs traditional', 'Aggregated supply view', 'Bulk buyer dashboard'],
    color: 'border-purple-200 hover:border-purple-400',
    iconColor: 'text-purple-600 bg-purple-100',
    btnColor: 'bg-purple-700 hover:bg-purple-800',
    user: { name: 'Vikram Traders Pvt Ltd', location: 'Mumbai' },
  },
  {
    id: 'logistics',
    label: 'Logistics Manager',
    icon: Truck,
    description: 'Optimize delivery routes, group orders, and reduce transportation costs.',
    features: ['Route optimization AI', 'Delivery order management', 'Cost savings comparison', 'Delivery status tracking'],
    color: 'border-orange-200 hover:border-orange-400',
    iconColor: 'text-orange-600 bg-orange-100',
    btnColor: 'bg-orange-700 hover:bg-orange-800',
    user: { name: 'FastTrack Logistics', location: 'Delhi NCR' },
  },
  {
    id: 'admin',
    label: 'Platform Admin',
    icon: ShieldCheck,
    description: 'Full analytics dashboard, supply & demand monitoring, and intermediary impact analysis.',
    features: ['System-wide analytics', 'Supply & demand charts', 'Intermediary impact report', 'User & product management'],
    color: 'border-red-200 hover:border-red-400',
    iconColor: 'text-red-600 bg-red-100',
    btnColor: 'bg-red-700 hover:bg-red-800',
    user: { name: 'DoCA Administrator', location: 'New Delhi' },
  },
];

const DASHBOARD_ROUTES = {
  farmer: '/farmer',
  consumer: '/buyer',
  bulk_buyer: '/buyer',
  logistics: '/logistics',
  admin: '/admin',
};

export default function LoginPage() {
  const { selectRole } = useApp();
  const navigate = useNavigate();

  const handleSelectRole = (roleObj) => {
    selectRole(roleObj.id, roleObj.user);
    navigate(DASHBOARD_ROUTES[roleObj.id] || '/marketplace');
  };

  return (
    <div className="min-h-screen bg-agri-light">
      <GovernmentTopbar />
      
      <div className="page-container py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 bg-forest-800 rounded-2xl flex items-center justify-center">
              <Leaf size={26} className="text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-forest-800 mb-2">Welcome to AgriNexus</h1>
          <p className="text-agri-muted max-w-md mx-auto">
            Select your role to enter the demo. This is an SIH demonstration platform.
          </p>
          <div className="inline-flex items-center gap-2 mt-3 px-3 py-1.5 bg-amber-50 border border-amber-200 text-amber-700 rounded-full text-xs font-medium">
            <span>⚡</span>
            Demo Mode — No real authentication required
          </div>
        </div>

        {/* Role cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {ROLES.map(role => (
            <button
              key={role.id}
              onClick={() => handleSelectRole(role)}
              className={`card text-left border-2 transition-all duration-200 group cursor-pointer ${role.color}`}
            >
              <div className="flex items-start gap-4 mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${role.iconColor}`}>
                  <role.icon size={22} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 group-hover:text-forest-800 transition-colors">
                    {role.label}
                  </h3>
                  <p className="text-sm text-agri-muted leading-relaxed mt-1">
                    {role.description}
                  </p>
                </div>
              </div>

              <ul className="space-y-1.5 mb-5">
                {role.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs text-gray-600">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <div className={`flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-white text-sm font-semibold transition-colors ${role.btnColor}`}>
                Continue as {role.label.split(' ')[0]}
                <ArrowRight size={14} />
              </div>

              <p className="text-center text-[11px] text-gray-400 mt-2">
                Demo: {role.user.name}, {role.user.location}
              </p>
            </button>
          ))}
        </div>

        <p className="text-center text-xs text-agri-muted mt-8">
          This platform is a demonstration for Smart India Hackathon 2024 — Problem Statement #26033.<br />
          No real data is collected. All transactions are simulated.
        </p>
      </div>
    </div>
  );
}
