const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema({
  deliveryId: { type: String, unique: true, sparse: true },
  orderIds: { type: [String], default: [] },
  origin: { type: String, required: true, trim: true },
  destination: { type: String, required: true, trim: true },
  distance: { type: Number, default: 0 },
  estimatedCost: { type: Number, default: 0 },
  optimizedCost: { type: Number, default: 0 },
  savings: { type: Number, default: 0 },
  status: { type: String, enum: ['scheduled', 'in_transit', 'delivered'], default: 'scheduled' },
  driver: { type: String, trim: true },
  vehicle: { type: String, trim: true },
  departureTime: { type: Date },
  estimatedArrival: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Delivery', deliverySchema);
