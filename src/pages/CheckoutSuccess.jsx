import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { getOrder } from '../utils/api'
import './CheckoutSuccess.css'

const CheckoutSuccess = () => {
  const [searchParams] = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (sessionId) {
      // In a real app, you'd fetch the order by session_id
      // For now, we'll just show a success message
      setLoading(false)
    } else {
      setLoading(false)
    }
  }, [sessionId])

  if (loading) {
    return (
      <div className="checkout-success">
        <div className="checkout-success-container">
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="checkout-success">
      <div className="checkout-success-container">
        <div className="success-icon">✓</div>
        <h1>Order Successful!</h1>
        <p className="success-message">
          Thank you for your purchase. Your payment has been processed successfully.
        </p>
        {sessionId && (
          <p className="session-id">
            Session ID: <code>{sessionId}</code>
          </p>
        )}
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

