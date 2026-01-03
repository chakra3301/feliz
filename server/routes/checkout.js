import express from 'express';
import { stripe, isStripeConfigured } from '../config/stripe.js';

const router = express.Router();

/**
 * Create Stripe Checkout Session
 * POST /api/checkout/create-session
 * 
 * Body: {
 *   items: [{ priceId, quantity }],
 *   successUrl: string,
 *   cancelUrl: string
 * }
 * 
 * Note: priceId is the Stripe Price ID (e.g., 'price_1234567890')
 */
router.post('/create-session', async (req, res) => {
  try {
    // Check if Stripe is configured
    if (!isStripeConfigured) {
      return res.status(503).json({ 
        error: 'Stripe is not configured. Please set STRIPE_SECRET_KEY in environment variables.',
        stripeConfigured: false
      });
    }

    const { items, successUrl, cancelUrl } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Items array is required' });
    }

    // Validate price IDs
    const priceIds = items.map(item => item.priceId).filter(Boolean);
    if (priceIds.length === 0) {
      return res.status(400).json({ 
        error: 'Valid Stripe Price IDs are required',
        hint: 'Each item must have a priceId field (e.g., "price_1234567890")'
      });
    }

    console.log('Creating checkout session with items:', items);

    // Build line items for Stripe using Price IDs
    const lineItems = items.map(item => ({
      price: item.priceId, // Stripe Price ID
      quantity: item.quantity || 1
    }));

    // Create metadata from items (optional, for tracking)
    const metadata = {
      itemCount: items.length.toString(),
      items: JSON.stringify(items.map(item => ({
        priceId: item.priceId,
        quantity: item.quantity
      })))
    };

    // Create Stripe Checkout Session
    console.log('Creating Stripe checkout session with', lineItems.length, 'items');
    
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: 'payment',
        success_url: successUrl || `${process.env.FRONTEND_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: cancelUrl || `${process.env.FRONTEND_URL}/checkout/cancel`,
        shipping_address_collection: {
          allowed_countries: ['US', 'CA'], // Add more countries as needed
        },
        metadata: metadata,
        // Enable automatic tax calculation if needed
        // automatic_tax: { enabled: true },
      });

      console.log('Stripe session created:', session.id);

      res.json({ 
        sessionId: session.id,
        url: session.url 
      });
    } catch (stripeError) {
      console.error('Stripe API error:', stripeError);
      return res.status(500).json({ 
        error: 'Failed to create Stripe checkout session',
        message: stripeError.message,
        type: stripeError.type,
        hint: 'Check your Stripe API key and that the Price IDs are valid'
      });
    }

  } catch (error) {
    console.error('Error creating checkout session:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      error: 'Failed to create checkout session',
      message: error.message,
      hint: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

export default router;

