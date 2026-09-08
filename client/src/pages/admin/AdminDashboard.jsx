import React, { useState, useEffect } from 'react';
import { Users, Package, ShoppingBag, DollarSign, Truck, TrendingUp, BarChart2 } from 'lucide-react';
import { getAnalyticsOverview } from '../../services/api';
import { StatCard, ChartCard, LoadingState } from '../../components/UIComponents';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const DEMO_OVERVIEW = {
  totalFarmers: 12400, totalFPOs: 342, totalBuyers: 48200, totalProducts: 2840,
  activeProducts: 1920, totalOrders: 48562, totalTransactionValue: 284500000, activeDeliveries: 28,
  monthlyOrders: [
    { month: 'Apr', orders: 6200, revenue: 38000000 },
    { month: 'May', orders: 7100, revenue: 44000000 },
    { month: 'Jun', orders: 6800, revenue: 42000000 },
    { month: 'Jul', orders: 8400, revenue: 52000000 },
    { month: 'Aug', orders: 9200, revenue: 58000000 },
    { month: 'Sep', orders: 10862, revenue: 67000000 },
  ],
  categoryBreakdown: [
    { name: 'Cereals', value: 38, color: '#1e4428' },
    { name: 'Vegetables', value: 29, color: '#16a34a' },
    { name: 'Pulses', value: 16, color: '#4ade80' },
    { name: 'Fruits', value: 11, color: '#bbf7d0' },
    { name: 'Oilseeds', value: 6, color: '#86efac' },
  ],
  stateDistribution: [
    { state: 'Haryana', farmers: 2800, orders: 11200 },
    { state: 'Punjab', farmers: 2400, orders: 9600 },
    { state: 'UP', farmers: 2100, orders: 8400 },
    { state: 'Maharashtra', farmers: 1900, orders: 7600 },
    { state: 'Gujarat', farmers: 1200, orders: 4800 },
    { state: 'Rajasthan', farmers: 900, orders: 3600 },
  ],
};

export default function AdminDashboard() {
  const [data, setData] = useState(DEMO_OVERVIEW);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getAnalyticsOverview().then(r => setData(r.data)).catch(() => setData(DEMO_OVERVIEW));
  }, []);

  if (loading) return <LoadingState />;
  const d = data || DEMO_OVERVIEW;

  return (
    <div>
      <div className="mb-6">
        <h1 className="section-title">Admin Dashboard</h1>
        <p className="section-subtitle">Platform-wide analytics and management overview</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Users} label="Farmers Registered" value={d.totalFarmers?.toLocaleString()} color="green" />
        <StatCard icon={Users} label="FPOs Onboarded" value={d.totalFPOs?.toLocaleString()} color="teal" />
        <StatCard icon={Users} label="Registered Buyers" value={d.totalBuyers?.toLocaleString()} color="blue" />
        <StatCard icon={Package} label="Active Products" value={d.activeProducts?.toLocaleString()} color="orange" />
        <StatCard icon={ShoppingBag} label="Total Orders" value={d.totalOrders?.toLocaleString()} color="purple" />
        <StatCard icon={DollarSign} label="Transaction Value" value={`₹${((d.totalTransactionValue || 0) / 10000000).toFixed(1)}Cr`} color="green" />
        <StatCard icon={Truck} label="Active Deliveries" value={d.activeDeliveries} color="orange" />
        <StatCard icon={TrendingUp} label="Products Listed" value={d.totalProducts?.toLocaleString()} color="indigo" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        {/* Monthly orders */}
        <div className="lg:col-span-2">
          <ChartCard title="Monthly Orders & Revenue" subtitle="Platform growth over last 6 months">
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={d.monthlyOrders}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis yAxisId="left" tick={{ fontSize: 11 }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} tickFormatter={v => `₹${(v/10000000).toFixed(0)}Cr`} />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="orders" fill="#1e4428" name="Orders" radius={[3, 3, 0, 0]} />
                <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#16a34a" strokeWidth={2} name="Revenue (₹)" dot={{ r: 3 }} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Category breakdown */}
        <ChartCard title="Category Distribution" subtitle="Orders by produce category">
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={d.categoryBreakdown} cx="50%" cy="45%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name} ${value}%`} labelLine={false} fontSize={10}>
                {d.categoryBreakdown?.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip formatter={(v, n) => [`${v}%`, n]} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* State distribution table */}
      <div className="card">
        <h3 className="font-bold text-forest-800 mb-4">State-wise Distribution</h3>
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>State</th>
                <th>Farmers</th>
                <th>Orders</th>
                <th>Market Share</th>
              </tr>
            </thead>
            <tbody>
              {d.stateDistribution?.map((s, i) => (
                <tr key={i}>
                  <td className="font-medium">{s.state}</td>
                  <td>{s.farmers.toLocaleString()}</td>
                  <td>{s.orders.toLocaleString()}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                        <div className="bg-forest-600 h-1.5 rounded-full" style={{ width: `${(s.orders / 11200) * 100}%` }} />
                      </div>
                      <span className="text-xs text-agri-muted">{((s.orders / 45200) * 100).toFixed(1)}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
