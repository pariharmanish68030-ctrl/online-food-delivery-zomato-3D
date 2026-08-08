import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import foodRoutes from './routes/foodRoutes.js';
import locationRoutes from './routes/locationRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();

// Connect to MongoDB Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5001;

// Root landing endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Zomato 3D MERN Server is running successfully!',
    endpoints: {
      health: '/api/health',
      food: '/api/food',
      locations: '/api/locations',
      auth: '/api/auth',
      orders: '/api/orders'
    }
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Zomato 3D Modular Enterprise MERN API Server Active',
    timestamp: new Date().toISOString(),
  });
});

// Mount Modular API Routes
app.use('/api/auth', authRoutes);
app.use('/api/food', foodRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/location', locationRoutes); // for /api/location/detect
app.use('/api/orders', orderRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/admin', adminRoutes);

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Zomato 3D Enterprise MERN API Server running on port ${PORT}`);
});
