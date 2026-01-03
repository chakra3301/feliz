import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Stripe with secret key (if available)
export const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-11-20.acacia',
    })
  : null;

// Check if Stripe is configured
export const isStripeConfigured = !!process.env.STRIPE_SECRET_KEY;

if (!isStripeConfigured) {
  console.warn('⚠️  STRIPE_SECRET_KEY is not set - Stripe features will be disabled');
}

export default stripe;

