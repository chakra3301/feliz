import express from 'express';
import { stripe } from '../config/stripe.js';
import { supabase } from '../config/supabase.js';

const router = express.Router();

/**
 * Stripe Webhook Handler
 * POST /api/webhooks/stripe
 * 
 * Handles Stripe webhook events, specifically checkout.session.completed
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
      // Optional: Handle payment intent success
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
 * Creates order in database and decrements stock
 */
async function handleCheckoutCompleted(session) {
  try {
    console.log('Processing checkout session:', session.id);

    // Parse order items from metadata
    const orderItems = JSON.parse(session.metadata.orderItems || '[]');
    
    if (orderItems.length === 0) {
      console.error('No order items found in session metadata');
      return;
    }

    // Calculate total amount
    const totalAmount = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Create order in database
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        stripe_session_id: session.id,
        stripe_payment_intent_id: session.payment_intent,
        customer_email: session.customer_details?.email || session.customer_email,
        customer_name: session.customer_details?.name,
        shipping_address: session.shipping_details?.address || null,
        total_amount: totalAmount,
        currency: session.currency || 'usd',
        payment_status: session.payment_status,
        order_status: 'pending'
      })
      .select()
      .single();

    if (orderError) {
      console.error('Error creating order:', orderError);
      throw orderError;
    }

    console.log('Order created:', order.id);

    // Create order items and decrement stock atomically
    for (const item of orderItems) {
      // Insert order item
      const { error: itemError } = await supabase
        .from('order_items')
        .insert({
          order_id: order.id,
          product_id: item.productId,
          variant_id: item.variantId,
          product_name: item.productName,
          size: item.size,
          sku: item.sku,
          quantity: item.quantity,
          price: item.price
        });

      if (itemError) {
        console.error('Error creating order item:', itemError);
        continue;
      }

      // Decrement stock atomically (prevents overselling)
      // First get current stock
      const { data: currentVariant, error: fetchError } = await supabase
        .from('product_variants')
        .select('stock_count')
        .eq('id', item.variantId)
        .single();

      if (fetchError) {
        console.error('Error fetching variant stock:', fetchError);
        continue;
      }

      const newStock = Math.max(0, currentVariant.stock_count - item.quantity);
      
      const { data: updatedVariant, error: stockError } = await supabase
        .from('product_variants')
        .update({ stock_count: newStock })
        .eq('id', item.variantId)
        .select()
        .single();

      if (stockError) {
        console.error('Error updating stock:', stockError);
      } else {
        console.log(`Stock updated for variant ${item.variantId}: ${updatedVariant.stock_count} remaining`);
      }
    }

    console.log('Checkout processing completed for session:', session.id);

  } catch (error) {
    console.error('Error handling checkout completion:', error);
    // In production, you might want to send an alert or retry
    throw error;
  }
}

export default router;

