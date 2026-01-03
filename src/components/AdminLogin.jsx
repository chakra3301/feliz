import { useState } from 'react'
import './AdminLogin.css'

const AdminLogin = ({ onLogin }) => {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  // Simple password authentication - in production, use proper auth
  const handleSubmit = (e) => {
    e.preventDefault()
    if (password === 'admin123') {
      setError('')
      onLogin()
    } else {
      setError('Incorrect password')
      setPassword('')
    }
  }

  return (
    <div className="admin-login">
      <div className="admin-login-container">
        <h1>Admin Dashboard</h1>
        <p className="admin-login-subtitle">Enter password to access</p>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="admin-login-input"
            autoFocus
          />
          {error && <p className="admin-login-error">{error}</p>}
          <button type="submit" className="admin-login-button">
            Login
          </button>
        </form>
        <p className="admin-login-hint">Default password: admin123</p>
      </div>
    </div>
  )
}

export default AdminLogin

