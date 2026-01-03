import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import ProductGrid from './components/ProductGrid'
import ProductPage from './components/ProductPage'
import Cart from './components/Cart'
import Footer from './components/Footer'
import AdminLogin from './components/AdminLogin'
import AdminDashboard from './components/AdminDashboard'
import CheckoutSuccess from './pages/CheckoutSuccess'
import CheckoutCancel from './pages/CheckoutCancel'
import NotFound from './pages/NotFound'
import ErrorBoundary from './components/ErrorBoundary'
import { products } from './data/products'
import nuggetImage from '../assets/nugget.png'
import jewImage from '../assets/jew.png'
import './App.css'

function App() {
  const [cart, setCart] = useState([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [isNuggetShaking, setIsNuggetShaking] = useState(false)
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false)

  const playBurpSound = () => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      // Create a burp-like sound with frequency modulation
      oscillator.type = 'sawtooth'
      oscillator.frequency.setValueAtTime(80, audioContext.currentTime)
      oscillator.frequency.exponentialRampToValueAtTime(40, audioContext.currentTime + 0.1)
      oscillator.frequency.exponentialRampToValueAtTime(60, audioContext.currentTime + 0.2)
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)
      
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.3)
    } catch (error) {
      console.error('Error playing burp sound:', error)
    }
  }

  const handleNuggetClick = () => {
    setIsNuggetShaking(true)
    playBurpSound()
    setTimeout(() => {
      setIsNuggetShaking(false)
    }, 500)
  }

  const addToCart = (product, size = null) => {
    const cartItem = {
      id: `${product.id}-${size || 'default'}`,
      product,
      size,
      quantity: 1
    }
    
    setCart(prevCart => {
      const existingItem = prevCart.find(item => 
        item.product.id === product.id && item.size === size
      )
      
      if (existingItem) {
        return prevCart.map(item =>
          item.id === cartItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      
      return [...prevCart, cartItem]
    })
  }

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId)
      return
    }
    
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    )
  }

  const removeFromCart = (itemId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== itemId))
  }

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <ErrorBoundary>
      <Router>
        <div className="app">
          <Header 
            cartItemCount={cartItemCount}
            onCartClick={() => setIsCartOpen(true)}
            selectedCategory={selectedCategory}
            onCategorySelect={setSelectedCategory}
          />
          
          <main className="main-content">
            <Routes>
              <Route 
                path="/" 
                element={
                  <ProductGrid 
                    products={products}
                    selectedCategory={selectedCategory}
                    onAddToCart={addToCart}
                  />
                } 
              />
              <Route 
                path="/product/:id" 
                element={
                  <ProductPage 
                    products={products}
                    onAddToCart={addToCart}
                  />
                } 
              />
              <Route 
                path="/admin" 
                element={
                  isAdminLoggedIn ? (
                    <AdminDashboard onLogout={() => setIsAdminLoggedIn(false)} />
                  ) : (
                    <AdminLogin onLogin={() => setIsAdminLoggedIn(true)} />
                  )
                } 
              />
              <Route 
                path="/checkout/success" 
                element={<CheckoutSuccess />} 
              />
              <Route 
                path="/checkout/cancel" 
                element={<CheckoutCancel />} 
              />
              <Route 
                path="*" 
                element={<NotFound />} 
              />
            </Routes>
          </main>

        <Footer />

        <Cart
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          cart={cart}
          onUpdateQuantity={updateQuantity}
          onRemoveItem={removeFromCart}
        />

        <div className="nugget-peek" onClick={handleNuggetClick}>
          <img 
            src={nuggetImage} 
            alt="Nugget" 
            className={`nugget-image ${isNuggetShaking ? 'shake' : ''}`}
          />
        </div>

        <div className="jew-peek">
          <div className="speech-bubble">
            <p>give me your sheckles</p>
          </div>
          <img src={jewImage} alt="Jew" className="jew-image" />
        </div>
      </div>
    </Router>
  )
}

export default App

