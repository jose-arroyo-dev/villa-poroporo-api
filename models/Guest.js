const mongoose = require('mongoose');

const guestSchema = new mongoose.Schema({
  name: { type: String, trim: true },
  email: { type: String, trim: true, lowercase: true },
  checkin: { type: Date },
  checkout: { type: Date },
  nights: { type: Number }
}, { timestamps: { createdAt: 'created_at', updatedAt: false } });

guestSchema.index({ email: 1 }, { unique: true }); // índice único para acelerar búsquedas y validar duplicados por email

module.exports = mongoose.model('Guest', guestSchema);