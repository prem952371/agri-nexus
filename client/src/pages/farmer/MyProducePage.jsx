import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Package, Edit, Trash2, Eye } from 'lucide-react';
import { getProducts } from '../../services/api';
import { useApp } from '../../context/AppContext';
import { StatusBadge, LoadingState, EmptyState } from '../../components/UIComponents';

const DEMO_PRODUCE = [
  { _id: '1', name: 'Wheat', category: 'Cereals', quantity: 2000, availableQuantity: 1850, price: 24, quality: 'A', location: 'Karnal', state: 'Haryana', isActive: true, createdAt: '2026-08-01' },
  { _id: '6', name: 'Maize', category: 'Cereals', quantity: 3000, availableQuantity: 2500, price: 19, quality: 'B', location: 'Karnal', state: 'Haryana', isActive: true, createdAt: '2026-08-10' },
  { _id: '12', name: 'Cauliflower', category: 'Vegetables', quantity: 500, availableQuantity: 480, price: 28, quality: 'A', location: 'Karnal', state: 'Haryana', isActive: true, createdAt: '2026-09-01' },
];

const EMOJI = { Cereals: '🌾', Vegetables: '🥦', Fruits: '🍎', Pulses: '🫘', Oilseeds: '🌻' };

export default function MyProducePage() {
  const { user, addToast } = useApp();
  const [produce, setProduce] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getProducts({ farmerId: user?._id });
        setProduce(res.data?.products || res.data || DEMO_PRODUCE);
      } catch { setProduce(DEMO_PRODUCE); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  const handleToggle = (id) => {
    setProduce(prev => prev.map(p => p._id === id ? { ...p, isActive: !p.isActive } : p));
    addToast('Product status updated', 'success');
  };

  if (loading) return <LoadingState />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="section-title">My Produce</h1>
          <p className="section-subtitle">{produce.length} products listed on marketplace</p>
        </div>
        <Link to="/farmer/add-produce" className="btn-primary">
          <Plus size={16} /> Add Produce
        </Link>
      </div>

      {produce.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No produce listed yet"
          description="Start by listing your first product on the marketplace."
          action={<Link to="/farmer/add-produce" className="btn-primary"><Plus size={16} />List Produce</Link>}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {produce.map(p => (
            <div key={p._id} className="card">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                  {EMOJI[p.category] || '🌿'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-900">{p.name}</div>
                  <div className="text-xs text-agri-muted">{p.category} · Grade {p.quality}</div>
                </div>
                <div className={`w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 ${p.isActive ? 'bg-green-500' : 'bg-gray-300'}`} title={p.isActive ? 'Active' : 'Inactive'} />
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-agri-muted">Price</span>
                  <span className="font-bold text-forest-800">₹{p.price}/kg</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-agri-muted">Total Quantity</span>
                  <span className="font-medium">{p.quantity?.toLocaleString()} kg</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-agri-muted">Available</span>
                  <span className="font-medium text-green-600">{p.availableQuantity?.toLocaleString()} kg</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                  <div
                    className="bg-forest-600 h-1.5 rounded-full"
                    style={{ width: `${Math.min(100, (p.availableQuantity / p.quantity) * 100)}%` }}
                  />
                </div>
                <div className="text-xs text-agri-muted text-right">
                  {Math.round((p.availableQuantity / p.quantity) * 100)}% remaining
                </div>
              </div>

              <div className="flex gap-2">
                <button onClick={() => handleToggle(p._id)} className={`flex-1 text-xs py-2 px-3 rounded-lg font-medium transition-colors ${p.isActive ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-green-50 text-green-600 hover:bg-green-100'}`}>
                  {p.isActive ? 'Deactivate' : 'Activate'}
                </button>
                <Link to={`/marketplace/${p._id}`} className="p-2 text-gray-400 hover:text-forest-600 hover:bg-gray-50 rounded-lg">
                  <Eye size={16} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
