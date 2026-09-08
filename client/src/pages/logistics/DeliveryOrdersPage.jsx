import React from 'react';
import { Truck, MapPin, Package, Clock } from 'lucide-react';
import { StatusBadge } from '../../components/UIComponents';

const DELIVERIES = [
  { deliveryId: 'DEL-001', orders: ['ORD-20240905', 'ORD-20240906'], origin: 'Karnal + Ludhiana', destination: 'Delhi', distance: 310, estimatedCost: 3800, status: 'delivered', driver: 'Mohan Sharma', vehicle: 'MH-04-XY-1234', departureTime: '2026-09-06 06:00', estimatedArrival: '2026-09-06 14:00', items: 'Wheat 1000kg, Basmati Rice 500kg' },
  { deliveryId: 'DEL-002', orders: ['ORD-20240908', 'ORD-20240908B'], origin: 'Nashik + Surat', destination: 'Mumbai', distance: 320, estimatedCost: 3800, status: 'in_transit', driver: 'Ravi Kumar', vehicle: 'MH-09-AB-5678', departureTime: '2026-09-08 05:30', estimatedArrival: '2026-09-08 18:00', items: 'Tomatoes 800kg, Onions 600kg' },
  { deliveryId: 'DEL-003', orders: ['ORD-20240907'], origin: 'Amritsar', destination: 'Delhi', distance: 450, estimatedCost: 2800, status: 'scheduled', driver: 'Suresh Verma', vehicle: 'DL-01-CD-9012', departureTime: '2026-09-10 07:00', estimatedArrival: '2026-09-10 19:00', items: 'Red Apples 200kg' },
  { deliveryId: 'DEL-004', orders: ['ORD-20240901', 'ORD-20240902'], origin: 'Kurnool + Jaipur', destination: 'Hyderabad', distance: 220, estimatedCost: 2400, status: 'delivered', driver: 'Prakash Rao', vehicle: 'TS-09-EF-3456', departureTime: '2026-09-02 06:00', estimatedArrival: '2026-09-02 12:00', items: 'Chana Dal 500kg, Moong Dal 400kg' },
];

export default function DeliveryOrdersPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="section-title">Delivery Orders</h1>
        <p className="section-subtitle">All delivery assignments and tracking</p>
      </div>

      <div className="space-y-4">
        {DELIVERIES.map(d => (
          <div key={d.deliveryId} className="card">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-forest-700">{d.deliveryId}</span>
                  <StatusBadge status={d.status} />
                </div>
                <div className="flex items-center gap-4 text-sm text-agri-muted">
                  <span className="flex items-center gap-1"><MapPin size={12} />{d.origin}</span>
                  <span>→</span>
                  <span className="flex items-center gap-1"><MapPin size={12} />{d.destination}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-forest-800">₹{d.estimatedCost.toLocaleString()}</div>
                <div className="text-xs text-agri-muted">{d.distance} km</div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-gray-50 rounded-lg p-2">
                <div className="text-agri-muted">Driver</div>
                <div className="font-medium mt-0.5">{d.driver}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-2">
                <div className="text-agri-muted">Vehicle</div>
                <div className="font-medium mt-0.5">{d.vehicle}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-2">
                <div className="text-agri-muted">Departure</div>
                <div className="font-medium mt-0.5">{d.departureTime}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-2">
                <div className="text-agri-muted">ETA</div>
                <div className="font-medium mt-0.5">{d.estimatedArrival}</div>
              </div>
            </div>

            <div className="mt-3 flex items-center gap-2 text-xs">
              <Package size={12} className="text-agri-muted" />
              <span className="text-agri-muted">{d.items}</span>
              <span className="text-agri-muted">·</span>
              <span className="text-agri-muted">Orders: {d.orders.join(', ')}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
