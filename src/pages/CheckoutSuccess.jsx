import { Link } from 'react-router-dom'
import './CheckoutSuccess.css'

const CheckoutSuccess = () => {
  return (
    <div className="checkout-success">
      <div className="checkout-success-container">
        <div className="success-icon">✓</div>
        <h1>Order Successful!</h1>
        <p className="success-message">
          Thank you for your purchase. Your payment has been processed successfully.
        </p>
        <p className="success-note">
          You will receive an email confirmation shortly with your order details.
        </p>
        <div className="success-actions">
          <Link to="/" className="continue-shopping-button">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}

export default CheckoutSuccess
