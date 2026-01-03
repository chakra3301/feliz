import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import OrdersTable from './OrdersTable'
import ProductsTable from './ProductsTable'
import InventoryManagement from './InventoryManagement'
import { getOrders } from '../utils/api'
import './AdminDashboard.css'

const AdminDashboard = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    completedOrders: 0,
    avgOrderValue: 0,
    recentOrders: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const orders = await getOrders()
      
      const totalOrders = orders.length
      const totalRevenue = orders.reduce((sum, order) => sum + (order.total_amount || 0), 0) / 100
      const pendingOrders = orders.filter(o => o.order_status === 'pending').length
      const completedOrders = orders.filter(o => o.order_status === 'delivered' || o.order_status === 'completed').length
      const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0
      
      // Recent orders (last 7 days)
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
      const recentOrders = orders.filter(o => new Date(o.created_at) >= sevenDaysAgo).length

      setStats({
        totalOrders,
        totalRevenue,
        pendingOrders,
        completedOrders,
        avgOrderValue,
        recentOrders
      })
    } catch (error) {
      console.error('Error loading stats:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <div className="admin-header-actions">
          <Link to="/" className="admin-link">View Store</Link>
          <button onClick={onLogout} className="admin-logout-button">
            Logout
          </button>
        </div>
      </div>

      <div className="admin-nav">
        <button
          className={`admin-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          Dashboard
        </button>
        <button
          className={`admin-nav-item ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          Orders
        </button>
        <button
          className={`admin-nav-item ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          Products
        </button>
        <button
          className={`admin-nav-item ${activeTab === 'inventory' ? 'active' : ''}`}
          onClick={() => setActiveTab('inventory')}
        >
          Inventory
        </button>
      </div>

      <div className="admin-content">
        {activeTab === 'dashboard' && (
          <div className="admin-dashboard-view">
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Total Orders</h3>
                <p className="stat-value">{stats.totalOrders}</p>
              </div>
              <div className="stat-card">
                <h3>Total Revenue</h3>
                <p className="stat-value">${stats.totalRevenue.toFixed(2)}</p>
              </div>
              <div className="stat-card">
                <h3>Pending Orders</h3>
                <p className="stat-value">{stats.pendingOrders}</p>
              </div>
              <div className="stat-card">
                <h3>Completed Orders</h3>
                <p className="stat-value">{stats.completedOrders}</p>
              </div>
              <div className="stat-card">
                <h3>Average Order Value</h3>
                <p className="stat-value">${stats.avgOrderValue.toFixed(2)}</p>
              </div>
              <div className="stat-card">
                <h3>Orders (Last 7 Days)</h3>
                <p className="stat-value">{stats.recentOrders}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'orders' && <OrdersTable />}
        {activeTab === 'products' && <ProductsTable />}
        {activeTab === 'inventory' && <InventoryManagement />}
      </div>
    </div>
  )
}

export default AdminDashboard

