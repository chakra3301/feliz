import express from 'express';
import { stripe, isStripeConfigured } from '../config/stripe.js';
import { supabase } from '../config/supabase.js';

const router = express.Router();

/**
 * Create Stripe Checkout Session
 * POST /api/checkout/create-session
 * 
 * Body: {
 *   items: [{ productId, variantId, quantity }],
 *   successUrl: string,
 *   cancelUrl: string
 * }
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

    // Fetch product variants from database to get current prices and stock
    const variantIds = items.map(item => item.variantId);
    const { data: variants, error: variantsError } = await supabase
      .from('product_variants')
      .select('*, products(*)')
      .in('id', variantIds);

    if (variantsError) {
      console.error('Error fetching variants:', variantsError);
      return res.status(500).json({ error: 'Failed to fetch product variants' });
    }

    // Build line items for Stripe
    const lineItems = [];
    const metadata = {
      orderItems: JSON.stringify([])
    };

    for (const item of items) {
      const variant = variants.find(v => v.id === item.variantId);
      
      if (!variant) {
        return res.status(400).json({ error: `Variant ${item.variantId} not found` });
      }

      // Check stock availability
      if (variant.stock_count < item.quantity) {
        return res.status(400).json({ 
          error: `Insufficient stock for ${variant.products.name} (${variant.size || 'N/A'}). Available: ${variant.stock_count}` 
        });
      }

      // Add to line items
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: `${variant.products.name}${variant.size ? ` - ${variant.size}` : ''}`,
            description: variant.products.description || '',
            metadata: {
              productId: variant.product_id.toString(),
              variantId: variant.id.toString(),
              sku: variant.sku,
              size: variant.size || ''
            }
          },
          unit_amount: variant.price, // Price in cents
        },
        quantity: item.quantity,
      });

      // Store order item metadata
      metadata.orderItems = JSON.stringify([
        ...JSON.parse(metadata.orderItems),
        {
          productId: variant.product_id,
          variantId: variant.id,
          productName: variant.products.name,
          size: variant.size,
          sku: variant.sku,
          quantity: item.quantity,
          price: variant.price
        }
      ]);
    }

    // Create Stripe Checkout Session
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

    res.json({ 
      sessionId: session.id,
      url: session.url 
    });

  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ 
      error: 'Failed to create checkout session',
      message: error.message 
    });
  }
});

export default router;

