import React, { useState } from 'react';
import { Truck, Route, Package, DollarSign, MapPin, ArrowRight, CheckCircle, Zap } from 'lucide-react';
import { StatCard, StatusBadge, ChartCard } from '../../components/UIComponents';
import { optimizeRoutes } from '../../services/api';

const DEMO_ORDERS = [
  { id: 'ORD-20240905', farmer: 'Sukhdev Singh', origin: 'Ludhiana', destination: 'Delhi', quantity: 500, product: 'Basmati Rice', status: 'ready_for_pickup' },
  { id: 'ORD-20240906', farmer: 'Ramesh Kumar', origin: 'Karnal', destination: 'Delhi', quantity: 1000, product: 'Wheat', status: 'ready_for_pickup' },
  { id: 'ORD-20240907', farmer: 'Harpreet Kaur', origin: 'Amritsar', destination: 'Delhi', quantity: 200, product: 'Red Apples', status: 'ready_for_pickup' },
  { id: 'ORD-20240908', farmer: 'Lakshmi Devi', origin: 'Nashik', destination: 'Mumbai', quantity: 800, product: 'Tomatoes', status: 'in_transit' },
  { id: 'ORD-20240908B', farmer: 'Govind Patel', origin: 'Surat', destination: 'Mumbai', quantity: 600, product: 'Onions', status: 'in_transit' },
];

const DEMO_RESULT = {
  optimizedRoute: [
    { group: 1, orders: ['ORD-20240906', 'ORD-20240905', 'ORD-20240907'], route: 'Karnal → Ludhiana → Amritsar → Delhi', distance: 480, cost: 4200, vehicleType: '10-Ton Truck', stops: 4 },
    { group: 2, orders: ['ORD-20240908', 'ORD-20240908B'], route: 'Nashik → Surat → Mumbai', distance: 320, cost: 3800, vehicleType: '5-Ton Truck', stops: 3 },
  ],
  totalDistance: 800,
  estimatedCost: 8000,
  traditionalDistance: 1420,
  traditionalCost: 14200,
  estimatedSavings: 6200,
  savingsPercent: 43.7,
};

function RouteMap({ routes }) {
  const colors = ['#1e4428', '#16a34a', '#4ade80'];
  return (
    <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-xl p-6 border border-agri-border">
      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Optimized Route Visualization</div>
      {routes.map((route, gi) => (
        <div key={gi} className="mb-6 last:mb-0">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: colors[gi % colors.length] }}>
              {gi + 1}
            </div>
            <span className="text-sm font-bold text-forest-800">Group {route.group} — {route.vehicleType}</span>
            <span className="text-xs text-agri-muted">{route.distance} km · ₹{route.cost.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap pl-8">
            {route.route.split(' → ').map((loc, i, arr) => (
              <React.Fragment key={i}>
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full border-2 flex items-center justify-center text-xs font-bold"
                    style={{ borderColor: colors[gi % colors.length], color: colors[gi % colors.length], background: 'white' }}>
                    <MapPin size={14} />
                  </div>
                  <span className="text-xs text-center mt-1 text-gray-600 max-w-16 leading-tight">{loc}</span>
                </div>
                {i < arr.length - 1 && (
                  <div className="flex items-center gap-1 mb-4">
                    <div className="h-0.5 w-8" style={{ background: colors[gi % colors.length] }} />
                    <ArrowRight size={10} style={{ color: colors[gi % colors.length] }} />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function LogisticsDashboard() {
  const [result, setResult] = useState(null);
  const [optimizing, setOptimizing] = useState(false);
  const [optimized, setOptimized] = useState(false);

  const handleOptimize = async () => {
    try {
      setOptimizing(true);
      const res = await optimizeRoutes({ orders: DEMO_ORDERS });
      setResult(res.data);
    } catch {
      setResult(DEMO_RESULT);
    } finally {
      setOptimizing(false);
      setOptimized(true);
    }
  };

  const r = result || DEMO_RESULT;

  return (
    <div>
      <div className="mb-6">
        <h1 className="section-title">Logistics Dashboard</h1>
        <p className="section-subtitle">Route optimization and delivery management</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Truck} label="Active Deliveries" value="8" color="orange" />
        <StatCard icon={Route} label="Routes Optimized" value="23" color="green" subtext="This month" />
        <StatCard icon={DollarSign} label="Total Savings" value="₹42,800" color="blue" subtext="This month" />
        <StatCard icon={Package} label="Orders in Transit" value="5" color="purple" />
      </div>

      {/* Pending orders */}
      <div className="card mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-forest-800">Orders Ready for Delivery</h3>
            <p className="text-xs text-agri-muted">{DEMO_ORDERS.filter(o => o.status === 'ready_for_pickup').length} orders awaiting pickup</p>
          </div>
          <button
            onClick={handleOptimize}
            disabled={optimizing}
            className="btn-primary"
          >
            <Zap size={16} />
            {optimizing ? 'Optimizing...' : 'Optimize Routes'}
          </button>
        </div>

        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Farmer</th>
                <th>Product</th>
                <th>Origin</th>
                <th>Destination</th>
                <th>Quantity</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {DEMO_ORDERS.map(o => (
                <tr key={o.id}>
                  <td className="font-medium text-forest-700">{o.id}</td>
                  <td>{o.farmer}</td>
                  <td>{o.product}</td>
                  <td><span className="flex items-center gap-1"><MapPin size={12} />{o.origin}</span></td>
                  <td><span className="flex items-center gap-1"><MapPin size={12} />{o.destination}</span></td>
                  <td>{o.quantity} kg</td>
                  <td><StatusBadge status={o.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Optimization result */}
      {optimized && r && (
        <>
          {/* Before vs After */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="card border-l-4 border-red-300">
              <h4 className="font-bold text-red-700 mb-4">❌ Without Optimization</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm"><span>Separate trips:</span><span className="font-bold">{DEMO_ORDERS.length}</span></div>
                <div className="flex justify-between text-sm"><span>Total distance:</span><span className="font-bold">{r.traditionalDistance} km</span></div>
                <div className="flex justify-between text-sm"><span>Estimated cost:</span><span className="font-bold text-red-600">₹{r.traditionalCost.toLocaleString()}</span></div>
              </div>
            </div>

            <div className="card border-l-4 border-green-400">
              <h4 className="font-bold text-green-700 mb-4">✅ With Route Optimization</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm"><span>Grouped trips:</span><span className="font-bold">{r.optimizedRoute?.length}</span></div>
                <div className="flex justify-between text-sm"><span>Total distance:</span><span className="font-bold">{r.totalDistance} km</span></div>
                <div className="flex justify-between text-sm"><span>Estimated cost:</span><span className="font-bold text-green-600">₹{r.estimatedCost.toLocaleString()}</span></div>
              </div>
              <div className="mt-4 p-3 bg-green-50 rounded-xl">
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-600" />
                  <span className="font-bold text-green-700">Savings: ₹{r.estimatedSavings.toLocaleString()} ({r.savingsPercent}% less)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Route visualization */}
          {r.optimizedRoute && (
            <div className="card mb-6">
              <h3 className="font-bold text-forest-800 mb-4">Optimized Route Map</h3>
              <RouteMap routes={r.optimizedRoute} />
            </div>
          )}

          {/* Route details */}
          {r.optimizedRoute?.map((route, i) => (
            <div key={i} className="card mb-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-forest-800 rounded-full flex items-center justify-center text-white text-sm font-bold">{route.group}</div>
                <div>
                  <div className="font-bold text-forest-800">Trip {route.group} — {route.vehicleType}</div>
                  <div className="text-xs text-agri-muted">{route.route} · {route.distance} km · ₹{route.cost.toLocaleString()}</div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {route.orders.map(oid => {
                  const order = DEMO_ORDERS.find(o => o.id === oid);
                  return order ? (
                    <div key={oid} className="text-xs bg-forest-50 text-forest-700 px-2 py-1 rounded-lg border border-forest-200">
                      {oid} — {order.product} ({order.quantity}kg)
                    </div>
                  ) : null;
                })}
              </div>
            </div>
          ))}
        </>
      )}

      {!optimized && (
        <div className="card text-center py-12 bg-blue-50 border-dashed border-2 border-blue-200">
          <Zap size={40} className="text-blue-400 mx-auto mb-3" />
          <h3 className="font-bold text-gray-700 mb-2">Ready to Optimize Routes</h3>
          <p className="text-sm text-agri-muted mb-4">Click "Optimize Routes" above to group nearby orders and calculate the most efficient delivery routes.</p>
          <button onClick={handleOptimize} className="btn-primary mx-auto">
            <Zap size={16} /> Run Route Optimization
          </button>
        </div>
      )}
    </div>
  );
}
