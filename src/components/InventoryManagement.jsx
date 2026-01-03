import { useState } from 'react'
import { products } from '../data/products'
import { initialInventory } from '../data/inventory'
import './InventoryManagement.css'

const InventoryManagement = () => {
  const [inventory, setInventory] = useState(initialInventory)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [editingStock, setEditingStock] = useState({})

  const handleStockChange = (productId, size, value) => {
    const numValue = parseInt(value) || 0
    setEditingStock({
      ...editingStock,
      [`${productId}-${size}`]: numValue
    })
  }

  const saveStock = (productId, size) => {
    const key = `${productId}-${size}`
    const newValue = editingStock[key]
    
    if (newValue !== undefined) {
      setInventory(prev => ({
        ...prev,
        [productId]: {
          ...prev[productId],
          [size]: newValue
        }
      }))
      
      // Clear the editing state for this field
      const newEditing = { ...editingStock }
      delete newEditing[key]
      setEditingStock(newEditing)
    }
  }

  const getProductInventory = (productId) => {
    return inventory[productId] || {}
  }

  const getTotalStock = (productId) => {
    const inv = getProductInventory(productId)
    return Object.values(inv).reduce((sum, qty) => sum + qty, 0)
  }

  const selectedProductData = selectedProduct 
    ? products.find(p => p.id === selectedProduct)
    : null

  return (
    <div className="inventory-management-container">
      <div className="inventory-header">
        <h2>Inventory Management</h2>
        <div className="product-selector">
          <label htmlFor="product-select">Select Product:</label>
          <select
            id="product-select"
            value={selectedProduct || ''}
            onChange={(e) => setSelectedProduct(e.target.value ? parseInt(e.target.value) : null)}
            className="product-select"
          >
            <option value="">All Products</option>
            {products.map(product => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {selectedProductData ? (
        <div className="inventory-detail">
          <div className="inventory-product-header">
            <h3>{selectedProductData.name}</h3>
            <div className="total-stock-display">
              Total Stock: <strong>{getTotalStock(selectedProductData.id)}</strong>
            </div>
          </div>

          <div className="inventory-table-wrapper">
            <table className="inventory-table">
              <thead>
                <tr>
                  <th>Size</th>
                  <th>Current Stock</th>
                  <th>Update Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {selectedProductData.sizes ? (
                  selectedProductData.sizes.map(size => {
                    const key = `${selectedProductData.id}-${size}`
                    const currentStock = getProductInventory(selectedProductData.id)[size] || 0
                    const editingValue = editingStock[key] !== undefined 
                      ? editingStock[key] 
                      : currentStock

                    return (
                      <tr key={size}>
                        <td className="size-cell">{size}</td>
                        <td className="stock-cell">
                          <span className={currentStock < 10 ? 'low-stock' : ''}>
                            {currentStock}
                          </span>
                        </td>
                        <td>
                          <input
                            type="number"
                            min="0"
                            value={editingValue}
                            onChange={(e) => handleStockChange(selectedProductData.id, size, e.target.value)}
                            className="stock-input"
                          />
                        </td>
                        <td>
                          <button
                            onClick={() => saveStock(selectedProductData.id, size)}
                            className="save-stock-button"
                            disabled={editingStock[key] === undefined || editingStock[key] === currentStock}
                          >
                            Save
                          </button>
                        </td>
                      </tr>
                    )
                  })
                ) : (
                  <tr>
                    <td colSpan="4" className="no-sizes">
                      This product has no size variants
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="inventory-overview">
          <div className="inventory-grid">
            {products.map(product => {
              const totalStock = getTotalStock(product.id)
              const inv = getProductInventory(product.id)
              const lowStockSizes = Object.entries(inv).filter(([size, qty]) => qty < 10)

              return (
                <div key={product.id} className="inventory-card" onClick={() => setSelectedProduct(product.id)}>
                  <div className="inventory-card-header">
                    <h4>{product.name}</h4>
                    <span className={`stock-badge ${totalStock === 0 ? 'out' : totalStock < 20 ? 'low' : 'good'}`}>
                      {totalStock} in stock
                    </span>
                  </div>
                  <div className="inventory-card-body">
                    {product.sizes ? (
                      <div className="size-stock-list">
                        {product.sizes.map(size => {
                          const stock = inv[size] || 0
                          return (
                            <div key={size} className="size-stock-item">
                              <span className="size-label">{size}:</span>
                              <span className={`stock-value ${stock < 10 ? 'low' : ''}`}>
                                {stock}
                              </span>
                            </div>
                          )
                        })}
                      </div>
                    ) : (
                      <div className="no-sizes-text">
                        Stock: {inv.default || 0}
                      </div>
                    )}
                  </div>
                  {lowStockSizes.length > 0 && (
                    <div className="low-stock-warning">
                      ⚠️ {lowStockSizes.length} size(s) low on stock
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default InventoryManagement

