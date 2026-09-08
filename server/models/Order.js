const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    productName: { type: String, required: true },
    farmerName: { type: String },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true },
    subtotal: { type: Number, required: true },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema({
  orderId: { type: String, unique: true, sparse: true },
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  buyerName: { type: String },
  buyerType: { type: String, enum: ['consumer', 'bulk_buyer'] },
  deliveryLocation: { type: String, required: true },
  deliveryState: { type: String },
  items: [orderItemSchema],
  totalAmount: { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'ready_for_pickup', 'in_transit', 'delivered'],
    default: 'pending',
  },
  paymentStatus: { type: String, enum: ['pending', 'paid'], default: 'pending' },
  notes: { type: String },
  estimatedDelivery: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

orderSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

orderSchema.index({ status: 1, createdAt: -1 });
orderSchema.index({ buyer: 1 });

module.exports = mongoose.model('Order', orderSchema);
