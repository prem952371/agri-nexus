import React from 'react';
import { DollarSign, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import { StatCard, ChartCard } from '../../components/UIComponents';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const MONTHLY = [
  { month: 'Apr 2026', earnings: 18000, orders: 12 },
  { month: 'May 2026', earnings: 22000, orders: 15 },
  { month: 'Jun 2026', earnings: 19500, orders: 13 },
  { month: 'Jul 2026', earnings: 28000, orders: 20 },
  { month: 'Aug 2026', earnings: 31500, orders: 22 },
  { month: 'Sep 2026', earnings: 38200, orders: 28 },
];

const PRODUCT_BREAKDOWN = [
  { name: 'Wheat', value: 85000, color: '#1e4428' },
  { name: 'Maize', value: 42000, color: '#16a34a' },
  { name: 'Cauliflower', value: 15500, color: '#4ade80' },
];

const PAYMENTS = [
  { id: 'PAY-001', orderId: 'ORD-20240825', amount: 2400, date: '2026-08-27', status: 'paid' },
  { id: 'PAY-002', orderId: 'ORD-20240901', amount: 3800, date: '2026-09-03', status: 'paid' },
  { id: 'PAY-003', orderId: 'ORD-20240905', amount: 9500, date: '—', status: 'pending' },
  { id: 'PAY-004', orderId: 'ORD-20240907', amount: 4800, date: '—', status: 'pending' },
  { id: 'PAY-005', orderId: 'ORD-20240908', amount: 24000, date: '—', status: 'pending' },
];

export default function FarmerEarningsPage() {
  const totalEarned = 157000;
  const totalReceived = 122700;
  const pending = totalEarned - totalReceived;

  return (
    <div>
      <div className="mb-6">
        <h1 className="section-title">Earnings Overview</h1>
        <p className="section-subtitle">Financial summary and payment history</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <StatCard icon={DollarSign} label="Total Sales Value" value="₹1,57,000" color="green" subtext="All-time" />
        <StatCard icon={CheckCircle} label="Amount Received" value="₹1,22,700" color="blue" subtext="In bank account" />
        <StatCard icon={Clock} label="Pending Payment" value="₹34,300" color="orange" subtext="3 orders in transit" />
        <StatCard icon={TrendingUp} label="This Month" value="₹38,200" color="purple" trend={21} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <ChartCard title="Monthly Earnings" subtitle="Revenue trend over 6 months">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={MONTHLY}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} tickFormatter={v => `₹${v / 1000}k`} />
              <Tooltip formatter={v => [`₹${v.toLocaleString()}`, 'Earnings']} />
              <Bar dataKey="earnings" fill="#1e4428" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Earnings by Produce" subtitle="Revenue breakdown by product">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={PRODUCT_BREAKDOWN} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                {PRODUCT_BREAKDOWN.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip formatter={v => [`₹${v.toLocaleString()}`, 'Revenue']} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Payment comparison */}
      <div className="card mb-6 bg-forest-50 border-forest-200">
        <h3 className="font-bold text-forest-800 mb-4">AgriNexus vs Traditional — Your Earnings</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl p-4 border border-red-200">
            <div className="text-sm font-semibold text-red-700 mb-2">❌ Via Traditional Middlemen</div>
            <div className="text-2xl font-bold text-red-600">₹1,17,750</div>
            <div className="text-xs text-gray-500 mt-1">At ~₹18/kg average (middlemen take ~25%)</div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-green-200">
            <div className="text-sm font-semibold text-green-700 mb-2">✓ Via AgriNexus (Direct)</div>
            <div className="text-2xl font-bold text-green-600">₹1,57,000</div>
            <div className="text-xs text-gray-500 mt-1">At ₹24/kg average (direct to buyers)</div>
          </div>
        </div>
        <div className="mt-3 p-3 bg-green-100 rounded-xl text-sm text-green-800 font-medium">
          💰 You earned <strong>₹39,250 more</strong> (33% increase) by using AgriNexus directly.
          <span className="block text-xs font-normal text-green-600 mt-0.5">Illustrative comparison — actual amounts may vary</span>
        </div>
      </div>

      {/* Payment history */}
      <div className="card">
        <h3 className="font-bold text-forest-800 mb-4">Payment History</h3>
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Payment ID</th>
                <th>Order Ref</th>
                <th>Amount</th>
                <th>Payment Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {PAYMENTS.map(p => (
                <tr key={p.id}>
                  <td className="font-medium text-forest-700">{p.id}</td>
                  <td>{p.orderId}</td>
                  <td className="font-semibold">₹{p.amount.toLocaleString()}</td>
                  <td className="text-agri-muted">{p.date}</td>
                  <td>
                    <span className={`badge ${p.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {p.status === 'paid' ? '✓ Paid' : '⏳ Pending'}
                    </span>
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
