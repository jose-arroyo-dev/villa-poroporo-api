const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  name: { type: String, trim: true },
  email: { type: String, trim: true, lowercase: true },
  checkin: { type: Date },
  checkout: { type: Date },
  nights: { type: Number },
  items: { type: String },
  total: { type: Number },
  status: { type: String, default: 'Pending' }
}, { timestamps: { createdAt: 'created_at', updatedAt: false } });

module.exports = mongoose.model('Order', orderSchema);