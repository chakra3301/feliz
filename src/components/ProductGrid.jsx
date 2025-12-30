import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import ProductCard from './ProductCard'
import './ProductGrid.css'

const ProductGrid = ({ products, selectedCategory, onAddToCart }) => {
  const navigate = useNavigate()

  // Category display mapping
  const categoryDisplayMap = {
    'Clothing': '🤩Clothing🤩',
    'Stickers': '👻Stickers👻',
    'Accessories': '😎Accessories😎'
  }

  const filteredProducts = useMemo(() => {
    if (!selectedCategory) return products
    return products.filter(product => product.category === selectedCategory)
  }, [products, selectedCategory])

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`)
  }

  return (
    <div className="product-grid-container">
        {selectedCategory && (
          <div className="page-title">
            <h1>{categoryDisplayMap[selectedCategory] || selectedCategory}</h1>
          </div>
        )}
        <div className="product-grid">
        {filteredProducts.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            onClick={() => handleProductClick(product.id)}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>
      {filteredProducts.length === 0 && (
        <div className="no-products">
          <p>No products found in this category.</p>
        </div>
      )}
    </div>
  )
}

export default ProductGrid

