import { useState } from 'react'
import { redirectToCheckout } from '../lib/shopify'
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
      // Redirect to Shopify checkout
      await redirectToCheckout()
    } catch (err) {
      console.error('Checkout error:', err)
      
      let errorMessage = 'Failed to start checkout. Please try again.'
      
      if (err.message.includes('No cart')) {
        errorMessage = 'Your cart is empty. Please add items first.'
      } else if (err.message.includes('credentials')) {
        errorMessage = 'Store configuration error. Please contact support.'
      } else if (err.message) {
        errorMessage = err.message
      }
      
      setError(errorMessage)
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
              {isProcessing ? 'Processing...' : 'Checkout'}
            </button>
          </div>
        )}
      </div>
    </>
  )
}

export default Cart
