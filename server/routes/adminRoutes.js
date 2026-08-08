import express from 'express';
import { orders } from './orderRoutes.js';
import { foodItems } from './foodRoutes.js';
import { locationZones } from './locationRoutes.js';

const router = express.Router();

// Admin Statistics Overview
router.get('/stats', (req, res) => {
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const activeOrders = orders.filter(o => o.orderStatus !== 'Delivered' && o.orderStatus !== 'Cancelled').length;

  res.json({
    totalRevenue,
    activeOrders,
    totalOrders: orders.length,
    totalFoodItems: foodItems.length,
    totalLocations: locationZones.length,
  });
});

export default router;
