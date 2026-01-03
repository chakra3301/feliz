import { useState, useEffect } from 'react'
import { getOrders, updateOrder } from '../utils/api'
import './OrdersTable.css'

const OrdersTable = () => {
  const [orderList, setOrderList] = useState([])
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async () => {
    try {
      setLoading(true)
      const orders = await getOrders()
      setOrderList(orders)
      setError(null)
    } catch (err) {
      console.error('Error loading orders:', err)
      setError('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  const filteredOrders = filter === 'all' 
    ? orderList 
    : orderList.filter(order => order.order_status === filter)

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrder(orderId, { order_status: newStatus })
      // Reload orders to get updated data
      await loadOrders()
    } catch (err) {
      console.error('Error updating order:', err)
      alert('Failed to update order status')
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatPrice = (cents) => {
    return `$${(cents / 100).toFixed(2)}`
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
      case 'completed':
        return 'status-completed'
      case 'pending':
        return 'status-pending'
      case 'shipped':
      case 'processing':
        return 'status-shipped'
      case 'cancelled':
        return 'status-cancelled'
      default:
        return ''
    }
  }

  return (
    <div className="orders-table-container">
      <div className="orders-header">
        <h2>Orders</h2>
        <div className="orders-filters">
          <button
            className={`filter-button ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button
            className={`filter-button ${filter === 'pending' ? 'active' : ''}`}
            onClick={() => setFilter('pending')}
          >
            Pending
          </button>
          <button
            className={`filter-button ${filter === 'shipped' ? 'active' : ''}`}
            onClick={() => setFilter('shipped')}
          >
            Shipped
          </button>
          <button
            className={`filter-button ${filter === 'completed' ? 'active' : ''}`}
            onClick={() => setFilter('completed')}
          >
            Completed
          </button>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Date</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="no-orders">
                  Loading orders...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="7" className="no-orders">
                  {error}
                </td>
              </tr>
            ) : filteredOrders.length === 0 ? (
              <tr>
                <td colSpan="7" className="no-orders">
                  No orders found
                </td>
              </tr>
            ) : (
              filteredOrders.map(order => (
                <tr key={order.id}>
                  <td className="order-id">{order.id}</td>
                  <td>{formatDate(order.created_at)}</td>
                  <td>
                    <div className="customer-info">
                      <div className="customer-name">{order.customer_name || 'N/A'}</div>
                      <div className="customer-email">{order.customer_email}</div>
                    </div>
                  </td>
                  <td>
                    <div className="order-items">
                      {order.order_items && order.order_items.length > 0 ? (
                        order.order_items.map((item, idx) => (
                          <div key={idx} className="order-item">
                            {item.quantity}x {item.product_name}
                            {item.size && <span className="item-size"> ({item.size})</span>}
                          </div>
                        ))
                      ) : (
                        <span className="no-items">No items</span>
                      )}
                    </div>
                  </td>
                  <td className="order-total">{formatPrice(order.total_amount)}</td>
                  <td>
                    <span className={`status-badge ${getStatusColor(order.order_status)}`}>
                      {order.order_status}
                    </span>
                    <br />
                    <span className={`status-badge ${getStatusColor(order.payment_status)}`} style={{ marginTop: '0.25rem', fontSize: '0.7rem' }}>
                      {order.payment_status}
                    </span>
                  </td>
                  <td>
                    <select
                      value={order.order_status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className="status-select"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default OrdersTable

