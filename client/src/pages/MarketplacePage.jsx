import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, Grid, List, Loader2 } from 'lucide-react';
import { getProducts } from '../services/api';
import ProductCard from '../components/ProductCard';
import { SearchBar, LoadingState, EmptyState, ErrorState } from '../components/UIComponents';

const CATEGORIES = ['All', 'Cereals', 'Vegetables', 'Fruits', 'Pulses', 'Oilseeds'];
const STATES = ['All States', 'Haryana', 'Punjab', 'Uttar Pradesh', 'Maharashtra', 'Gujarat', 'Rajasthan', 'Andhra Pradesh', 'Karnataka', 'Delhi'];
const QUALITY = ['All Grades', 'A', 'B', 'C'];
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
];

// Fallback demo data
const DEMO_PRODUCTS = [
  { _id: '1', name: 'Wheat', category: 'Cereals', farmerName: 'Ramesh Kumar', farmerType: 'Individual', location: 'Karnal', state: 'Haryana', availableQuantity: 2000, price: 24, quality: 'A', deliveryDays: 3, minOrderQuantity: 50 },
  { _id: '2', name: 'Basmati Rice', category: 'Cereals', farmerName: 'Sukhdev Singh', farmerType: 'FPO', location: 'Ludhiana', state: 'Punjab', availableQuantity: 1500, price: 65, quality: 'A', deliveryDays: 4, minOrderQuantity: 25 },
  { _id: '3', name: 'Tomatoes', category: 'Vegetables', farmerName: 'Lakshmi Devi', farmerType: 'Individual', location: 'Nashik', state: 'Maharashtra', availableQuantity: 800, price: 22, quality: 'A', deliveryDays: 2, minOrderQuantity: 10 },
  { _id: '4', name: 'Onions', category: 'Vegetables', farmerName: 'Govind Patel', farmerType: 'Individual', location: 'Surat', state: 'Gujarat', availableQuantity: 1200, price: 18, quality: 'B', deliveryDays: 3, minOrderQuantity: 25 },
  { _id: '5', name: 'Potatoes', category: 'Vegetables', farmerName: 'Mohan Lal Sharma', farmerType: 'FPO', location: 'Agra', state: 'Uttar Pradesh', availableQuantity: 900, price: 14, quality: 'A', deliveryDays: 3, minOrderQuantity: 25 },
  { _id: '6', name: 'Maize', category: 'Cereals', farmerName: 'Ramesh Kumar', farmerType: 'Individual', location: 'Karnal', state: 'Haryana', availableQuantity: 3000, price: 19, quality: 'B', deliveryDays: 3, minOrderQuantity: 100 },
  { _id: '7', name: 'Red Apples', category: 'Fruits', farmerName: 'Harpreet Kaur', farmerType: 'Individual', location: 'Amritsar', state: 'Punjab', availableQuantity: 600, price: 95, quality: 'A', deliveryDays: 2, minOrderQuantity: 10 },
  { _id: '8', name: 'Chana Dal', category: 'Pulses', farmerName: 'Sunita Rathi', farmerType: 'Individual', location: 'Jaipur', state: 'Rajasthan', availableQuantity: 500, price: 85, quality: 'A', deliveryDays: 4, minOrderQuantity: 20 },
  { _id: '9', name: 'Moong Dal', category: 'Pulses', farmerName: 'Krishna Reddy', farmerType: 'Individual', location: 'Kurnool', state: 'Andhra Pradesh', availableQuantity: 400, price: 92, quality: 'A', deliveryDays: 5, minOrderQuantity: 20 },
  { _id: '10', name: 'Mustard Seeds', category: 'Oilseeds', farmerName: 'Sukhdev Singh', farmerType: 'FPO', location: 'Ludhiana', state: 'Punjab', availableQuantity: 700, price: 52, quality: 'B', deliveryDays: 4, minOrderQuantity: 20 },
  { _id: '11', name: 'Green Peas', category: 'Vegetables', farmerName: 'Lakshmi Devi', farmerType: 'Individual', location: 'Nashik', state: 'Maharashtra', availableQuantity: 300, price: 45, quality: 'A', deliveryDays: 2, minOrderQuantity: 10 },
  { _id: '12', name: 'Cauliflower', category: 'Vegetables', farmerName: 'Ramesh Kumar', farmerType: 'Individual', location: 'Karnal', state: 'Haryana', availableQuantity: 500, price: 28, quality: 'A', deliveryDays: 2, minOrderQuantity: 10 },
  { _id: '13', name: 'Groundnuts', category: 'Oilseeds', farmerName: 'Sunita Rathi', farmerType: 'Individual', location: 'Jaipur', state: 'Rajasthan', availableQuantity: 600, price: 58, quality: 'A', deliveryDays: 4, minOrderQuantity: 20 },
  { _id: '14', name: 'Soybean', category: 'Oilseeds', farmerName: 'Govind Patel', farmerType: 'Individual', location: 'Surat', state: 'Gujarat', availableQuantity: 800, price: 44, quality: 'B', deliveryDays: 5, minOrderQuantity: 20 },
  { _id: '15', name: 'Spinach', category: 'Vegetables', farmerName: 'Harpreet Kaur', farmerType: 'Individual', location: 'Amritsar', state: 'Punjab', availableQuantity: 200, price: 38, quality: 'A', deliveryDays: 1, minOrderQuantity: 5 },
  { _id: '16', name: 'Brinjal', category: 'Vegetables', farmerName: 'Lakshmi Devi', farmerType: 'Individual', location: 'Nashik', state: 'Maharashtra', availableQuantity: 400, price: 32, quality: 'B', deliveryDays: 2, minOrderQuantity: 10 },
  { _id: '17', name: 'Jowar', category: 'Cereals', farmerName: 'Krishna Reddy', farmerType: 'Individual', location: 'Kurnool', state: 'Andhra Pradesh', availableQuantity: 1000, price: 21, quality: 'A', deliveryDays: 4, minOrderQuantity: 50 },
  { _id: '18', name: 'Sugarcane', category: 'Cereals', farmerName: 'Mohan Lal Sharma', farmerType: 'FPO', location: 'Agra', state: 'Uttar Pradesh', availableQuantity: 5000, price: 4, quality: 'A', deliveryDays: 3, minOrderQuantity: 500 },
];

export default function MarketplacePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [state, setState] = useState('All States');
  const [quality, setQuality] = useState('All Grades');
  const [sort, setSort] = useState('newest');
  const [view, setView] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setCategory(cat);
  }, [searchParams]);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {};
      if (category !== 'All') params.category = category;
      if (state !== 'All States') params.state = state;
      if (quality !== 'All Grades') params.quality = quality;
      if (search) params.search = search;
      params.sort = sort;
      
      const res = await getProducts(params);
      // Backend returns { success, count, data: [...] }
      setProducts(res.data?.data || res.data?.products || []);
    } catch (err) {
      // Use demo data if API fails
      let filtered = DEMO_PRODUCTS;
      if (category !== 'All') filtered = filtered.filter(p => p.category === category);
      if (state !== 'All States') filtered = filtered.filter(p => p.state === state);
      if (quality !== 'All Grades') filtered = filtered.filter(p => p.quality === quality);
      if (search) filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.farmerName.toLowerCase().includes(search.toLowerCase())
      );
      setProducts(filtered);
    } finally {
      setLoading(false);
    }
  }, [category, state, quality, search, sort]);

  useEffect(() => {
    const timer = setTimeout(fetchProducts, 300);
    return () => clearTimeout(timer);
  }, [fetchProducts]);

  return (
    <div className="min-h-screen bg-agri-light py-8">
      <div className="page-container">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-forest-800 mb-1">Agricultural Marketplace</h1>
          <p className="text-sm text-agri-muted">
            {products.length} products from verified farmers and FPOs across India
          </p>
        </div>

        {/* Search & Filter bar */}
        <div className="card mb-6">
          <div className="flex flex-col lg:flex-row gap-3">
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Search products, farmers..."
              className="flex-1"
            />
            
            <div className="flex flex-wrap gap-2">
              <select value={category} onChange={e => setCategory(e.target.value)} className="select text-sm py-2 px-3 w-auto">
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
              <select value={state} onChange={e => setState(e.target.value)} className="select text-sm py-2 px-3 w-auto">
                {STATES.map(s => <option key={s}>{s}</option>)}
              </select>
              <select value={quality} onChange={e => setQuality(e.target.value)} className="select text-sm py-2 px-3 w-auto">
                {QUALITY.map(q => <option key={q}>{q}</option>)}
              </select>
              <select value={sort} onChange={e => setSort(e.target.value)} className="select text-sm py-2 px-3 w-auto">
                {SORT_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setView('grid')}
                className={`p-2 rounded-lg ${view === 'grid' ? 'bg-forest-800 text-white' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <Grid size={16} />
              </button>
              <button
                onClick={() => setView('list')}
                className={`p-2 rounded-lg ${view === 'list' ? 'bg-forest-800 text-white' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <List size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Category chips */}
        <div className="flex gap-2 flex-wrap mb-6">
          {CATEGORIES.map(c => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                category === c
                  ? 'bg-forest-800 text-white'
                  : 'bg-white text-gray-600 border border-agri-border hover:border-forest-300 hover:text-forest-700'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Products grid */}
        {loading ? (
          <LoadingState message="Fetching products..." />
        ) : error ? (
          <ErrorState message={error} onRetry={fetchProducts} />
        ) : products.length === 0 ? (
          <EmptyState
            icon={SlidersHorizontal}
            title="No products found"
            description="Try adjusting your filters or search terms."
            action={
              <button onClick={() => { setCategory('All'); setState('All States'); setQuality('All Grades'); setSearch(''); }} className="btn-primary">
                Clear Filters
              </button>
            }
          />
        ) : (
          <div className={
            view === 'grid'
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'
              : 'flex flex-col gap-4'
          }>
            {products.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
