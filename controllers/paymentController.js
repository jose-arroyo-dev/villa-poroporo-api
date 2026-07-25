const Payment = require('../models/Payment');

// GET /api/payments?status=Completed&minTotal=100&maxTotal=600
exports.getPayments = async (req, res) => {
  try {
    const filter = {};

    if (req.query.status) {
      filter.status = req.query.status;
    }

    if (req.query.minTotal || req.query.maxTotal) {
      filter.total = {};
      if (req.query.minTotal) filter.total.$gte = Number(req.query.minTotal);
      if (req.query.maxTotal) filter.total.$lte = Number(req.query.maxTotal);
    }

    const payments = await Payment.find(filter)
      .populate('order_id')
      .populate('guest_id')
      .sort({ created_at: -1 });

    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('order_id')
      .populate('guest_id');
    if (!payment) return res.status(404).json({ error: 'Pago no encontrado' });
    res.json(payment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST /api/payments
// Body de ejemplo:
// {
//   "order_id": "...", "guest_id": "...", "name": "...", "email": "...",
//   "total": 500, "method": "card", "last4": "4242",
//   "items": [{ "item_name": "Depósito", "item_price": 200 }]
// }
exports.createPayment = async (req, res) => {
  try {
    const payment = new Payment(req.body);
    await payment.save();
    res.status(201).json(payment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updatePayment = async (req, res) => {
  try {
    const payment = await Payment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!payment) return res.status(404).json({ error: 'Pago no encontrado' });
    res.json(payment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deletePayment = async (req, res) => {
  try {
    const payment = await Payment.findByIdAndDelete(req.params.id);
    if (!payment) return res.status(404).json({ error: 'Pago no encontrado' });
    res.json({ message: 'Pago eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Bonus: agregar un item a un pago existente sin reemplazar todo el array
// POST /api/payments/:id/items
exports.addPaymentItem = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ error: 'Pago no encontrado' });
    payment.items.push(req.body); // { item_name, item_price }
    await payment.save();
    res.status(201).json(payment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};