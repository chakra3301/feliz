import { useState, useEffect } from 'react'
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
import { getProducts } from './utils/api'
import { products as fallbackProducts } from './data/products'
import nuggetImage from '../assets/nugget.png'
import jewImage from '../assets/jew.png'
import './App.css'

function App() {
  const [cart, setCart] = useState([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [isNuggetShaking, setIsNuggetShaking] = useState(false)
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false)
  const [products, setProducts] = useState(fallbackProducts)
  const [isLoadingProducts, setIsLoadingProducts] = useState(true)

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

  // Fetch products from API on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoadingProducts(true)
        const apiProducts = await getProducts()
        
        // Transform API products to match frontend format
        const transformedProducts = apiProducts.map(product => {
          const variants = product.product_variants || []
          const sizes = variants
            .map(v => v.size)
            .filter(Boolean)
            .filter((size, index, self) => self.indexOf(size) === index) // unique sizes
          
          // Get the first variant's price (or calculate min/max)
          const prices = variants.map(v => v.price / 100) // Convert cents to dollars
          const minPrice = prices.length > 0 ? Math.min(...prices) : 0
          
          // Use first variant's image or fallback
          const imageUrl = product.image_url || '/tshit.png'
          
          return {
            id: product.id,
            name: product.name,
            category: product.category,
            price: minPrice,
            image: imageUrl,
            description: product.description,
            sizes: sizes.length > 0 ? sizes : undefined,
            variants: variants.map(v => ({
              id: v.id,
              size: v.size,
              price: v.price / 100, // Convert cents to dollars
              stockCount: v.stock_count,
              sku: v.sku
            }))
          }
        })
        
        setProducts(transformedProducts)
      } catch (error) {
        console.error('Error fetching products:', error)
        // Use fallback products if API fails
        setProducts(fallbackProducts)
      } finally {
        setIsLoadingProducts(false)
      }
    }
    
    fetchProducts()
  }, [])

  const handleNuggetClick = () => {
    setIsNuggetShaking(true)
    playBurpSound()
    setTimeout(() => {
      setIsNuggetShaking(false)
    }, 500)
  }

  const addToCart = (product, size = null, variantId = null) => {
    // Find the variant ID if not provided
    let selectedVariantId = variantId
    if (!selectedVariantId && product.variants) {
      if (size) {
        // Find variant by size
        const variant = product.variants.find(v => v.size === size)
        selectedVariantId = variant?.id
      } else if (product.variants.length === 1) {
        // Only one variant, use it
        selectedVariantId = product.variants[0].id
      } else {
        // Use first variant as fallback
        selectedVariantId = product.variants[0]?.id
      }
    }
    
    // Fallback to product.id if no variant found (for backward compatibility)
    if (!selectedVariantId) {
      selectedVariantId = product.id
    }
    
    const cartItem = {
      id: `${product.id}-${size || selectedVariantId || 'default'}`,
      product: {
        ...product,
        variantId: selectedVariantId
      },
      size,
      variantId: selectedVariantId,
      quantity: 1
    }
    
    setCart(prevCart => {
      const existingItem = prevCart.find(item => 
        item.product.id === product.id && 
        item.size === size &&
        item.variantId === selectedVariantId
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
            {isLoadingProducts ? (
              <div style={{ padding: '2rem', textAlign: 'center' }}>
                <p>Loading products...</p>
              </div>
            ) : (
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
            )}
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
    </ErrorBoundary>
  )
}

export default App

