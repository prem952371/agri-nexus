import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingCart, ArrowRight, MapPin, Package } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { createOrder } from '../services/api';
import { EmptyState } from '../components/UIComponents';
import { Link } from 'react-router-dom';

const PRODUCT_EMOJI = { Cereals: '🌾', Vegetables: '🥦', Fruits: '🍎', Pulses: '🫘', Oilseeds: '🌻' };

export default function CartPage() {
  const { cart, updateCartQty, removeFromCart, clearCart, cartTotal, role, user, addToast } = useApp();
  const navigate = useNavigate();
  const [deliveryLocation, setDeliveryLocation] = useState(user?.location || '');
  const [deliveryState, setDeliveryState] = useState('Delhi');
  const [notes, setNotes] = useState('');
  const [placing, setPlacing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(null);

  const handlePlaceOrder = async () => {
    if (!deliveryLocation.trim()) {
      addToast('Please enter delivery location', 'error');
      return;
    }
    try {
      setPlacing(true);
      const orderData = {
        buyerName: user?.name || (role === 'bulk_buyer' ? 'Vikram Traders Pvt Ltd' : 'Priya Mehta'),
        buyerType: role,
        deliveryLocation,
        deliveryState,
        notes,
        items: cart.map(item => ({
          product: item.product._id,
          productName: item.product.name,
          farmerName: item.product.farmerName,
          quantity: item.quantity,
          price: item.product.price,
          subtotal: item.product.price * item.quantity,
        })),
        totalAmount: cartTotal,
      };
      const res = await createOrder(orderData);
      const order = res.data;
      setOrderPlaced(order);
      clearCart();
      addToast('Order placed successfully! 🎉', 'success');
    } catch (err) {
      // Demo fallback
      const demoOrder = {
        orderId: `ORD-${Date.now()}`,
        totalAmount: cartTotal,
        status: 'confirmed',
        estimatedDelivery: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN'),
      };
      setOrderPlaced(demoOrder);
      clearCart();
      addToast('Order placed successfully! 🎉', 'success');
    } finally {
      setPlacing(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-agri-light py-12">
        <div className="page-container">
          <div className="max-w-lg mx-auto card text-center py-12">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-forest-800 mb-2">Order Confirmed!</h2>
            <p className="text-agri-muted mb-6">
              Your order has been placed successfully and is being processed.
            </p>
            <div className="bg-forest-50 rounded-xl p-4 mb-6 text-left space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-agri-muted">Order ID</span>
                <span className="font-bold text-forest-800">{orderPlaced.orderId}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-agri-muted">Total Amount</span>
                <span className="font-bold text-forest-800">₹{orderPlaced.totalAmount?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-agri-muted">Status</span>
                <span className="font-bold text-green-600 capitalize">{orderPlaced.status}</span>
              </div>
              {orderPlaced.estimatedDelivery && (
                <div className="flex justify-between text-sm">
                  <span className="text-agri-muted">Est. Delivery</span>
                  <span className="font-bold text-forest-800">{orderPlaced.estimatedDelivery}</span>
                </div>
              )}
            </div>
            <div className="flex gap-3">
              <button onClick={() => navigate('/buyer/orders')} className="btn-secondary flex-1 justify-center">
                View My Orders
              </button>
              <Link to="/marketplace" className="btn-primary flex-1 justify-center">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-agri-light py-12">
        <div className="page-container">
          <EmptyState
            icon={ShoppingCart}
            title="Your cart is empty"
            description="Browse the marketplace and add produce from farmers to your cart."
            action={
              <Link to="/marketplace" className="btn-primary">
                Browse Marketplace
              </Link>
            }
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-agri-light py-8">
      <div className="page-container">
        <h1 className="text-2xl font-bold text-forest-800 mb-6">
          Shopping Cart ({cart.length} item{cart.length !== 1 ? 's' : ''})
        </h1>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Cart items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map(({ product, quantity }) => (
              <div key={product._id} className="card flex gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl flex items-center justify-center text-3xl flex-shrink-0">
                  {PRODUCT_EMOJI[product.category] || '🌿'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-gray-900">{product.name}</h3>
                      <p className="text-xs text-agri-muted">
                        👨‍🌾 {product.farmerName} · 📍 {product.location}, {product.state}
                      </p>
                    </div>
                    <button
                      onClick={() => removeFromCart(product._id)}
                      className="text-red-400 hover:text-red-600 p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateCartQty(product._id, quantity - 10)}
                        className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-14 text-center font-bold text-sm">{quantity} kg</span>
                      <button
                        onClick={() => updateCartQty(product._id, quantity + 10)}
                        className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-agri-muted">₹{product.price}/kg</div>
                      <div className="font-bold text-forest-800">₹{(product.price * quantity).toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <button onClick={clearCart} className="text-sm text-red-500 hover:text-red-600 font-medium">
              Clear all items
            </button>
          </div>

          {/* Order summary */}
          <div className="space-y-4">
            <div className="card">
              <h3 className="font-bold text-forest-800 mb-4">Delivery Details</h3>
              <div className="space-y-3">
                <div>
                  <label className="label">Delivery Address *</label>
                  <input
                    type="text"
                    value={deliveryLocation}
                    onChange={e => setDeliveryLocation(e.target.value)}
                    placeholder="Enter full delivery address"
                    className="input"
                  />
                </div>
                <div>
                  <label className="label">State</label>
                  <select value={deliveryState} onChange={e => setDeliveryState(e.target.value)} className="select">
                    {['Delhi', 'Mumbai', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow'].map(s => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label">Notes (optional)</label>
                  <textarea
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    placeholder="Any special instructions..."
                    className="input resize-none h-20"
                  />
                </div>
              </div>
            </div>

            <div className="card">
              <h3 className="font-bold text-forest-800 mb-4">Order Summary</h3>
              <div className="space-y-2 mb-4">
                {cart.map(({ product, quantity }) => (
                  <div key={product._id} className="flex justify-between text-sm">
                    <span className="text-gray-600 truncate mr-2">{product.name} ({quantity}kg)</span>
                    <span className="font-medium flex-shrink-0">₹{(product.price * quantity).toLocaleString()}</span>
                  </div>
                ))}
                <div className="border-t border-gray-100 pt-2 mt-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span>₹{cartTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Delivery</span>
                    <span className="text-green-600 font-medium">Calculated at delivery</span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-forest-800 mt-2 pt-2 border-t border-gray-100">
                    <span>Total</span>
                    <span>₹{cartTotal.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {role === 'bulk_buyer' && (
                <div className="bg-purple-50 rounded-xl p-3 mb-4 text-xs text-purple-700">
                  <strong>Bulk Order Savings Estimate</strong><br />
                  Traditional supply chain cost: ~₹{Math.floor(cartTotal * 1.18).toLocaleString()}<br />
                  Estimated savings: ~₹{Math.floor(cartTotal * 0.18).toLocaleString()} (illustrative)
                </div>
              )}

              <div className="text-xs text-agri-muted mb-4 p-2 bg-amber-50 rounded-lg">
                🔒 Demo payment — No real transaction will occur
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={placing}
                className="btn-primary w-full justify-center"
              >
                {placing ? 'Placing Order...' : 'Place Order'}
                {!placing && <ArrowRight size={16} />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
