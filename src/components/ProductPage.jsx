import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import './ProductPage.css'

const ProductPage = ({ products, onAddToCart }) => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [selectedSize, setSelectedSize] = useState(null)
  
  const product = products.find(p => p.id === parseInt(id))

  if (!product) {
    return (
      <div className="product-page">
        <div className="product-not-found">
          <p>Product not found</p>
          <button onClick={() => navigate('/')}>Back to Store</button>
        </div>
      </div>
    )
  }

  const handleAddToCart = () => {
    if (product.sizes && !selectedSize) {
      alert('Please select a size')
      return
    }
    
    // Find the variant ID for the selected size
    let variantId = null
    if (product.variants && selectedSize) {
      const variant = product.variants.find(v => v.size === selectedSize)
      variantId = variant?.id
    } else if (product.variants && product.variants.length === 1) {
      // Only one variant, use it
      variantId = product.variants[0].id
    } else if (product.variantId) {
      // Product already has a variantId
      variantId = product.variantId
    }
    
    onAddToCart(product, selectedSize, variantId)
  }

  return (
    <div className="product-page">
      <div className="page-title">
        <h1>{product.name}</h1>
      </div>
      <div className="product-page-container">
        <div className="product-image-section">
          <img 
            src={product.image} 
            alt={product.name}
            className="product-hero-image"
          />
        </div>
        
        <div className="product-details-section">
          <h1 className="product-page-name">{product.name}</h1>
          <p className="product-page-price">${product.price}</p>
          
          {product.description && (
            <p className="product-description">{product.description}</p>
          )}

          {product.sizes && (
            <div className="size-selector">
              <label className="size-label">Size</label>
              <div className="size-options">
                {product.sizes.map(size => (
                  <button
                    key={size}
                    className={`size-option ${selectedSize === size ? 'selected' : ''}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button 
            className="add-to-cart-cta"
            onClick={handleAddToCart}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductPage

