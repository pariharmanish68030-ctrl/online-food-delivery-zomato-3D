import express from 'express';
import { generateToken } from '../utils/generateToken.js';
import { initialUsers } from '../utils/seedData.js';

const router = express.Router();
let users = [...initialUsers];

// Customer Register
router.post('/customer/register', (req, res) => {
  const { name, email, password, phone } = req.body;
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ error: 'User already exists with this email' });
  }

  const newUser = {
    id: `usr-${Date.now()}`,
    name,
    email,
    password,
    role: 'customer',
    phone: phone || '',
    addresses: [],
  };
  users.push(newUser);

  const token = generateToken(newUser.id, 'customer');
  res.status(201).json({
    success: true,
    user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role, token },
  });
});

// Customer Login
router.post('/customer/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.role === 'customer');
  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'Invalid customer credentials' });
  }

  const token = generateToken(user.id, 'customer');
  res.json({
    success: true,
    user: { id: user.id, name: user.name, email: user.email, role: user.role, token },
  });
});

// Admin Register
router.post('/admin/register', (req, res) => {
  const { name, email, password, adminKey } = req.body;
  if (adminKey !== 'ZOMATO_ADMIN_KEY') {
    return res.status(403).json({ error: 'Invalid Secret Admin Key! Access Denied.' });
  }

  const newAdmin = {
    id: `admin-${Date.now()}`,
    name,
    email,
    password,
    role: 'admin',
  };
  users.push(newAdmin);

  const token = generateToken(newAdmin.id, 'admin');
  res.status(201).json({
    success: true,
    user: { id: newAdmin.id, name: newAdmin.name, email: newAdmin.email, role: newAdmin.role, token },
  });
});

// Admin Login
router.post('/admin/login', (req, res) => {
  const { email, password } = req.body;
  const admin = users.find(u => u.email === email && u.role === 'admin');
  if (!admin || admin.password !== password) {
    return res.status(401).json({ error: 'Invalid admin credentials' });
  }

  const token = generateToken(admin.id, 'admin');
  res.json({
    success: true,
    user: { id: admin.id, name: admin.name, email: admin.email, role: admin.role, token },
  });
});

export default router;
