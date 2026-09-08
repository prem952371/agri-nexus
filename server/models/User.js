const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Name is required'], trim: true },
  role: {
    type: String,
    enum: ['farmer', 'consumer', 'bulk_buyer', 'logistics', 'admin'],
    required: [true, 'Role is required'],
  },
  location: { type: String, trim: true },
  state: { type: String, trim: true },
  phone: { type: String, trim: true },
  email: { type: String, trim: true, lowercase: true },
  farmName: { type: String, trim: true },
  fpoName: { type: String, trim: true },
  farmerType: { type: String, enum: ['Individual', 'FPO'], default: 'Individual' },
  totalSales: { type: Number, default: 0 },
  totalOrders: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);
