import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Package, Star, ShoppingCart, Clock } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { StatusBadge } from './UIComponents';

const PRODUCT_EMOJI = {
  Cereals: '🌾',
  Vegetables: '🥦',
  Fruits: '🍎',
  Pulses: '🫘',
  Oilseeds: '🌻',
};

const PRODUCT_BG = {
  Cereals: 'from-yellow-50 to-amber-50',
  Vegetables: 'from-green-50 to-emerald-50',
  Fruits: 'from-red-50 to-pink-50',
  Pulses: 'from-orange-50 to-amber-50',
  Oilseeds: 'from-yellow-50 to-lime-50',
};

export default function ProductCard({ product, onAddToCart }) {
  const { addToCart, role } = useApp();
  const emoji = PRODUCT_EMOJI[product.category] || '🌿';
  const bgClass = PRODUCT_BG[product.category] || 'from-green-50 to-teal-50';
  const canBuy = role === 'consumer' || role === 'bulk_buyer';

  const handleAddToCart = (e) => {
    e.preventDefault();
    const qty = role === 'bulk_buyer' ? 100 : product.minOrderQuantity || 10;
    addToCart(product, qty);
    if (onAddToCart) onAddToCart(product);
  };

  const isLowStock = product.availableQuantity < 100;

  return (
    <Link
      to={`/marketplace/${product._id}`}
      className="card-hover block group cursor-pointer overflow-hidden"
    >
      {/* Image area */}
      <div className={`-mx-6 -mt-6 mb-4 bg-gradient-to-br ${bgClass} h-36 flex items-center justify-center relative`}>
        <span className="text-6xl">{emoji}</span>
        <div className="absolute top-3 right-3">
          <StatusBadge status={product.quality} />
        </div>
        {isLowStock && (
          <div className="absolute top-3 left-3 badge bg-red-100 text-red-700">
            Low Stock
          </div>
        )}
      </div>

      {/* Content */}
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-semibold text-gray-900 group-hover:text-forest-700 transition-colors line-clamp-1">
              {product.name}
            </h3>
            <p className="text-xs text-agri-muted">
              {product.farmerType === 'FPO' ? '🏢' : '👨‍🌾'} {product.farmerName}
            </p>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="text-lg font-bold text-forest-800">₹{product.price}</div>
            <div className="text-xs text-agri-muted">per kg</div>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs text-agri-muted">
          <span className="flex items-center gap-1">
            <MapPin size={11} />
            {product.location}, {product.state}
          </span>
          <span className="flex items-center gap-1">
            <Package size={11} />
            {product.availableQuantity?.toLocaleString()} kg
          </span>
        </div>

        <div className="flex items-center justify-between pt-1">
          <span className="flex items-center gap-1 text-xs text-agri-muted">
            <Clock size={11} />
            Delivery in {product.deliveryDays || 3}–{(product.deliveryDays || 3) + 2} days
          </span>
          <span className="text-xs bg-forest-50 text-forest-700 px-2 py-0.5 rounded-full font-medium">
            {product.category}
          </span>
        </div>

        {canBuy && (
          <button
            onClick={handleAddToCart}
            className="btn-primary w-full justify-center mt-2 text-sm py-2"
          >
            <ShoppingCart size={14} />
            {role === 'bulk_buyer' ? 'Bulk Order' : 'Add to Cart'}
          </button>
        )}
      </div>
    </Link>
  );
}
