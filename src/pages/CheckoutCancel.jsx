import { Link } from 'react-router-dom'
import './CheckoutCancel.css'

const CheckoutCancel = () => {
  return (
    <div className="checkout-cancel">
      <div className="checkout-cancel-container">
        <div className="cancel-icon">✕</div>
        <h1>Checkout Cancelled</h1>
        <p className="cancel-message">
          Your checkout was cancelled. No charges have been made.
        </p>
        <p className="cancel-note">
          Your items are still in your cart if you'd like to try again.
        </p>
        <div className="cancel-actions">
          <Link to="/" className="continue-shopping-button">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}

export default CheckoutCancel


