const mongoose = require('mongoose');

const paymentItemSchema = new mongoose.Schema({
  item_name: { type: String, required: true },
  item_price: { type: Number, required: true }
}, { _id: true });

const paymentSchema = new mongoose.Schema({
  order_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  guest_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Guest' },
  name: { type: String, trim: true },
  email: { type: String, trim: true, lowercase: true },
  total: { type: Number, required: true },
  method: { type: String },
  last4: { type: String },
  status: { type: String, default: 'Completed' },
  paid_at: { type: Date, default: Date.now },
  items: [paymentItemSchema]
}, { timestamps: { createdAt: 'created_at', updatedAt: false } });

paymentSchema.index({ status: 1 }); // acelera las búsquedas por status
paymentSchema.index({ guest_id: 1 }); // acelera encontrar todos los pagos de un huésped

module.exports = mongoose.model('Payment', paymentSchema);