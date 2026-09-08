import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Minus, Info, AlertTriangle } from 'lucide-react';
import { getForecast } from '../../services/api';
import { LoadingState, ChartCard } from '../../components/UIComponents';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ReferenceLine, Legend, Area, AreaChart, ComposedChart, Bar, BarChart
} from 'recharts';

const PRODUCTS = ['Tomato', 'Wheat', 'Rice', 'Potato', 'Onion', 'Maize', 'Chana Dal', 'Apple'];
const LOCATIONS = ['Delhi', 'Mumbai', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad'];

function generateDemoForecast(product, location, days) {
  const bases = { Tomato: 3800, Wheat: 6200, Rice: 4500, Potato: 2800, Onion: 7500, Maize: 3200, 'Chana Dal': 1800, Apple: 1200 };
  const base = bases[product] || 3000;
  const trends = { Delhi: 1.04, Mumbai: 1.02, Bangalore: 0.98, Hyderabad: 1.01, Chennai: 0.99, Kolkata: 1.03 };
  const trendFactor = trends[location] || 1.01;
  const today = new Date();

  // Historical (last 30 days)
  const historical = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (29 - i));
    const noise = 1 + (Math.random() - 0.5) * 0.25;
    const weekdayBoost = [0, 6].includes(d.getDay()) ? 0.85 : 1.0;
    return {
      date: d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
      actualDemand: Math.round(base * noise * weekdayBoost),
    };
  });

  // Forecast (next N days)
  const forecast = Array.from({ length: days }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() + i + 1);
    const noise = 1 + (Math.random() - 0.5) * 0.15;
    const trend = Math.pow(trendFactor, i);
    const weekdayBoost = [0, 6].includes(d.getDay()) ? 0.85 : 1.0;
    const predicted = Math.round(base * trend * noise * weekdayBoost);
    return {
      date: d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
      predictedDemand: predicted,
      low: Math.round(predicted * 0.88),
      high: Math.round(predicted * 1.12),
    };
  });

  const avgHistorical = historical.reduce((s, d) => s + d.actualDemand, 0) / historical.length;
  const avgForecast = forecast.reduce((s, d) => s + d.predictedDemand, 0) / forecast.length;
  const changePct = ((avgForecast - avgHistorical) / avgHistorical) * 100;
  const trend = changePct > 3 ? 'increasing' : changePct < -3 ? 'decreasing' : 'stable';

  let recommendation;
  if (trend === 'increasing') {
    recommendation = `Demand for ${product} in ${location} is expected to increase by ${Math.abs(changePct).toFixed(1)}% over the next ${days} days. Consider increasing supply by approximately ${Math.ceil(changePct)}% to capture market opportunity.`;
  } else if (trend === 'decreasing') {
    recommendation = `Demand for ${product} in ${location} may decrease by ${Math.abs(changePct).toFixed(1)}%. Consider listing in alternative markets or reducing new harvest commitments.`;
  } else {
    recommendation = `Demand for ${product} in ${location} is expected to remain stable. Maintain current supply levels and pricing.`;
  }

  return {
    product, location,
    forecast,
    historicalData: historical,
    trend,
    confidence: 0.78 + Math.random() * 0.15,
    averageDemand: Math.round(avgForecast),
    recommendation,
    changePct: changePct.toFixed(1),
  };
}

export default function DemandForecastPage() {
  const [product, setProduct] = useState('Tomato');
  const [location, setLocation] = useState('Delhi');
  const [days, setDays] = useState(7);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchForecast = async () => {
    try {
      setLoading(true);
      const res = await getForecast({ product, location, days });
      // Backend returns { success, data: { product, location, forecast, historicalData, trend, ... } }
      setData(res.data?.data || res.data);
    } catch {
      setData(generateDemoForecast(product, location, days));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchForecast(); }, [product, location, days]);

  const TrendIcon = data?.trend === 'increasing' ? TrendingUp : data?.trend === 'decreasing' ? TrendingDown : Minus;
  const trendColor = data?.trend === 'increasing' ? 'text-green-600' : data?.trend === 'decreasing' ? 'text-red-500' : 'text-blue-500';

  // Combine historical + forecast for chart
  const chartData = data ? [
    ...data.historicalData.slice(-14).map(d => ({ ...d, type: 'historical' })),
    ...data.forecast.map(d => ({ ...d, type: 'forecast' })),
  ] : [];

  return (
    <div>
      <div className="mb-6">
        <h1 className="section-title">AI Demand Forecasting</h1>
        <p className="section-subtitle">Historical sales pattern analysis to estimate future market demand</p>
      </div>

      <div className="inline-flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg text-xs mb-6">
        <Info size={13} />
        Demand forecasting uses historical sales patterns and seasonal trends to estimate future demand. 
        Designed to integrate with real ML models in production.
      </div>

      {/* Controls */}
      <div className="card mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="label">Crop / Product</label>
            <select value={product} onChange={e => setProduct(e.target.value)} className="select">
              {PRODUCTS.map(p => <option key={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Market / Location</label>
            <select value={location} onChange={e => setLocation(e.target.value)} className="select">
              {LOCATIONS.map(l => <option key={l}>{l}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Forecast Period</label>
            <select value={days} onChange={e => setDays(Number(e.target.value))} className="select">
              <option value={7}>Next 7 Days</option>
              <option value={14}>Next 14 Days</option>
              <option value={30}>Next 30 Days</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? <LoadingState message="Calculating forecast..." /> : data && (
        <>
          {/* Key metrics */}
          {/* Normalize fields: backend uses trendChangePct + confidence(0-100) + summary.avgDailyDemand */}
          {(() => {
            const avgDemand = data.averageDemand ?? data.summary?.avgDailyDemand ?? 0;
            const changePct = data.changePct ?? data.trendChangePct ?? 0;
            // Backend sends confidence as 0-100 integer; local demo sends 0-1 float
            const confidencePct = data.confidence > 1 ? data.confidence : (data.confidence * 100).toFixed(0);
            return (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="card text-center">
              <div className="text-2xl font-bold text-forest-800">{Number(avgDemand).toLocaleString()}</div>
              <div className="text-xs text-agri-muted mt-1">Avg Daily Demand (kg)</div>
            </div>
            <div className="card text-center">
              <div className={`text-2xl font-bold flex items-center justify-center gap-1 ${trendColor}`}>
                <TrendIcon size={20} />
                {Math.abs(changePct)}%
              </div>
              <div className="text-xs text-agri-muted mt-1">
                Demand {data.trend === 'increasing' ? 'Increase' : data.trend === 'decreasing' ? 'Decrease' : 'Change'}
              </div>
            </div>
            <div className="card text-center">
              <div className="text-2xl font-bold text-forest-800">{confidencePct}%</div>
              <div className="text-xs text-agri-muted mt-1">Model Confidence</div>
            </div>
            <div className="card text-center">
              <div className="text-sm font-bold text-forest-800 capitalize">
                {data.trend === 'increasing' ? '📈 Rising' : data.trend === 'decreasing' ? '📉 Falling' : '→ Stable'}
              </div>
              <div className="text-xs text-agri-muted mt-1">Demand Trend</div>
              <div className="mt-1.5 w-full bg-gray-100 rounded-full h-1.5">
                <div className={`h-1.5 rounded-full ${data.trend === 'increasing' ? 'bg-green-500' : data.trend === 'decreasing' ? 'bg-red-400' : 'bg-blue-400'}`}
                  style={{ width: `${confidencePct}%` }} />
              </div>
            </div>
          </div>
            );
          })()}

          {/* Recommendation */}
          <div className={`card mb-6 border-l-4 ${data.trend === 'increasing' ? 'border-green-400 bg-green-50' : data.trend === 'decreasing' ? 'border-red-300 bg-red-50' : 'border-blue-300 bg-blue-50'}`}>
            <div className="flex items-start gap-3">
              <TrendIcon size={20} className={`${trendColor} flex-shrink-0 mt-0.5`} />
              <div>
                <div className="font-bold text-forest-800 mb-1">Recommended Action</div>
                <p className="text-sm text-gray-700">{data.recommendation}</p>
              </div>
            </div>
          </div>

          {/* Forecast Chart */}
          <ChartCard
            title={`${product} Demand — ${location} Market`}
            subtitle={`Historical (last 14 days) + Forecast (next ${days} days). Illustrative demo data.`}
            className="mb-6"
          >
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} interval={2} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `${(v/1000).toFixed(1)}k`} />
                <Tooltip
                  formatter={(value, name) => [
                    `${value?.toLocaleString()} kg`,
                    name === 'actualDemand' ? 'Historical' : name === 'predictedDemand' ? 'Forecast' : name
                  ]}
                />
                <Legend formatter={name => name === 'actualDemand' ? 'Historical Demand' : name === 'predictedDemand' ? 'Forecasted Demand' : name} />
                <ReferenceLine x={data.historicalData[data.historicalData.length - 1]?.date} stroke="#94a3b8" strokeDasharray="4 4" label={{ value: 'Today', fontSize: 10 }} />
                <Bar dataKey="high" fill="#bbf7d0" name="Forecast Range (High)" />
                <Bar dataKey="low" fill="#f0fdf4" name="Forecast Range (Low)" />
                <Line type="monotone" dataKey="actualDemand" stroke="#1e4428" strokeWidth={2} dot={false} name="actualDemand" />
                <Line type="monotone" dataKey="predictedDemand" stroke="#16a34a" strokeWidth={2.5} strokeDasharray="6 3" dot={{ fill: '#16a34a', r: 3 }} name="predictedDemand" />
              </ComposedChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Forecast table */}
          <ChartCard title="Day-by-Day Forecast" subtitle={`${days}-day detailed forecast for ${product} in ${location}`}>
            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Predicted Demand</th>
                    <th>Low Estimate</th>
                    <th>High Estimate</th>
                    <th>vs Average</th>
                  </tr>
                </thead>
                <tbody>
                  {data.forecast.map((f, i) => {
                    const change = ((f.predictedDemand - data.averageDemand) / data.averageDemand * 100).toFixed(1);
                    return (
                      <tr key={i}>
                        <td className="font-medium">{f.date}</td>
                        <td className="font-bold text-forest-700">{f.predictedDemand?.toLocaleString()} kg</td>
                        <td className="text-agri-muted">{f.low?.toLocaleString()} kg</td>
                        <td className="text-agri-muted">{f.high?.toLocaleString()} kg</td>
                        <td className={`font-medium ${Number(change) > 0 ? 'text-green-600' : 'text-red-500'}`}>
                          {Number(change) > 0 ? '+' : ''}{change}%
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </ChartCard>
        </>
      )}
    </div>
  );
}
