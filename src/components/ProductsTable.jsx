import { products } from '../data/products'
import { initialInventory } from '../data/inventory'
import './ProductsTable.css'

const ProductsTable = () => {
  const getTotalStock = (productId) => {
    const inventory = initialInventory[productId]
    if (!inventory) return 0
    return Object.values(inventory).reduce((sum, qty) => sum + qty, 0)
  }

  const getLowStockItems = (productId) => {
    const inventory = initialInventory[productId]
    if (!inventory) return []
    return Object.entries(inventory).filter(([size, qty]) => qty < 10)
  }

  return (
    <div className="products-table-container">
      <div className="products-header">
        <h2>Products</h2>
        <div className="products-count">
          {products.length} products
        </div>
      </div>

      <div className="table-wrapper">
        <table className="products-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Sizes</th>
              <th>Total Stock</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => {
              const totalStock = getTotalStock(product.id)
              const lowStock = getLowStockItems(product.id)
              const hasSizes = product.sizes && product.sizes.length > 0

              return (
                <tr key={product.id}>
                  <td className="product-id">{product.id}</td>
                  <td className="product-name">{product.name}</td>
                  <td>
                    <span className="category-badge">{product.category}</span>
                  </td>
                  <td className="product-price">${product.price}</td>
                  <td>
                    {hasSizes ? (
                      <div className="sizes-list">
                        {product.sizes.map(size => (
                          <span key={size} className="size-tag">{size}</span>
                        ))}
                      </div>
                    ) : (
                      <span className="no-sizes">N/A</span>
                    )}
                  </td>
                  <td className="stock-amount">
                    {totalStock > 0 ? (
                      <span className={totalStock < 20 ? 'low-stock' : ''}>
                        {totalStock}
                      </span>
                    ) : (
                      <span className="out-of-stock">0</span>
                    )}
                  </td>
                  <td>
                    {totalStock === 0 ? (
                      <span className="status-badge status-out">Out of Stock</span>
                    ) : lowStock.length > 0 ? (
                      <span className="status-badge status-low">Low Stock</span>
                    ) : (
                      <span className="status-badge status-in">In Stock</span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ProductsTable

