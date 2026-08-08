import express from 'express';
import { initialOrders } from '../utils/seedData.js';

const router = express.Router();
export let orders = [...initialOrders];

// Get orders
router.get('/', (req, res) => {
  const { customerEmail } = req.query;
  if (customerEmail) {
    return res.json(orders.filter(o => o.customerEmail === customerEmail));
  }
  res.json(orders);
});

// Create new order
router.post('/', (req, res) => {
  const newOrder = {
    id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
    txnId: req.body.txnId || `TXN-${Math.floor(10000000 + Math.random() * 90000000)}`,
    ...req.body,
    orderStatus: 'Placed',
    createdAt: new Date().toISOString(),
  };
  orders.unshift(newOrder);
  res.status(201).json({ success: true, order: newOrder });
});

// Get order by ID
router.get('/:id', (req, res) => {
  const order = orders.find(o => o.id === req.params.id);
  if (!order) return res.status(404).json({ success: false, error: 'Order not found' });
  res.json({ success: true, order });
});

// Live GPS Tracking Endpoint
router.get('/:id/live-tracking', (req, res) => {
  const order = orders.find(o => o.id === req.params.id);
  if (!order) return res.status(404).json({ success: false, error: 'Order not found' });

  // Calculate live rider GPS position between kitchen (Haldwani center) and customer lat/lng
  const kitchenLat = 29.2183;
  const kitchenLng = 79.5130;
  const destLat = order.lat || 29.2250;
  const destLng = order.lng || 79.5200;

  // Simulate rider movement based on time elapsed since order creation
  const elapsedMinutes = (Date.now() - new Date(order.createdAt).getTime()) / (1000 * 60);
  const progressPercent = Math.min(Math.max(Math.floor((elapsedMinutes / 15) * 100), 15), 95);

  const currentLat = kitchenLat + (destLat - kitchenLat) * (progressPercent / 100);
  const currentLng = kitchenLng + (destLng - kitchenLng) * (progressPercent / 100);
  const remainingDistanceKm = Math.max((2.5 * (1 - progressPercent / 100)).toFixed(1), 0.3);
  const remainingEtaMins = Math.max(Math.ceil(15 * (1 - progressPercent / 100)), 2);

  res.json({
    success: true,
    orderId: order.id,
    orderStatus: order.orderStatus,
    rider: {
      name: 'Ramesh Kumar',
      phone: '+91 98765 43210',
      rating: 4.9,
      vehicleNumber: 'UK-04-AB-8921',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    },
    location: {
      kitchen: { lat: kitchenLat, lng: kitchenLng, name: 'Zomato Cloud Kitchen Haldwani' },
      destination: { lat: destLat, lng: destLng, address: order.address },
      riderCurrent: { lat: currentLat, lng: currentLng },
      progressPercent,
      remainingDistanceKm,
      remainingEtaMins,
    },
  });
});

// Update order status
router.put('/:id/status', (req, res) => {
  const { status } = req.body;
  const order = orders.find(o => o.id === req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  order.orderStatus = status;
  res.json({ success: true, order });
});

export default router;
