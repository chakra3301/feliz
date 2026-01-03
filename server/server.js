import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import checkoutRoutes from './routes/checkout.js';
import webhookRoutes from './routes/webhooks.js';
import { rateLimiter } from './middleware/rateLimiter.js';

dotenv.config();

// No database required - only Stripe is needed

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
const allowedOrigins = process.env.FRONTEND_URL 
  ? process.env.FRONTEND_URL.split(',').map(url => url.trim())
  : ['http://localhost:5173'];

// Helper function to normalize URLs (handle www/non-www)
function normalizeOrigin(origin) {
  if (!origin) return null;
  // Remove www. prefix for comparison
  return origin.replace(/^https?:\/\/(www\.)?/, '');
}

// Expand allowed origins to include both www and non-www versions
const expandedOrigins = new Set();
allowedOrigins.forEach(url => {
  expandedOrigins.add(url);
  // Add www version if not present
  if (url.includes('://') && !url.includes('://www.')) {
    expandedOrigins.add(url.replace(/^(https?:\/\/)(.+)$/, '$1www.$2'));
  }
  // Add non-www version if www is present
  if (url.includes('://www.')) {
    expandedOrigins.add(url.replace(/^(https?:\/\/)www\.(.+)$/, '$1$2'));
  }
});

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    // Check exact match first
    if (expandedOrigins.has(origin)) {
      return callback(null, true);
    }
    
    // Check normalized match (www/non-www)
    const normalizedOrigin = normalizeOrigin(origin);
    const isAllowed = Array.from(expandedOrigins).some(allowed => {
      return normalizeOrigin(allowed) === normalizedOrigin;
    });
    
    if (isAllowed || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      console.warn('CORS blocked origin:', origin, 'Allowed origins:', Array.from(expandedOrigins));
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser with size limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Body parser for JSON (except webhooks which need raw body)
// Webhooks need raw body, so they're handled first
app.use('/api/webhooks', webhookRoutes);

// Apply rate limiting to API routes (except webhooks)
app.use('/api', rateLimiter(15 * 60 * 1000, 100)); // 100 requests per 15 minutes

// Health check (no database needed)
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    note: 'Stripe-only mode - no database required'
  });
});

// API Routes
app.use('/api/checkout', checkoutRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Only start server if not in Vercel (serverless) environment
// Vercel will use the exported app from api/index.js
if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📦 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
  });
}

// Export app for Vercel serverless functions
export default app;

