import React from 'react';

export function StatCard({ icon: Icon, label, value, subtext, color = 'green', trend }) {
  const colorMap = {
    green: 'bg-green-100 text-green-700',
    blue: 'bg-blue-100 text-blue-700',
    purple: 'bg-purple-100 text-purple-700',
    orange: 'bg-orange-100 text-orange-700',
    red: 'bg-red-100 text-red-700',
    teal: 'bg-teal-100 text-teal-700',
    indigo: 'bg-indigo-100 text-indigo-700',
    yellow: 'bg-yellow-100 text-yellow-700',
  };

  return (
    <div className="stat-card">
      <div className={`stat-icon ${colorMap[color] || colorMap.green}`}>
        {Icon && <Icon size={22} />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="stat-label">{label}</div>
        <div className="stat-value mt-0.5">{value}</div>
        {subtext && (
          <div className="text-xs text-gray-400 mt-1">{subtext}</div>
        )}
        {trend && (
          <div className={`text-xs font-medium mt-1 ${trend > 0 ? 'text-green-600' : 'text-red-500'}`}>
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% vs last month
          </div>
        )}
      </div>
    </div>
  );
}

export function StatusBadge({ status }) {
  const statusConfig = {
    pending: { label: 'Pending', cls: 'bg-yellow-100 text-yellow-800' },
    confirmed: { label: 'Confirmed', cls: 'bg-blue-100 text-blue-800' },
    processing: { label: 'Processing', cls: 'bg-purple-100 text-purple-800' },
    ready_for_pickup: { label: 'Ready for Pickup', cls: 'bg-indigo-100 text-indigo-800' },
    in_transit: { label: 'In Transit', cls: 'bg-orange-100 text-orange-800' },
    delivered: { label: 'Delivered', cls: 'bg-green-100 text-green-800' },
    cancelled: { label: 'Cancelled', cls: 'bg-red-100 text-red-800' },
    scheduled: { label: 'Scheduled', cls: 'bg-sky-100 text-sky-800' },
    active: { label: 'Active', cls: 'bg-green-100 text-green-800' },
    inactive: { label: 'Inactive', cls: 'bg-gray-100 text-gray-600' },
    A: { label: 'Grade A', cls: 'bg-emerald-100 text-emerald-800' },
    B: { label: 'Grade B', cls: 'bg-blue-100 text-blue-800' },
    C: { label: 'Grade C', cls: 'bg-gray-100 text-gray-700' },
  };

  const config = statusConfig[status] || { label: status, cls: 'bg-gray-100 text-gray-700' };

  return (
    <span className={`badge ${config.cls}`}>
      {config.label}
    </span>
  );
}

export function LoadingState({ message = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-agri-muted">
      <div className="w-10 h-10 border-3 border-forest-200 border-t-forest-700 rounded-full animate-spin mb-4" 
           style={{ borderWidth: '3px' }} />
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
}

export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center px-4">
      {Icon && (
        <div className="w-16 h-16 bg-forest-50 rounded-2xl flex items-center justify-center mb-4">
          <Icon size={28} className="text-forest-400" />
        </div>
      )}
      <h3 className="text-base font-semibold text-gray-700 mb-2">{title}</h3>
      {description && <p className="text-sm text-agri-muted max-w-xs mb-6">{description}</p>}
      {action}
    </div>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center px-4">
      <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-4">
        <span className="text-3xl">⚠️</span>
      </div>
      <h3 className="text-base font-semibold text-gray-700 mb-2">Something went wrong</h3>
      <p className="text-sm text-agri-muted max-w-xs mb-6">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-primary">
          Try Again
        </button>
      )}
    </div>
  );
}

export function SearchBar({ value, onChange, placeholder = 'Search...', className = '' }) {
  return (
    <div className={`relative ${className}`}>
      <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
      </svg>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="input pl-9"
      />
    </div>
  );
}

export function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  if (!isOpen) return null;
  
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative bg-white rounded-2xl shadow-2xl w-full ${sizeClasses[size]} max-h-[90vh] overflow-y-auto`}>
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-forest-800">{title}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

export function ChartCard({ title, subtitle, children, className = '' }) {
  return (
    <div className={`card ${className}`}>
      <div className="mb-4">
        <h3 className="text-base font-semibold text-forest-800">{title}</h3>
        {subtitle && <p className="text-xs text-agri-muted mt-0.5">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}
