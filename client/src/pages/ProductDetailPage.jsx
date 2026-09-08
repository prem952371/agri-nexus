import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MapPin, Package, Calendar, Clock, Star, ArrowLeft, ShoppingCart, Minus, Plus, Truck, Shield, User } from 'lucide-react';
import { getProduct } from '../services/api';
import { useApp } from '../context/AppContext';
import { StatusBadge, LoadingState, ErrorState } from '../components/UIComponents';

const DEMO_PRODUCT = {
  _id: '1', name: 'Wheat', category: 'Cereals', farmerName: 'Ramesh Kumar', farmerType: 'Individual',
  location: 'Karnal', state: 'Haryana', availableQuantity: 2000, price: 24, quality: 'A',
  deliveryDays: 3, minOrderQuantity: 50, description: 'Premium grade wheat from the fertile fields of Haryana. Grown using sustainable farming practices with minimal pesticide use. Suitable for flour mills, wholesale buyers, and bulk consumers.',
  harvestDate: '2026-08-15',
};

const PRODUCT_EMOJI = { Cereals: '🌾', Vegetables: '🥦', Fruits: '🍎', Pulses: '🫘', Oilseeds: '🌻' };

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, role } = useApp();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(10);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        const res = await getProduct(id);
        // Backend returns { success, data: {...} }
        const p = res.data?.data || res.data;
        setProduct(p);
        setQuantity(p.minOrderQuantity || 10);
      } catch {
        setProduct({ ...DEMO_PRODUCT, _id: id });
        setQuantity(50);
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/cart');
  };

  const canBuy = role === 'consumer' || role === 'bulk_buyer';
  const emoji = product ? (PRODUCT_EMOJI[product.category] || '🌿') : '';

  if (loading) return <div className="py-20"><LoadingState /></div>;
  if (!product) return <div className="py-20"><ErrorState message="Product not found" /></div>;

  return (
    <div className="min-h-screen bg-agri-light py-8">
      <div className="page-container">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-agri-muted mb-6">
          <Link to="/marketplace" className="hover:text-forest-700 flex items-center gap-1">
            <ArrowLeft size={14} /> Marketplace
          </Link>
          <span>/</span>
          <span className="text-gray-700">{product.name}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Product visual */}
          <div>
            <div className="card text-center py-16 bg-gradient-to-br from-green-50 to-emerald-50">
              <div className="text-[100px] leading-none mb-4">{emoji}</div>
              <StatusBadge status={product.quality} />
            </div>
          </div>

          {/* Product details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs bg-forest-100 text-forest-700 px-2 py-0.5 rounded-full font-medium">{product.category}</span>
                <StatusBadge status={product.quality} />
              </div>
              <h1 className="text-3xl font-bold text-forest-800 mb-2">{product.name}</h1>
              
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-4xl font-bold text-forest-700">₹{product.price}</span>
                <span className="text-agri-muted">per kg</span>
              </div>

              <p className="text-gray-600 leading-relaxed">
                {product.description || `Premium quality ${product.name} directly from verified farmer in ${product.location}, ${product.state}. Harvested fresh and ready for delivery.`}
              </p>
            </div>

            {/* Key info */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: User, label: 'Farmer', value: `${product.farmerName} (${product.farmerType})` },
                { icon: MapPin, label: 'Location', value: `${product.location}, ${product.state}` },
                { icon: Package, label: 'Available Stock', value: `${product.availableQuantity?.toLocaleString()} kg` },
                { icon: Clock, label: 'Delivery Time', value: `${product.deliveryDays}–${product.deliveryDays + 2} days` },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                  <item.icon size={16} className="text-forest-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-xs text-agri-muted">{item.label}</div>
                    <div className="text-sm font-semibold text-gray-800">{item.value}</div>
                  </div>
                </div>
              ))}
            </div>

            {canBuy && (
              <>
                {/* Quantity selector */}
                <div className="card">
                  <label className="label">Order Quantity (kg)</label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setQuantity(q => Math.max(product.minOrderQuantity || 1, q - 10))}
                      className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-gray-50 active:bg-gray-100"
                    >
                      <Minus size={16} />
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="input text-center w-24 text-lg font-bold"
                      min={product.minOrderQuantity || 1}
                    />
                    <button
                      onClick={() => setQuantity(q => Math.min(product.availableQuantity, q + 10))}
                      className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-gray-50 active:bg-gray-100"
                    >
                      <Plus size={16} />
                    </button>
                    <div className="ml-2 text-agri-muted text-sm">
                      Min: {product.minOrderQuantity || 1}kg
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-forest-50 rounded-xl flex items-center justify-between">
                    <span className="text-sm font-medium text-forest-700">Total Amount</span>
                    <span className="text-xl font-bold text-forest-800">
                      ₹{(product.price * quantity).toLocaleString()}
                    </span>
                  </div>

                  {role === 'bulk_buyer' && (
                    <div className="mt-2 p-2 bg-purple-50 rounded-lg text-xs text-purple-700">
                      💡 Bulk order estimate. Actual savings vs traditional supply chain: <strong>~₹{Math.floor(product.price * quantity * 0.15).toLocaleString()}</strong>
                    </div>
                  )}
                </div>

                <div className="flex gap-3">
                  <button onClick={handleAddToCart} className="btn-secondary flex-1 justify-center">
                    <ShoppingCart size={16} />
                    Add to Cart
                  </button>
                  <button onClick={handleBuyNow} className="btn-primary flex-1 justify-center">
                    Buy Now
                  </button>
                </div>
              </>
            )}

            {!canBuy && !role && (
              <div className="card bg-forest-50 border border-forest-200 text-center">
                <p className="text-sm text-forest-700 mb-3">Login to place an order</p>
                <Link to="/login" className="btn-primary justify-center">
                  Login to Order
                </Link>
              </div>
            )}

            {/* Trust badges */}
            <div className="flex gap-4 text-xs text-agri-muted">
              <span className="flex items-center gap-1.5">
                <Shield size={13} className="text-green-500" />
                Verified Farmer
              </span>
              <span className="flex items-center gap-1.5">
                <Truck size={13} className="text-blue-500" />
                Tracked Delivery
              </span>
              <span className="flex items-center gap-1.5">
                <Star size={13} className="text-yellow-500" />
                Quality Graded
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
