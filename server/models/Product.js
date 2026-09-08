const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Product name is required'], trim: true },
  category: {
    type: String,
    enum: ['Cereals', 'Vegetables', 'Fruits', 'Pulses', 'Oilseeds'],
    required: [true, 'Category is required'],
  },
  farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  farmerName: { type: String, required: true, trim: true },
  farmerType: { type: String, enum: ['Individual', 'FPO'], default: 'Individual' },
  location: { type: String, required: true, trim: true },
  state: { type: String, required: true, trim: true },
  quantity: { type: Number, required: true, min: 0 },
  availableQuantity: { type: Number, required: true, min: 0 },
  price: { type: Number, required: true, min: 0 },
  quality: { type: String, enum: ['A', 'B', 'C'], default: 'A' },
  harvestDate: { type: Date },
  availableFrom: { type: Date },
  description: { type: String, trim: true },
  image: { type: String },
  unit: { type: String, default: 'kg' },
  minOrderQuantity: { type: Number, default: 10 },
  deliveryDays: { type: Number, default: 3 },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

productSchema.index({ category: 1, state: 1, isActive: 1 });
productSchema.index({ name: 'text', description: 'text', farmerName: 'text' });

module.exports = mongoose.model('Product', productSchema);
