import React from 'react';
import { Info, TrendingUp, ArrowDown, ArrowUp } from 'lucide-react';
import { ChartCard } from '../../components/UIComponents';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, RadarChart, Radar, PolarGrid, PolarAngleAxis } from 'recharts';

const SAVINGS_DATA = [
  { month: 'Apr', farmerGain: 1.8, consumerSaving: 1.2, logisticsSaving: 0.9 },
  { month: 'May', farmerGain: 2.1, consumerSaving: 1.4, logisticsSaving: 1.1 },
  { month: 'Jun', farmerGain: 2.0, consumerSaving: 1.3, logisticsSaving: 1.0 },
  { month: 'Jul', farmerGain: 2.5, consumerSaving: 1.7, logisticsSaving: 1.3 },
  { month: 'Aug', farmerGain: 2.8, consumerSaving: 1.9, logisticsSaving: 1.5 },
  { month: 'Sep', farmerGain: 3.2, consumerSaving: 2.1, logisticsSaving: 1.8 },
];

const PRICE_FLOW = [
  { stage: 'Farm Price', traditional: 18, agrinexus: 24 },
  { stage: 'With Logistics', traditional: 22.5, agrinexus: 26.5 },
  { stage: 'With Margins', traditional: 29, agrinexus: 27.5 },
  { stage: 'Consumer Price', traditional: 32, agrinexus: 29 },
];

const METRICS = [
  { metric: 'Farmer Income', traditional: 56, agrinexus: 83 },
  { metric: 'Price Transparency', traditional: 20, agrinexus: 95 },
  { metric: 'Logistics Efficiency', traditional: 45, agrinexus: 88 },
  { metric: 'Market Access', traditional: 35, agrinexus: 90 },
  { metric: 'Consumer Savings', traditional: 30, agrinexus: 80 },
];

export default function ImpactPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="section-title">Intermediary Impact Analysis</h1>
        <p className="section-subtitle">Demonstrating how KrishiSetu reduces supply-chain inefficiencies</p>
      </div>

      <div className="inline-flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-200 text-amber-700 rounded-lg text-xs mb-6">
        <Info size={13} />
        <strong>Illustrative Demo Comparison</strong> — These numbers demonstrate the platform's value proposition. 
        Actual figures may vary by region, crop, and market conditions.
      </div>

      {/* Hero comparison */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {[
          {
            title: 'Traditional Supply Chain',
            icon: '❌',
            color: 'border-red-200 bg-red-50',
            badgeColor: 'bg-red-100 text-red-700',
            metrics: [
              { label: 'Farmer receives', value: '₹18/kg', sub: 'Only 56% of consumer price' },
              { label: 'Consumer pays', value: '₹32/kg', sub: '78% markup from farm price' },
              { label: 'Intermediaries', value: '5 middlemen', sub: 'Trader → Wholesaler → Distributor → Retailer' },
              { label: 'Farmer margin', value: '₹14/kg lost', sub: 'To intermediary chain' },
              { label: 'Logistics cost', value: '₹4.5/kg', sub: 'Multiple separate trips' },
            ]
          },
          {
            title: 'KrishiSetu Platform',
            icon: '✅',
            color: 'border-green-200 bg-green-50',
            badgeColor: 'bg-green-100 text-green-700',
            metrics: [
              { label: 'Farmer receives', value: '₹24/kg', sub: '+33% more than traditional', positive: true },
              { label: 'Consumer pays', value: '₹29/kg', sub: '9.4% less than traditional', positive: true },
              { label: 'Intermediaries', value: '0 middlemen', sub: 'Direct farmer-to-buyer', positive: true },
              { label: 'Platform fee', value: '₹5/kg only', sub: 'Covers logistics + platform', positive: true },
              { label: 'Logistics cost', value: '₹2.5/kg', sub: 'Route-optimized delivery', positive: true },
            ]
          }
        ].map((section, i) => (
          <div key={i} className={`card border-2 ${section.color}`}>
            <div className="flex items-center gap-2 mb-5">
              <span className="text-2xl">{section.icon}</span>
              <h3 className="font-bold text-lg text-gray-800">{section.title}</h3>
            </div>
            <div className="space-y-3">
              {section.metrics.map((m, j) => (
                <div key={j} className="flex justify-between items-start">
                  <div>
                    <div className="text-xs text-agri-muted">{m.label}</div>
                    <div className={`text-xs mt-0.5 ${m.positive ? 'text-green-600 font-medium' : 'text-gray-500'}`}>{m.sub}</div>
                  </div>
                  <div className={`font-bold text-base ${i === 0 ? 'text-red-600' : 'text-green-600'}`}>{m.value}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Impact numbers */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Farmer Earnings', change: '+33%', desc: 'More income per kg', up: true },
          { label: 'Consumer Price', change: '-9.4%', desc: 'Less than traditional', up: false },
          { label: 'Logistics Cost', change: '-44%', desc: 'Route optimization', up: false },
          { label: 'Intermediaries', change: '0', desc: 'Direct transactions', up: false },
        ].map((m, i) => (
          <div key={i} className="card text-center">
            <div className={`text-3xl font-black mb-1 ${m.up ? 'text-green-600' : 'text-green-600'}`}>
              {m.change}
            </div>
            <div className="font-bold text-sm text-forest-800">{m.label}</div>
            <div className="text-xs text-agri-muted">{m.desc}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Price flow chart */}
        <ChartCard title="Price Flow Comparison" subtitle="Farm to consumer price at each stage (₹/kg)">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={PRICE_FLOW} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" tick={{ fontSize: 11 }} tickFormatter={v => `₹${v}`} />
              <YAxis type="category" dataKey="stage" tick={{ fontSize: 11 }} width={90} />
              <Tooltip formatter={v => [`₹${v}/kg`]} />
              <Legend />
              <Bar dataKey="traditional" fill="#ef4444" name="Traditional" radius={[0, 3, 3, 0]} />
              <Bar dataKey="agrinexus" fill="#1e4428" name="KrishiSetu" radius={[0, 3, 3, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Monthly savings */}
        <ChartCard title="Monthly Savings Generated" subtitle="₹ Crores saved vs traditional supply chain">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={SAVINGS_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `₹${v}Cr`} />
              <Tooltip formatter={(v, n) => [`₹${v}Cr`, n]} />
              <Legend />
              <Bar dataKey="farmerGain" fill="#1e4428" name="Farmer Gain" radius={[3, 3, 0, 0]} stackId="a" />
              <Bar dataKey="consumerSaving" fill="#16a34a" name="Consumer Saving" radius={[3, 3, 0, 0]} stackId="a" />
              <Bar dataKey="logisticsSaving" fill="#4ade80" name="Logistics Saving" radius={[3, 3, 0, 0]} stackId="a" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Platform efficiency radar */}
      <ChartCard title="Platform Performance Index" subtitle="KrishiSetu vs Traditional Supply Chain (score out of 100)">
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart data={METRICS}>
            <PolarGrid />
            <PolarAngleAxis dataKey="metric" tick={{ fontSize: 12 }} />
            <Radar name="Traditional" dataKey="traditional" stroke="#ef4444" fill="#ef4444" fillOpacity={0.15} />
            <Radar name="KrishiSetu" dataKey="agrinexus" stroke="#1e4428" fill="#1e4428" fillOpacity={0.3} />
            <Legend />
            <Tooltip />
          </RadarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}
