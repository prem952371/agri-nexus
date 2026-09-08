const mongoose = require('mongoose');

const historicalSalesSchema = new mongoose.Schema({
  product: { type: String, required: true, trim: true },
  location: { type: String, required: true, trim: true },
  date: { type: Date, required: true },
  quantitySold: { type: Number, required: true, min: 0 },
  price: { type: Number, required: true, min: 0 },
  category: { type: String, trim: true },
});

historicalSalesSchema.index({ product: 1, location: 1, date: -1 });

module.exports = mongoose.model('HistoricalSales', historicalSalesSchema);
