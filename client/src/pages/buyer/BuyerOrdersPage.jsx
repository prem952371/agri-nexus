import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getOrders } from '../../services/api';
import { useApp } from '../../context/AppContext';
import { StatusBadge, LoadingState, EmptyState } from '../../components/UIComponents';
import { Package, ChevronDown, ChevronUp } from 'lucide-react';

const DEMO_CONSUMER_ORDERS = [
  { orderId: 'ORD-20240820', buyerName: 'Priya Mehta', items: [{ productName: 'Tomatoes', quantity: 20, price: 22, subtotal: 440 }], totalAmount: 440, status: 'delivered', deliveryLocation: 'Lajpat Nagar, Delhi', createdAt: '2026-08-20T10:30:00Z' },
  { orderId: 'ORD-20240902', buyerName: 'Priya Mehta', items: [{ productName: 'Potatoes', quantity: 25, price: 14, subtotal: 350 }, { productName: 'Onions', quantity: 15, price: 18, subtotal: 270 }], totalAmount: 620, status: 'delivered', deliveryLocation: 'Lajpat Nagar, Delhi', createdAt: '2026-09-02T09:00:00Z' },
  { orderId: 'ORD-20240907', buyerName: 'Priya Mehta', items: [{ productName: 'Wheat', quantity: 50, price: 24, subtotal: 1200 }], totalAmount: 1200, status: 'in_transit', deliveryLocation: 'Lajpat Nagar, Delhi', createdAt: '2026-09-07T14:00:00Z' },
  { orderId: 'ORD-20240909', buyerName: 'Priya Mehta', items: [{ productName: 'Red Apples', quantity: 10, price: 95, subtotal: 950 }], totalAmount: 950, status: 'confirmed', deliveryLocation: 'Lajpat Nagar, Delhi', createdAt: '2026-09-09T00:30:00Z' },
];

const DEMO_BULK_ORDERS = [
  { orderId: 'ORD-20240815', buyerName: 'Vikram Traders', items: [{ productName: 'Wheat', quantity: 1000, price: 24, subtotal: 24000 }], totalAmount: 24000, status: 'delivered', deliveryLocation: 'Mumbai Warehouse, Maharashtra', createdAt: '2026-08-15T08:00:00Z' },
  { orderId: 'ORD-20240901', buyerName: 'Vikram Traders', items: [{ productName: 'Onions', quantity: 2000, price: 18, subtotal: 36000 }], totalAmount: 36000, status: 'delivered', deliveryLocation: 'Mumbai Warehouse, Maharashtra', createdAt: '2026-09-01T10:00:00Z' },
  { orderId: 'ORD-20240908', buyerName: 'Vikram Traders', items: [{ productName: 'Maize', quantity: 500, price: 19, subtotal: 9500 }], totalAmount: 9500, status: 'processing', deliveryLocation: 'Mumbai Warehouse, Maharashtra', createdAt: '2026-09-08T11:00:00Z' },
  { orderId: 'ORD-20240909', buyerName: 'Vikram Traders', items: [{ productName: 'Wheat', quantity: 2000, price: 24, subtotal: 48000 }], totalAmount: 48000, status: 'pending', deliveryLocation: 'Mumbai Warehouse, Maharashtra', createdAt: '2026-09-09T00:30:00Z' },
];

const STATUS_STEPS = ['pending', 'confirmed', 'processing', 'ready_for_pickup', 'in_transit', 'delivered'];

function OrderDetailExpanded({ order }) {
  const current = STATUS_STEPS.indexOf(order.status);
  return (
    <div className="mt-4 pt-4 border-t border-gray-100 space-y-4">
      {/* Timeline */}
      <div>
        <div className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">Order Progress</div>
        <div className="flex items-center gap-1">
          {STATUS_STEPS.map((s, i) => (
            <React.Fragment key={s}>
              <div className="flex flex-col items-center">
                <div className={`w-3 h-3 rounded-full ${i <= current ? 'bg-forest-600' : 'bg-gray-200'}`} />
                <span className="text-[9px] text-agri-muted mt-1 text-center w-12 leading-tight">{s.replace('_', ' ')}</span>
              </div>
              {i < STATUS_STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mb-4 ${i < current ? 'bg-forest-600' : 'bg-gray-200'}`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Items */}
      <div>
        <div className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">Items Ordered</div>
        <div className="space-y-2">
          {order.items.map((item, i) => (
            <div key={i} className="flex justify-between text-sm bg-gray-50 rounded-lg p-2">
              <span>{item.productName} — {item.quantity}kg × ₹{item.price}/kg</span>
              <span className="font-semibold">₹{item.subtotal?.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="text-xs text-agri-muted">📍 Delivery: {order.deliveryLocation}</div>
    </div>
  );
}

export default function BuyerOrdersPage() {
  const { role } = useApp();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getOrders({ buyerType: role });
        setOrders(res.data?.orders || res.data || (role === 'bulk_buyer' ? DEMO_BULK_ORDERS : DEMO_CONSUMER_ORDERS));
      } catch {
        setOrders(role === 'bulk_buyer' ? DEMO_BULK_ORDERS : DEMO_CONSUMER_ORDERS);
      } finally { setLoading(false); }
    };
    load();
  }, [role]);

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  if (loading) return <LoadingState />;

  return (
    <div>
      <div className="mb-6">
        <h1 className="section-title">My Orders</h1>
        <p className="section-subtitle">{orders.length} total orders placed</p>
      </div>

      <div className="flex gap-2 flex-wrap mb-6">
        {['all', 'pending', 'confirmed', 'in_transit', 'delivered'].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${filter === s ? 'bg-forest-800 text-white' : 'bg-white border border-agri-border text-gray-600 hover:border-forest-300'}`}>
            {s === 'all' ? 'All' : s.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}
            {s === 'all' && ` (${orders.length})`}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={Package} title="No orders" description="You haven't placed any orders yet." action={<Link to="/marketplace" className="btn-primary">Browse Marketplace</Link>} />
      ) : (
        <div className="space-y-4">
          {filtered.map(order => (
            <div key={order.orderId} className="card">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="font-bold text-forest-700">{order.orderId}</span>
                    <StatusBadge status={order.status} />
                  </div>
                  <div className="text-sm text-gray-600">
                    {order.items.map(i => `${i.productName} (${i.quantity}kg)`).join(' + ')}
                  </div>
                  <div className="text-xs text-agri-muted mt-1">
                    {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-xl font-bold text-forest-800">₹{order.totalAmount.toLocaleString()}</div>
                    {order.status === 'delivered' && (
                      <div className="text-xs text-green-600">✓ Delivered</div>
                    )}
                  </div>
                  <button onClick={() => setExpanded(expanded === order.orderId ? null : order.orderId)}
                    className="p-2 text-gray-400 hover:text-forest-600 hover:bg-gray-50 rounded-lg">
                    {expanded === order.orderId ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                </div>
              </div>
              {expanded === order.orderId && <OrderDetailExpanded order={order} />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
