import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Package, DollarSign, ShoppingBag, Eye, Plus, AlertCircle, ArrowUpRight } from 'lucide-react';
import { getProducts, getOrders, getUserStats } from '../services/api';
import { useApp } from '../context/AppContext';
import { StatCard, StatusBadge, LoadingState, EmptyState } from '../components/UIComponents';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const DEMO_STATS = {
  totalSales: 142500, activeOrders: 8, availableProduce: 5, estimatedEarnings: 38200,
  recentOrders: [
    { orderId: 'ORD-20240901', buyerName: 'Priya Mehta', items: [{ productName: 'Wheat', quantity: 100 }], totalAmount: 2400, status: 'delivered', createdAt: '2026-09-01' },
    { orderId: 'ORD-20240905', buyerName: 'Vikram Traders', items: [{ productName: 'Maize', quantity: 500 }], totalAmount: 9500, status: 'in_transit', createdAt: '2026-09-05' },
    { orderId: 'ORD-20240907', buyerName: 'Anil Kumar', items: [{ productName: 'Wheat', quantity: 200 }], totalAmount: 4800, status: 'processing', createdAt: '2026-09-07' },
    { orderId: 'ORD-20240908', buyerName: 'Rajesh Bansal', items: [{ productName: 'Maize', quantity: 1000 }], totalAmount: 19000, status: 'confirmed', createdAt: '2026-09-08' },
  ],
  earnings: [
    { month: 'Apr', earnings: 18000 }, { month: 'May', earnings: 22000 }, { month: 'Jun', earnings: 19500 },
    { month: 'Jul', earnings: 28000 }, { month: 'Aug', earnings: 31500 }, { month: 'Sep', earnings: 38200 },
  ],
  forecasts: [
    { product: 'Tomatoes', location: 'Delhi NCR', trend: 'increasing', recommendation: 'Tomato demand in Delhi NCR is expected to increase 18% over next 7 days. Consider listing additional stock.' },
    { product: 'Wheat', location: 'Punjab', trend: 'stable', recommendation: 'Wheat demand remains stable. Maintain current supply levels.' },
  ],
};

export default function FarmerDashboard() {
  const { user } = useApp();
  const [stats, setStats] = useState(DEMO_STATS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Try to load real data, fall back to demo
    const load = async () => {
      try {
        setLoading(true);
        // Could fetch real farmer stats here
      } catch { /* use demo */ } finally { setLoading(false); }
    };
    load();
  }, []);

  if (loading) return <LoadingState />;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-forest-800">
            Welcome back, {user?.name || 'Ramesh Kumar'} 👋
          </h1>
          <p className="text-sm text-agri-muted mt-1">
            📍 {user?.location || 'Karnal, Haryana'} · Farmer Dashboard
          </p>
        </div>
        <Link to="/farmer/add-produce" className="btn-primary">
          <Plus size={16} />
          Add Produce
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <StatCard icon={DollarSign} label="Total Sales (Lifetime)" value={`₹${stats.totalSales.toLocaleString()}`} color="green" trend={12} />
        <StatCard icon={ShoppingBag} label="Active Orders" value={stats.activeOrders} color="blue" subtext="3 need attention" />
        <StatCard icon={Package} label="Products Listed" value={stats.availableProduce} color="orange" subtext="All active" />
        <StatCard icon={TrendingUp} label="This Month Earnings" value={`₹${stats.estimatedEarnings.toLocaleString()}`} color="purple" trend={8} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Earnings Chart */}
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-forest-800">Monthly Earnings</h3>
              <p className="text-xs text-agri-muted">Last 6 months</p>
            </div>
            <Link to="/farmer/earnings" className="text-xs text-forest-600 font-medium hover:underline flex items-center gap-1">
              View Details <ArrowUpRight size={12} />
            </Link>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={stats.earnings}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
              <Tooltip formatter={v => [`₹${v.toLocaleString()}`, 'Earnings']} />
              <Bar dataKey="earnings" fill="#1e4428" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* AI Demand Forecast */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-forest-800">AI Demand Insights</h3>
              <p className="text-xs text-agri-muted">For your crops</p>
            </div>
            <Link to="/farmer/forecast" className="text-xs text-forest-600 font-medium hover:underline">
              Full Forecast
            </Link>
          </div>
          <div className="space-y-3">
            {stats.forecasts.map((f, i) => (
              <div key={i} className={`p-3 rounded-xl border ${f.trend === 'increasing' ? 'bg-green-50 border-green-200' : 'bg-blue-50 border-blue-200'}`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold">{f.product}</span>
                  <span className={`badge ${f.trend === 'increasing' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                    {f.trend === 'increasing' ? '↑ Rising' : '→ Stable'}
                  </span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">{f.recommendation}</p>
              </div>
            ))}
            <Link to="/farmer/forecast" className="btn-secondary w-full justify-center text-sm">
              <TrendingUp size={14} />
              View Full Forecast
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="card mt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-forest-800">Recent Orders</h3>
          <Link to="/farmer/orders" className="text-xs text-forest-600 font-medium hover:underline">
            View All
          </Link>
        </div>
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Buyer</th>
                <th>Products</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentOrders.map(order => (
                <tr key={order.orderId}>
                  <td className="font-medium text-forest-700">{order.orderId}</td>
                  <td>{order.buyerName}</td>
                  <td className="text-agri-muted">{order.items?.[0]?.productName} {order.items?.[0]?.quantity ? `(${order.items[0].quantity}kg)` : ''}</td>
                  <td className="font-semibold">₹{order.totalAmount?.toLocaleString()}</td>
                  <td><StatusBadge status={order.status} /></td>
                  <td className="text-agri-muted">{new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
