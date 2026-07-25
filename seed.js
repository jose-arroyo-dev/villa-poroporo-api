const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

const Guest = require('./models/Guest');
const Order = require('./models/Order');
const Payment = require('./models/Payment');

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();

    // Limpiar colecciones antes de sembrar (para evitar duplicados si corres el script varias veces)
    await Guest.deleteMany();
    await Order.deleteMany();
    await Payment.deleteMany();
    console.log('🧹 Colecciones limpiadas');

    // 1. Crear 4 guests
    const guests = await Guest.insertMany([
      { name: 'Juan Pérez', email: 'juan@example.com', checkin: '2026-08-01', checkout: '2026-08-05', nights: 4 },
      { name: 'María Rodríguez', email: 'maria@example.com', checkin: '2026-08-10', checkout: '2026-08-14', nights: 4 },
      { name: 'Carlos Jiménez', email: 'carlos@example.com', checkin: '2026-09-02', checkout: '2026-09-06', nights: 4 },
      { name: 'Ana Solano', email: 'ana@example.com', checkin: '2026-09-15', checkout: '2026-09-18', nights: 3 }
    ]);
    console.log(`✅ ${guests.length} guests creados`);

    // 2. Crear 4 orders (uno por cada guest, mismos datos de estadía)
    const orders = await Order.insertMany([
      { name: guests[0].name, email: guests[0].email, checkin: guests[0].checkin, checkout: guests[0].checkout, nights: guests[0].nights, items: 'Villa completa, desayuno incluido', total: 500, status: 'Completed' },
      { name: guests[1].name, email: guests[1].email, checkin: guests[1].checkin, checkout: guests[1].checkout, nights: guests[1].nights, items: 'Villa completa', total: 480, status: 'Completed' },
      { name: guests[2].name, email: guests[2].email, checkin: guests[2].checkin, checkout: guests[2].checkout, nights: guests[2].nights, items: 'Villa completa, servicio de limpieza extra', total: 550, status: 'Pending' },
      { name: guests[3].name, email: guests[3].email, checkin: guests[3].checkin, checkout: guests[3].checkout, nights: guests[3].nights, items: 'Villa completa', total: 360, status: 'Completed' }
    ]);
    console.log(`✅ ${orders.length} orders creadas`);

    // 3. Crear 4 payments, ligados a orders y guests reales, con items embebidos
    const payments = await Payment.insertMany([
      {
        order_id: orders[0]._id,
        guest_id: guests[0]._id,
        name: guests[0].name,
        email: guests[0].email,
        total: 500,
        method: 'card',
        last4: '4242',
        status: 'Completed',
        items: [
          { item_name: 'Depósito', item_price: 200 },
          { item_name: 'Saldo de reserva', item_price: 300 }
        ]
      },
      {
        order_id: orders[1]._id,
        guest_id: guests[1]._id,
        name: guests[1].name,
        email: guests[1].email,
        total: 480,
        method: 'transfer',
        last4: null,
        status: 'Completed',
        items: [
          { item_name: 'Pago completo', item_price: 480 }
        ]
      },
      {
        order_id: orders[2]._id,
        guest_id: guests[2]._id,
        name: guests[2].name,
        email: guests[2].email,
        total: 550,
        method: 'card',
        last4: '1881',
        status: 'Pending',
        items: [
          { item_name: 'Depósito', item_price: 250 },
          { item_name: 'Limpieza extra', item_price: 50 },
          { item_name: 'Saldo pendiente', item_price: 250 }
        ]
      },
      {
        order_id: orders[3]._id,
        guest_id: guests[3]._id,
        name: guests[3].name,
        email: guests[3].email,
        total: 360,
        method: 'cash',
        last4: null,
        status: 'Completed',
        items: [
          { item_name: 'Pago completo en efectivo', item_price: 360 }
        ]
      }
    ]);
    console.log(`✅ ${payments.length} payments creados`);

    console.log('🎉 Seed completado: 12 documentos insertados en total (4 guests + 4 orders + 4 payments)');
    process.exit();
  } catch (error) {
    console.error('❌ Error al sembrar datos:', error);
    process.exit(1);
  }
};

seedData();