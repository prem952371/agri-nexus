import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Package, Plus, ShoppingBag, TrendingUp, DollarSign,
  Store, ShoppingCart, ClipboardList, MapPin, BarChart2, Users,
  Truck, Route, Activity, Leaf, LogOut, Settings, ChevronRight, CloudSun,
  IndianRupee, FileText, MessageCircle, Bell, UserRound, HelpCircle
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

const commonMenu = [
  { label: 'Weather', to: '/weather', icon: CloudSun },
  { label: 'Mandi Prices', to: '/market-prices', icon: IndianRupee },
  { label: 'Government Schemes', to: '/schemes', icon: FileText },
  { label: 'Community', to: '/community', icon: Users },
  { label: 'Messages', to: '/messages', icon: MessageCircle },
  { label: 'Notifications', to: '/notifications', icon: Bell },
  { label: 'My Profile', to: '/profile', icon: UserRound },
  { label: 'Help & Support', to: '/help', icon: HelpCircle },
  { label: 'Settings', to: '/settings', icon: Settings },
];

const allPagesMenu = [
  { label: 'Farmer Dashboard', to: '/farmer', icon: LayoutDashboard },
  { label: 'Marketplace', to: '/marketplace', icon: Store },
  { label: 'Cart', to: '/cart', icon: ShoppingCart },
  { label: 'Buyer Orders', to: '/buyer/orders', icon: ClipboardList },
  { label: 'Add Produce', to: '/farmer/add-produce', icon: Plus },
  { label: 'My Produce', to: '/farmer/produce', icon: Package },
  { label: 'Demand Forecast', to: '/farmer/forecast', icon: TrendingUp },
  { label: 'Earnings', to: '/farmer/earnings', icon: DollarSign },
  { label: 'Route Optimization', to: '/logistics/routes', icon: Route },
  { label: 'Delivery Orders', to: '/logistics/deliveries', icon: Truck },
  { label: 'Admin Dashboard', to: '/admin', icon: BarChart2 },
  { label: 'Supply & Demand', to: '/admin/supply-demand', icon: TrendingUp },
  { label: 'Impact Dashboard', to: '/admin/impact', icon: Activity },
];

const roleLabels = {
  farmer: { label: 'Farmer', color: 'bg-green-100 text-green-800' },
  consumer: { label: 'Consumer', color: 'bg-blue-100 text-blue-800' },
  bulk_buyer: { label: 'Bulk Buyer', color: 'bg-purple-100 text-purple-800' },
  logistics: { label: 'Logistics', color: 'bg-orange-100 text-orange-800' },
  admin: { label: 'Admin', color: 'bg-red-100 text-red-800' },
};

export default function Sidebar() {
  const { role, user, logout, t, language, setLanguage } = useApp();
  const navigate = useNavigate();
  const menuItems = [...(roleMenus[role] || allPagesMenu), ...commonMenu];
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
          <div className="text-sm font-bold text-forest-800 leading-none">KrishiSetu</div>
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
              {user?.name || 'Prototype Visitor'}
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
            <span>{t(item.label)}</span>
          </NavLink>
        ))}

        <div className="pt-2 mt-2 border-t border-agri-border">
          <NavLink to="/marketplace" className="sidebar-link">
            <Store size={16} />
            <span>{t('Marketplace')}</span>
          </NavLink>
        </div>
      </nav>

      {/* Role switcher & logout */}
      <div className="border-t border-agri-border p-3 space-y-1">
        <label className="flex items-center justify-between gap-2 px-3 py-2 text-xs text-gray-500">
          <span>{t('Language')}</span>
          <select aria-label="Language" value={language} onChange={e => setLanguage(e.target.value)} className="select text-xs py-1 px-2 w-auto">
            <option>English</option>
            <option>Hindi</option>
          </select>
        </label>
        <NavLink to="/login" className="sidebar-link text-xs">
          <Settings size={14} />
          <span>{t('Settings')}</span>
        </NavLink>
        <button onClick={handleLogout} className="sidebar-link w-full text-red-500 hover:bg-red-50 hover:text-red-600">
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}
