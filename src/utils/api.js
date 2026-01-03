// API utility functions for communicating with backend

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

/**
 * Create Stripe checkout session
 * @param {Array} items - Array of { variantId, quantity }
 * @returns {Promise} Checkout session data
 */
export async function createCheckoutSession(items) {
  const response = await fetch(`${API_BASE_URL}/checkout/create-session`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      items,
      successUrl: `${window.location.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${window.location.origin}/checkout/cancel`,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create checkout session');
  }

  return response.json();
}

/**
 * Get all orders
 * @param {Object} params - Query parameters (status, limit, offset)
 * @returns {Promise} Orders array
 */
export async function getOrders(params = {}) {
  const queryString = new URLSearchParams(params).toString();
  const response = await fetch(`${API_BASE_URL}/orders${queryString ? `?${queryString}` : ''}`);

  if (!response.ok) {
    throw new Error('Failed to fetch orders');
  }

  return response.json();
}

/**
 * Get single order by ID
 * @param {number} orderId
 * @returns {Promise} Order object
 */
export async function getOrder(orderId) {
  const response = await fetch(`${API_BASE_URL}/orders/${orderId}`);

  if (!response.ok) {
    throw new Error('Failed to fetch order');
  }

  return response.json();
}

/**
 * Update order status
 * @param {number} orderId
 * @param {Object} updates - { order_status, payment_status }
 * @returns {Promise} Updated order
 */
export async function updateOrder(orderId, updates) {
  const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    throw new Error('Failed to update order');
  }

  return response.json();
}

/**
 * Get low stock items
 * @param {number} threshold - Stock threshold (default: 10)
 * @returns {Promise} Low stock variants array
 */
export async function getLowStockItems(threshold = 10) {
  const response = await fetch(`${API_BASE_URL}/products/low-stock?threshold=${threshold}`);

  if (!response.ok) {
    throw new Error('Failed to fetch low stock items');
  }

  return response.json();
}

