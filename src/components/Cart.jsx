import { useState } from 'react'
import { createCheckoutSession } from '../utils/api'
import './Cart.css'

const Cart = ({ isOpen, onClose, cart, onUpdateQuantity, onRemoveItem }) => {
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState(null)

  const total = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)

  const handleCheckout = async () => {
    if (cart.length === 0) return

    setIsProcessing(true)
    setError(null)

    try {
      // Map cart items to checkout format
      // Note: In production, you'd need to map product IDs to variant IDs
      // For now, we'll use a simplified approach where variantId = productId
      // You'll need to update this based on your actual product/variant structure
      const items = cart.map(item => ({
        variantId: item.product.variantId || item.product.id, // Use variantId if available
        quantity: item.quantity
      }))

      // Create Stripe checkout session
      const response = await createCheckoutSession(items)

      // Check if Stripe is not configured
      if (response.error && !response.stripeConfigured) {
        setError('Payment processing is not yet configured. Please contact support.')
        setIsProcessing(false)
        return
      }

      // Redirect to Stripe Checkout
      if (response.url) {
        window.location.href = response.url
      } else {
        throw new Error('No checkout URL received')
      }
    } catch (err) {
      console.error('Checkout error:', err)
      setError(err.message || 'Failed to start checkout. Please try again.')
      setIsProcessing(false)
    }
  }

  if (!isOpen) return null

  return (
    <>
      <div className="cart-overlay" onClick={onClose}></div>
      <div className="cart-sidebar">
        <div className="cart-header">
          <h2>Cart</h2>
          <button className="cart-close" onClick={onClose} aria-label="Close cart">
            ×
          </button>
        </div>

        <div className="cart-items">
          {cart.length === 0 ? (
            <div className="cart-empty">
              <p>Your cart is empty</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="cart-item">
                <img 
                  src={item.product.image} 
                  alt={item.product.name}
                  className="cart-item-image"
                />
                <div className="cart-item-details">
                  <h3 className="cart-item-name">{item.product.name}</h3>
                  {item.size && (
                    <p className="cart-item-size">Size: {item.size}</p>
                  )}
                  <p className="cart-item-price">${item.product.price}</p>
                </div>
                <div className="cart-item-controls">
                  <div className="quantity-controls">
                    <button 
                      onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                      className="quantity-button"
                    >
                      −
                    </button>
                    <span className="quantity">{item.quantity}</span>
                    <button 
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      className="quantity-button"
                    >
                      +
                    </button>
                  </div>
                  <button 
                    onClick={() => onRemoveItem(item.id)}
                    className="remove-button"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="cart-footer">
            {error && (
              <div className="checkout-error">
                {error}
              </div>
            )}
            <div className="cart-total">
              <span>Total:</span>
              <span className="total-amount">${total.toFixed(2)}</span>
            </div>
            <button 
              className="checkout-button" 
              onClick={handleCheckout}
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : 'Checkout with Stripe'}
            </button>
          </div>
        )}
      </div>
    </>
  )
}

export default Cart

