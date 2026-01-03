import express from 'express';
import { stripe } from '../config/stripe.js';

const router = express.Router();

/**
 * Stripe Webhook Handler
 * POST /api/webhooks/stripe
 * 
 * Handles Stripe webhook events
 * Note: Without a database, we just log events. Order data is stored in Stripe.
 */
router.post('/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      await handleCheckoutCompleted(event.data.object);
      break;
    
    case 'payment_intent.succeeded':
      console.log('PaymentIntent succeeded:', event.data.object.id);
      break;
    
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  // Return a response to acknowledge receipt of the event
  res.json({ received: true });
});

/**
 * Handle checkout.session.completed event
 * Logs order information (no database storage)
 */
async function handleCheckoutCompleted(session) {
  try {
    console.log('✅ Checkout completed:', {
      sessionId: session.id,
      customerEmail: session.customer_details?.email || session.customer_email,
      customerName: session.customer_details?.name,
      amountTotal: session.amount_total,
      currency: session.currency,
      paymentStatus: session.payment_status
    });

    // You can view all order details in Stripe Dashboard
    // Go to: Payments → Find the payment → View details
    
    // Optional: Send email notification, update external systems, etc.
    // But no database operations needed - Stripe stores everything

  } catch (error) {
    console.error('Error handling checkout completion:', error);
  }
}

export default router;

