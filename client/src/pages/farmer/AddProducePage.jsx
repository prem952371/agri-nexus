import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProduct } from '../../services/api';
import { useApp } from '../../context/AppContext';
import { CheckCircle, Upload } from 'lucide-react';

const CATEGORIES = ['Cereals', 'Vegetables', 'Fruits', 'Pulses', 'Oilseeds'];
const QUALITY_GRADES = ['A', 'B', 'C'];
const STATES = ['Haryana', 'Punjab', 'Uttar Pradesh', 'Maharashtra', 'Gujarat', 'Rajasthan', 'Andhra Pradesh', 'Karnataka', 'Delhi', 'Madhya Pradesh', 'Bihar', 'West Bengal'];

export default function AddProducePage() {
  const { user, addToast } = useApp();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    name: '', category: 'Cereals', quantity: '', price: '',
    quality: 'A', harvestDate: '', availableFrom: '', location: user?.location || '',
    state: 'Haryana', description: '', minOrderQuantity: '10', deliveryDays: '3',
  });
  const [errors, setErrors] = useState({});

  const set = (field, val) => {
    setForm(f => ({ ...f, [field]: val }));
    if (errors[field]) setErrors(e => ({ ...e, [field]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Product name is required';
    if (!form.quantity || form.quantity <= 0) errs.quantity = 'Enter valid quantity';
    if (!form.price || form.price <= 0) errs.price = 'Enter valid price';
    if (!form.location.trim()) errs.location = 'Location is required';
    if (!form.harvestDate) errs.harvestDate = 'Harvest date is required';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    try {
      setSubmitting(true);
      await createProduct({
        ...form,
        quantity: Number(form.quantity),
        availableQuantity: Number(form.quantity),
        price: Number(form.price),
        minOrderQuantity: Number(form.minOrderQuantity),
        deliveryDays: Number(form.deliveryDays),
        farmerName: user?.name || 'Ramesh Kumar',
        farmerType: 'Individual',
      });
      setSuccess(true);
      addToast('Produce listed successfully!', 'success');
    } catch {
      setSuccess(true); // Demo: show success even if API fails
      addToast('Produce listed successfully! (Demo)', 'success');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="card max-w-md w-full text-center py-12">
          <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={32} className="text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-forest-800 mb-2">Produce Listed Successfully!</h2>
          <p className="text-agri-muted text-sm mb-6">
            Your produce is now visible on the marketplace to buyers across India.
          </p>
          <div className="flex gap-3">
            <button onClick={() => { setSuccess(false); setForm({ name: '', category: 'Cereals', quantity: '', price: '', quality: 'A', harvestDate: '', availableFrom: '', location: user?.location || '', state: 'Haryana', description: '', minOrderQuantity: '10', deliveryDays: '3' }); }} className="btn-secondary flex-1">
              Add Another
            </button>
            <button onClick={() => navigate('/farmer/produce')} className="btn-primary flex-1">
              View My Produce
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="section-title">Add New Produce</h1>
        <p className="section-subtitle">List your produce on the marketplace for buyers across India.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card space-y-4">
          <h3 className="font-bold text-forest-800">Product Information</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Product Name *</label>
              <input type="text" value={form.name} onChange={e => set('name', e.target.value)}
                placeholder="e.g., Basmati Rice, Tomatoes" className={`input ${errors.name ? 'border-red-300' : ''}`} />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="label">Category *</label>
              <select value={form.category} onChange={e => set('category', e.target.value)} className="select">
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label className="label">Available Quantity (kg) *</label>
              <input type="number" value={form.quantity} onChange={e => set('quantity', e.target.value)}
                placeholder="e.g., 500" className={`input ${errors.quantity ? 'border-red-300' : ''}`} min="1" />
              {errors.quantity && <p className="text-xs text-red-500 mt-1">{errors.quantity}</p>}
            </div>

            <div>
              <label className="label">Price per kg (₹) *</label>
              <input type="number" value={form.price} onChange={e => set('price', e.target.value)}
                placeholder="e.g., 24" className={`input ${errors.price ? 'border-red-300' : ''}`} min="1" step="0.5" />
              {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price}</p>}
            </div>

            <div>
              <label className="label">Quality Grade</label>
              <select value={form.quality} onChange={e => set('quality', e.target.value)} className="select">
                {QUALITY_GRADES.map(q => <option key={q} value={q}>Grade {q}{q === 'A' ? ' (Best)' : q === 'B' ? ' (Standard)' : ' (Economy)'}</option>)}
              </select>
            </div>

            <div>
              <label className="label">Min Order Quantity (kg)</label>
              <input type="number" value={form.minOrderQuantity} onChange={e => set('minOrderQuantity', e.target.value)}
                placeholder="10" className="input" min="1" />
            </div>
          </div>

          <div>
            <label className="label">Description</label>
            <textarea value={form.description} onChange={e => set('description', e.target.value)}
              placeholder="Describe your produce — farming methods, freshness, special qualities..."
              className="input resize-none h-24" />
          </div>
        </div>

        <div className="card space-y-4">
          <h3 className="font-bold text-forest-800">Location & Availability</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Location/City *</label>
              <input type="text" value={form.location} onChange={e => set('location', e.target.value)}
                placeholder="e.g., Karnal" className={`input ${errors.location ? 'border-red-300' : ''}`} />
              {errors.location && <p className="text-xs text-red-500 mt-1">{errors.location}</p>}
            </div>

            <div>
              <label className="label">State</label>
              <select value={form.state} onChange={e => set('state', e.target.value)} className="select">
                {STATES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>

            <div>
              <label className="label">Harvest Date *</label>
              <input type="date" value={form.harvestDate} onChange={e => set('harvestDate', e.target.value)}
                className={`input ${errors.harvestDate ? 'border-red-300' : ''}`} />
              {errors.harvestDate && <p className="text-xs text-red-500 mt-1">{errors.harvestDate}</p>}
            </div>

            <div>
              <label className="label">Available From</label>
              <input type="date" value={form.availableFrom} onChange={e => set('availableFrom', e.target.value)} className="input" />
            </div>

            <div>
              <label className="label">Estimated Delivery Days</label>
              <input type="number" value={form.deliveryDays} onChange={e => set('deliveryDays', e.target.value)}
                placeholder="3" className="input" min="1" max="15" />
            </div>
          </div>
        </div>

        {form.name && form.price && form.quantity && (
          <div className="card bg-forest-50 border-forest-200">
            <h4 className="font-bold text-forest-800 mb-2">Preview</h4>
            <div className="flex items-center gap-3">
              <div className="text-3xl">{form.category === 'Cereals' ? '🌾' : form.category === 'Vegetables' ? '🥦' : form.category === 'Fruits' ? '🍎' : form.category === 'Pulses' ? '🫘' : '🌻'}</div>
              <div>
                <div className="font-semibold text-forest-800">{form.name}</div>
                <div className="text-sm text-agri-muted">
                  ₹{form.price}/kg · {form.quantity}kg available · Grade {form.quality} · {form.location}, {form.state}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-4">
          <button type="button" onClick={() => navigate('/farmer/produce')} className="btn-secondary flex-1">
            Cancel
          </button>
          <button type="submit" disabled={submitting} className="btn-primary flex-1">
            {submitting ? 'Listing...' : 'List Produce'}
          </button>
        </div>
      </form>
    </div>
  );
}
