import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Package, Plus, ShoppingBag, TrendingUp, DollarSign,
  Store, ShoppingCart, ClipboardList, MapPin, BarChart2, Users,
  Truck, Route, Activity, Leaf, LogOut, Settings, ChevronRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const roleMenus = {
  farmer: [
    { label: 'Dashboard', to: '/farmer', icon: LayoutDashboard },
    { label: 'My Produce', to: '/farmer/produce', icon: Package },
    { label: 'Add Produce', to: '/farmer/add-produce', icon: Plus },
    { label: 'Orders', to: '/farmer/orders', icon: ClipboardList },
    { label: 'Demand Forecast', to: '/farmer/forecast', icon: TrendingUp },
    { label: 'Earnings', to: '/farmer/earnings', icon: DollarSign },
  ],
  consumer: [
    { label: 'Dashboard', to: '/buyer', icon: LayoutDashboard },
    { label: 'Marketplace', to: '/marketplace', icon: Store },
    { label: 'My Cart', to: '/cart', icon: ShoppingCart },
    { label: 'My Orders', to: '/buyer/orders', icon: ClipboardList },
  ],
  bulk_buyer: [
    { label: 'Dashboard', to: '/buyer', icon: LayoutDashboard },
    { label: 'Marketplace', to: '/marketplace', icon: Store },
    { label: 'My Cart', to: '/cart', icon: ShoppingCart },
    { label: 'My Orders', to: '/buyer/orders', icon: ClipboardList },
  ],
  logistics: [
    { label: 'Dashboard', to: '/logistics', icon: LayoutDashboard },
    { label: 'Route Optimization', to: '/logistics/routes', icon: Route },
    { label: 'Delivery Orders', to: '/logistics/deliveries', icon: Truck },
  ],
  admin: [
    { label: 'Dashboard', to: '/admin', icon: LayoutDashboard },
    { label: 'Analytics', to: '/admin/analytics', icon: BarChart2 },
    { label: 'Supply & Demand', to: '/admin/supply-demand', icon: TrendingUp },
    { label: 'Intermediary Impact', to: '/admin/impact', icon: Activity },
    { label: 'All Products', to: '/marketplace', icon: Store },
    { label: 'All Orders', to: '/admin/orders', icon: ClipboardList },
    { label: 'Users', to: '/admin/users', icon: Users },
  ],
};

const roleLabels = {
  farmer: { label: 'Farmer', color: 'bg-green-100 text-green-800' },
  consumer: { label: 'Consumer', color: 'bg-blue-100 text-blue-800' },
  bulk_buyer: { label: 'Bulk Buyer', color: 'bg-purple-100 text-purple-800' },
  logistics: { label: 'Logistics', color: 'bg-orange-100 text-orange-800' },
  admin: { label: 'Admin', color: 'bg-red-100 text-red-800' },
};

export default function Sidebar() {
  const { role, user, logout } = useApp();
  const navigate = useNavigate();
  const menuItems = roleMenus[role] || [];
  const roleInfo = roleLabels[role] || { label: role, color: 'bg-gray-100 text-gray-800' };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex flex-col h-full bg-white border-r border-agri-border w-64 fixed left-0 top-0 bottom-0 z-30">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 py-4 border-b border-agri-border">
        <div className="w-8 h-8 bg-forest-800 rounded-lg flex items-center justify-center flex-shrink-0">
          <Leaf size={15} className="text-white" />
        </div>
        <div>
          <div className="text-sm font-bold text-forest-800 leading-none">AgriNexus</div>
          <div className="text-[10px] text-agri-muted mt-0.5">Digital Marketplace</div>
        </div>
      </div>

      {/* User info */}
      <div className="px-4 py-3 border-b border-agri-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-forest-100 flex items-center justify-center flex-shrink-0">
            <span className="text-forest-800 text-sm font-bold capitalize">
              {(user?.name || role || 'U')[0].toUpperCase()}
            </span>
          </div>
          <div className="min-w-0">
            <div className="text-sm font-semibold text-gray-800 truncate">
              {user?.name || 'Demo User'}
            </div>
            <span className={`text-xs font-medium px-1.5 py-0.5 rounded-full ${roleInfo.color}`}>
              {roleInfo.label}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-0.5 scrollbar-thin">
        {menuItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/farmer' || item.to === '/buyer' || item.to === '/admin' || item.to === '/logistics'}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''}`
            }
          >
            <item.icon size={16} />
            <span>{item.label}</span>
          </NavLink>
        ))}

        <div className="pt-2 mt-2 border-t border-agri-border">
          <NavLink to="/marketplace" className="sidebar-link">
            <Store size={16} />
            <span>Browse Marketplace</span>
          </NavLink>
        </div>
      </nav>

      {/* Role switcher & logout */}
      <div className="border-t border-agri-border p-3 space-y-1">
        <NavLink to="/login" className="sidebar-link text-xs">
          <Settings size={14} />
          <span>Switch Role</span>
        </NavLink>
        <button onClick={handleLogout} className="sidebar-link w-full text-red-500 hover:bg-red-50 hover:text-red-600">
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}
