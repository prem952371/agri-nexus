import React from 'react';
import { TrendingUp } from 'lucide-react';
import { ChartCard } from '../../components/UIComponents';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const SUPPLY_DEMAND = [
  { month: 'Apr', supply: 420000, demand: 380000, gap: 40000 },
  { month: 'May', supply: 390000, demand: 410000, gap: -20000 },
  { month: 'Jun', supply: 450000, demand: 430000, gap: 20000 },
  { month: 'Jul', supply: 510000, demand: 490000, gap: 20000 },
  { month: 'Aug', supply: 480000, demand: 520000, gap: -40000 },
  { month: 'Sep', supply: 560000, demand: 540000, gap: 20000 },
];

const CROP_PRICES = [
  { month: 'Apr', wheat: 22, rice: 60, tomato: 28, onion: 22 },
  { month: 'May', wheat: 23, rice: 62, tomato: 18, onion: 16 },
  { month: 'Jun', wheat: 24, rice: 63, tomato: 15, onion: 14 },
  { month: 'Jul', wheat: 24, rice: 65, tomato: 20, onion: 18 },
  { month: 'Aug', wheat: 25, rice: 66, tomato: 26, onion: 20 },
  { month: 'Sep', wheat: 24, rice: 65, tomato: 22, onion: 18 },
];

const FORECAST_DEMAND = [
  { week: 'W1 Aug', actual: 480000, forecast: 475000 },
  { week: 'W2 Aug', actual: 495000, forecast: 490000 },
  { week: 'W3 Aug', actual: 510000, forecast: 500000 },
  { week: 'W4 Aug', actual: 520000, forecast: 515000 },
  { week: 'W1 Sep', actual: 535000, forecast: 530000 },
  { week: 'W2 Sep', actual: null, forecast: 548000 },
  { week: 'W3 Sep', actual: null, forecast: 562000 },
  { week: 'W4 Sep', actual: null, forecast: 575000 },
];

export default function SupplyDemandPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="section-title">Supply &amp; Demand Analytics</h1>
        <p className="section-subtitle">Aggregate platform supply, demand, and price trend analysis</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Supply (Sep)', value: '5.6L kg', change: '+16%' },
          { label: 'Total Demand (Sep)', value: '5.4L kg', change: '+13%' },
          { label: 'Avg Wheat Price', value: '₹24/kg', change: '+4.3%' },
          { label: 'Platform Fulfillment', value: '96.4%', change: '+2.1%' },
        ].map((s, i) => (
          <div key={i} className="card text-center">
            <div className="text-xl font-bold text-forest-800">{s.value}</div>
            <div className="text-xs text-agri-muted mt-1">{s.label}</div>
            <div className="text-xs text-green-600 font-medium mt-1">{s.change} vs last month</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <ChartCard title="Supply vs Demand (kg)" subtitle="Monthly aggregate across all produce categories">
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={SUPPLY_DEMAND}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
              <Tooltip formatter={(v) => [`${(v/1000).toFixed(0)}k kg`]} />
              <Legend />
              <Area type="monotone" dataKey="supply" stroke="#1e4428" fill="#dcfce7" name="Supply" strokeWidth={2} />
              <Area type="monotone" dataKey="demand" stroke="#16a34a" fill="#bbf7d0" name="Demand" strokeWidth={2} fillOpacity={0.5} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Crop Price Trends (₹/kg)" subtitle="Average platform prices for major crops">
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={CROP_PRICES}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `₹${v}`} />
              <Tooltip formatter={(v, n) => [`₹${v}/kg`, n.charAt(0).toUpperCase() + n.slice(1)]} />
              <Legend />
              <Line type="monotone" dataKey="wheat" stroke="#1e4428" strokeWidth={2} name="wheat" dot={{ r: 3 }} />
              <Line type="monotone" dataKey="rice" stroke="#16a34a" strokeWidth={2} name="rice" dot={{ r: 3 }} />
              <Line type="monotone" dataKey="tomato" stroke="#ef4444" strokeWidth={2} name="tomato" dot={{ r: 3 }} />
              <Line type="monotone" dataKey="onion" stroke="#f97316" strokeWidth={2} name="onion" dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <ChartCard title="Demand Forecast Accuracy" subtitle="Actual vs forecasted platform demand (weekly). Shaded = forecast period.">
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={FORECAST_DEMAND}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="week" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
            <Tooltip formatter={v => v ? [`${(v/1000).toFixed(1)}k kg`] : ['—']} />
            <Legend />
            <Line type="monotone" dataKey="actual" stroke="#1e4428" strokeWidth={2.5} name="Actual Demand" dot={{ r: 4 }} connectNulls={false} />
            <Line type="monotone" dataKey="forecast" stroke="#4ade80" strokeWidth={2} strokeDasharray="6 3" name="AI Forecast" dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}
