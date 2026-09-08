import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Package, TrendingUp, DollarSign, ArrowRight, ShoppingCart } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatCard, StatusBadge } from '../../components/UIComponents';

const DEMO_ORDERS = [
  { orderId: 'ORD-20240820', items: [{ productName: 'Tomatoes', quantity: 20 }], totalAmount: 440, status: 'delivered', createdAt: '2026-08-20', deliveryLocation: 'Lajpat Nagar, Delhi' },
  { orderId: 'ORD-20240902', items: [{ productName: 'Potatoes', quantity: 25 }, { productName: 'Onions', quantity: 15 }], totalAmount: 620, status: 'delivered', createdAt: '2026-09-02', deliveryLocation: 'Lajpat Nagar, Delhi' },
  { orderId: 'ORD-20240907', items: [{ productName: 'Wheat', quantity: 50 }], totalAmount: 1200, status: 'in_transit', createdAt: '2026-09-07', deliveryLocation: 'Lajpat Nagar, Delhi' },
];

const BULK_ORDERS = [
  { orderId: 'ORD-20240815', items: [{ productName: 'Wheat', quantity: 1000 }], totalAmount: 24000, status: 'delivered', createdAt: '2026-08-15', deliveryLocation: 'Mumbai Warehouse' },
  { orderId: 'ORD-20240901', items: [{ productName: 'Onions', quantity: 2000 }], totalAmount: 36000, status: 'delivered', createdAt: '2026-09-01', deliveryLocation: 'Mumbai Warehouse' },
  { orderId: 'ORD-20240908', items: [{ productName: 'Maize', quantity: 500 }], totalAmount: 9500, status: 'processing', createdAt: '2026-09-08', deliveryLocation: 'Mumbai Warehouse' },
];

const FEATURED = [
  { _id: '3', name: 'Tomatoes', category: 'Vegetables', farmerName: 'Lakshmi Devi', location: 'Nashik', state: 'Maharashtra', price: 22, availableQuantity: 800, quality: 'A' },
  { _id: '1', name: 'Wheat', category: 'Cereals', farmerName: 'Ramesh Kumar', location: 'Karnal', state: 'Haryana', price: 24, availableQuantity: 1850, quality: 'A' },
  { _id: '7', name: 'Red Apples', category: 'Fruits', farmerName: 'Harpreet Kaur', location: 'Amritsar', state: 'Punjab', price: 95, availableQuantity: 600, quality: 'A' },
];

const EMOJI = { Cereals: '🌾', Vegetables: '🥦', Fruits: '🍎', Pulses: '🫘', Oilseeds: '🌻' };

export default function BuyerDashboard() {
  const { role, user, addToCart, cartCount } = useApp();
  const isBulk = role === 'bulk_buyer';
  const orders = isBulk ? BULK_ORDERS : DEMO_ORDERS;
  const totalSpent = orders.filter(o => o.status === 'delivered').reduce((s, o) => s + o.totalAmount, 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-forest-800">
            Welcome, {user?.name || (isBulk ? 'Vikram Traders' : 'Priya Mehta')} 👋
          </h1>
          <p className="text-sm text-agri-muted mt-1">
            {isBulk ? '🏢 Bulk Buyer Dashboard' : '🛍️ Consumer Dashboard'} · {user?.location || (isBulk ? 'Mumbai' : 'Delhi')}
          </p>
        </div>
        <Link to="/marketplace" className="btn-primary">
          <ShoppingBag size={16} />
          Browse Market
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <StatCard icon={ShoppingBag} label="Total Orders" value={orders.length} color="blue" />
        <StatCard icon={DollarSign} label="Total Spent" value={`₹${totalSpent.toLocaleString()}`} color="green" />
        <StatCard icon={Package} label="Active Orders" value={orders.filter(o => !['delivered', 'cancelled'].includes(o.status)).length} color="orange" />
        <StatCard icon={ShoppingCart} label="Cart Items" value={cartCount} color="purple" subtext="Items in cart" />
      </div>

      {isBulk && (
        <div className="card mb-6 bg-purple-50 border-purple-200">
          <h3 className="font-bold text-purple-800 mb-3">💰 Bulk Order Savings (Illustrative)</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-xl font-bold text-purple-700">₹{Math.floor(totalSpent * 0.18).toLocaleString()}</div>
              <div className="text-xs text-purple-600">Estimated Savings vs Traditional</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-purple-700">18%</div>
              <div className="text-xs text-purple-600">Average Price Reduction</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-purple-700">0</div>
              <div className="text-xs text-purple-600">Intermediaries Involved</div>
            </div>
          </div>
          <p className="text-xs text-purple-500 mt-2">*Illustrative comparison. Actual savings may vary.</p>
        </div>
      )}

      {/* Featured products */}
      <div className="card mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-forest-800">Featured Products</h3>
          <Link to="/marketplace" className="text-xs text-forest-600 font-medium hover:underline flex items-center gap-1">
            View All <ArrowRight size={12} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {FEATURED.map(p => (
            <div key={p._id} className="flex items-center gap-3 p-3 border border-agri-border rounded-xl hover:border-forest-300 transition-colors">
              <div className="text-3xl">{EMOJI[p.category]}</div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm">{p.name}</div>
                <div className="text-xs text-agri-muted">₹{p.price}/kg · {p.location}</div>
              </div>
              <button
                onClick={() => addToCart(p, isBulk ? 100 : 10)}
                className="text-xs px-2 py-1 bg-forest-800 text-white rounded-lg hover:bg-forest-900"
              >
                {isBulk ? 'Bulk' : 'Add'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Recent orders */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-forest-800">Recent Orders</h3>
          <Link to="/buyer/orders" className="text-xs text-forest-600 font-medium hover:underline">View All</Link>
        </div>
        <div className="space-y-3">
          {orders.slice(0, 4).map(order => (
            <div key={order.orderId} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div>
                <div className="text-sm font-medium text-forest-700">{order.orderId}</div>
                <div className="text-xs text-agri-muted">
                  {order.items.map(i => `${i.productName} (${i.quantity}kg)`).join(', ')}
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-sm">₹{order.totalAmount.toLocaleString()}</div>
                <StatusBadge status={order.status} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
