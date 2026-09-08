import React, { useState, useEffect } from 'react';
import { getOrders } from '../../services/api';
import { StatusBadge, LoadingState, EmptyState } from '../../components/UIComponents';
import { Package } from 'lucide-react';

const DEMO_ORDERS = [
  { orderId: 'ORD-20240825', buyerName: 'Priya Mehta', buyerType: 'consumer', items: [{ productName: 'Wheat', quantity: 100 }], totalAmount: 2400, status: 'delivered', deliveryLocation: 'Lajpat Nagar, Delhi', createdAt: '2026-08-25' },
  { orderId: 'ORD-20240901', buyerName: 'Anil Kumar', buyerType: 'consumer', items: [{ productName: 'Maize', quantity: 200 }], totalAmount: 3800, status: 'delivered', deliveryLocation: 'Chennai', createdAt: '2026-09-01' },
  { orderId: 'ORD-20240905', buyerName: 'Vikram Traders Pvt Ltd', buyerType: 'bulk_buyer', items: [{ productName: 'Maize', quantity: 500 }], totalAmount: 9500, status: 'in_transit', deliveryLocation: 'Mumbai', createdAt: '2026-09-05' },
  { orderId: 'ORD-20240907', buyerName: 'Anil Kumar', buyerType: 'consumer', items: [{ productName: 'Wheat', quantity: 200 }], totalAmount: 4800, status: 'processing', deliveryLocation: 'Chennai', createdAt: '2026-09-07' },
  { orderId: 'ORD-20240908', buyerName: 'Rajesh Bansal', buyerType: 'bulk_buyer', items: [{ productName: 'Wheat', quantity: 1000 }], totalAmount: 24000, status: 'confirmed', deliveryLocation: 'Mumbai', createdAt: '2026-09-08' },
  { orderId: 'ORD-20240909', buyerName: 'Delhi Wholesale Market', buyerType: 'bulk_buyer', items: [{ productName: 'Maize', quantity: 2000 }], totalAmount: 38000, status: 'pending', deliveryLocation: 'Delhi', createdAt: '2026-09-09' },
];

const STATUS_STEPS = ['pending', 'confirmed', 'processing', 'ready_for_pickup', 'in_transit', 'delivered'];

function OrderTimeline({ status }) {
  const current = STATUS_STEPS.indexOf(status);
  return (
    <div className="flex items-center gap-1 mt-2">
      {STATUS_STEPS.map((s, i) => (
        <React.Fragment key={s}>
          <div className={`flex-shrink-0 w-2.5 h-2.5 rounded-full ${i <= current ? 'bg-forest-600' : 'bg-gray-200'}`} title={s.replace('_', ' ')} />
          {i < STATUS_STEPS.length - 1 && (
            <div className={`flex-1 h-0.5 ${i < current ? 'bg-forest-600' : 'bg-gray-200'}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

export default function FarmerOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getOrders({ role: 'farmer' });
        setOrders(res.data?.orders || res.data || DEMO_ORDERS);
      } catch { setOrders(DEMO_ORDERS); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  if (loading) return <LoadingState />;

  return (
    <div>
      <div className="mb-6">
        <h1 className="section-title">My Orders</h1>
        <p className="section-subtitle">Track orders placed for your produce</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap mb-6">
        {['all', 'pending', 'confirmed', 'processing', 'in_transit', 'delivered'].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${filter === s ? 'bg-forest-800 text-white' : 'bg-white border border-agri-border text-gray-600 hover:border-forest-300'}`}>
            {s === 'all' ? 'All Orders' : s.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={Package} title="No orders found" description="No orders match this filter." />
      ) : (
        <div className="space-y-4">
          {filtered.map(order => (
            <div key={order.orderId} className="card">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-bold text-forest-700">{order.orderId}</span>
                    <StatusBadge status={order.status} />
                    <span className="badge bg-gray-100 text-gray-600 text-xs capitalize">{order.buyerType?.replace('_', ' ')}</span>
                  </div>
                  <div className="text-sm text-gray-700 mb-1">
                    <strong>Buyer:</strong> {order.buyerName}
                  </div>
                  <div className="text-sm text-agri-muted mb-1">
                    📍 {order.deliveryLocation}
                  </div>
                  <div className="text-sm text-agri-muted">
                    📦 {order.items?.map(i => `${i.productName} (${i.quantity}kg)`).join(', ')}
                  </div>
                  <OrderTimeline status={order.status} />
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-forest-800">₹{order.totalAmount?.toLocaleString()}</div>
                  <div className="text-xs text-agri-muted">{new Date(order.createdAt).toLocaleDateString('en-IN')}</div>
                  {order.status === 'delivered' && (
                    <div className="text-xs text-green-600 font-medium mt-1">✓ Payment received</div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
