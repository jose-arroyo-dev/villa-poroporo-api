const Guest = require('../models/Guest');

// GET /api/guests?name=juan
exports.getGuests = async (req, res) => {
  try {
    const filter = {};

    if (req.query.name) {
      filter.name = { $regex: req.query.name, $options: 'i' }; // búsqueda insensible a mayúsculas
    }

    const guests = await Guest.find(filter).sort({ created_at: -1 });
    res.json(guests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /api/guests/:id
exports.getGuestById = async (req, res) => {
  try {
    const guest = await Guest.findById(req.params.id);
    if (!guest) return res.status(404).json({ error: 'Huésped no encontrado' });
    res.json(guest);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST /api/guests
exports.createGuest = async (req, res) => {
  try {
    const guest = new Guest(req.body);
    await guest.save();
    res.status(201).json(guest);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// PUT /api/guests/:id
exports.updateGuest = async (req, res) => {
  try {
    const guest = await Guest.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!guest) return res.status(404).json({ error: 'Huésped no encontrado' });
    res.json(guest);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// DELETE /api/guests/:id
exports.deleteGuest = async (req, res) => {
  try {
    const guest = await Guest.findByIdAndDelete(req.params.id);
    if (!guest) return res.status(404).json({ error: 'Huésped no encontrado' });
    res.json({ message: 'Huésped eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};