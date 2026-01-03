// Vercel serverless function entry point
// This exports the Express app for Vercel's serverless environment

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import checkoutRoutes from '../server/routes/checkout.js';
import webhookRoutes from '../server/routes/webhooks.js';
import ordersRoutes from '../server/routes/orders.js';
import productsRoutes from '../server/routes/products.js';
import { supabase } from '../server/config/supabase.js';
import { rateLimiter } from '../server/middleware/rateLimiter.js';

dotenv.config();

// Validate required environment variables (don't exit in serverless)
const requiredEnvVars = ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('⚠️  Missing required environment variables:', missingVars.join(', '));
  // In serverless, we can't exit, but we'll log the error
}

const app = express();

// Middleware
const allowedOrigins = process.env.FRONTEND_URL 
  ? process.env.FRONTEND_URL.split(',').map(url => url.trim())
  : ['http://localhost:5173'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Body parser with size limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Webhooks need raw body, so they're handled first
app.use('/api/webhooks', webhookRoutes);

// Apply rate limiting to API routes (except webhooks)
app.use('/api', rateLimiter(15 * 60 * 1000, 100));

// Health check with database connectivity
app.get('/health', async (req, res) => {
  try {
    const { error } = await supabase.from('products').select('id').limit(1);
    if (error) {
      return res.status(503).json({ 
        status: 'unhealthy', 
        database: 'disconnected',
        timestamp: new Date().toISOString() 
      });
    }
    res.json({ 
      status: 'ok', 
      database: 'connected',
      timestamp: new Date().toISOString() 
    });
  } catch (err) {
    res.status(503).json({ 
      status: 'unhealthy', 
      error: err.message,
      timestamp: new Date().toISOString() 
    });
  }
});

// API Routes
app.use('/api/checkout', checkoutRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/products', productsRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  // Ensure we always return JSON, not HTML
  res.status(err.status || 500).json({ 
    error: err.message || 'Internal server error',
    status: err.status || 500,
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler - ensure JSON response
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.path,
    method: req.method
  });
});

// Export app for Vercel serverless functions
export default app;

