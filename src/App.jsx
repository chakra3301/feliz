import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import ProductGrid from './components/ProductGrid'
import ProductPage from './components/ProductPage'
import Cart from './components/Cart'
import Footer from './components/Footer'
import { products } from './data/products'
import nuggetImage from '../assets/nugget.png'
import jewImage from '../assets/jew.png'
import './App.css'

function App() {
  const [cart, setCart] = useState([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(null)

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

        <div className="nugget-peek">
          <img src={nuggetImage} alt="Nugget" className="nugget-image" />
        </div>

        <div className="jew-peek">
          <img src={jewImage} alt="Jew" className="jew-image" />
        </div>
      </div>
    </Router>
  )
}

export default App

