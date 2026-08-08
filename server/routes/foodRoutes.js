import express from 'express';
import { initialFoodItems } from '../utils/seedData.js';

const router = express.Router();
export let foodItems = [...initialFoodItems];

// Get all food items with category and search filter
router.get('/', (req, res) => {
  const { category, search } = req.query;
  let result = [...foodItems];

  if (category && category !== 'All') {
    result = result.filter(item => item.category.toLowerCase() === category.toLowerCase());
  }

  if (search) {
    const q = search.toLowerCase();
    result = result.filter(item => item.name.toLowerCase().includes(q) || item.description.toLowerCase().includes(q));
  }

  res.json(result);
});

// Add food item
router.post('/', (req, res) => {
  const newItem = {
    id: `food-${Date.now()}`,
    ...req.body,
    rating: req.body.rating || 4.9,
    isAvailable: req.body.isAvailable !== undefined ? req.body.isAvailable : true,
    tags: req.body.tags || ['Chef Special', 'New'],
  };
  foodItems.unshift(newItem);
  res.status(201).json({ success: true, item: newItem });
});

// Update food item
router.put('/:id', (req, res) => {
  const idx = foodItems.findIndex(f => f.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Food item not found' });
  foodItems[idx] = { ...foodItems[idx], ...req.body };
  res.json({ success: true, item: foodItems[idx] });
});

// Delete food item
router.delete('/:id', (req, res) => {
  foodItems = foodItems.filter(f => f.id !== req.params.id);
  res.json({ success: true, message: 'Item deleted' });
});

export default router;
