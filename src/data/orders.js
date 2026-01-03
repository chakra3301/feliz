// Mock orders data - in a real app, this would come from a backend API
export let orders = [
  {
    id: 'ORD-001',
    date: '2024-01-15T10:30:00Z',
    customer: {
      name: 'John Doe',
      email: 'john@example.com'
    },
    items: [
      { productId: 1, name: 'Classic Tee', size: 'M', quantity: 2, price: 35 },
      { productId: 3, name: 'Logo Sticker Pack', quantity: 1, price: 8 }
    ],
    total: 78,
    status: 'completed',
    shippingAddress: '123 Main St, City, State 12345'
  },
  {
    id: 'ORD-002',
    date: '2024-01-16T14:20:00Z',
    customer: {
      name: 'Jane Smith',
      email: 'jane@example.com'
    },
    items: [
      { productId: 2, name: 'Oversized Hoodie', size: 'L', quantity: 1, price: 75 }
    ],
    total: 75,
    status: 'pending',
    shippingAddress: '456 Oak Ave, City, State 12345'
  },
  {
    id: 'ORD-003',
    date: '2024-01-17T09:15:00Z',
    customer: {
      name: 'Bob Johnson',
      email: 'bob@example.com'
    },
    items: [
      { productId: 4, name: 'Cargo Pants', size: '32', quantity: 1, price: 85 },
      { productId: 5, name: 'Minimalist Cap', quantity: 1, price: 28 }
    ],
    total: 113,
    status: 'shipped',
    shippingAddress: '789 Pine Rd, City, State 12345'
  }
]

// Helper function to create a new order
export const createOrder = (cart, customerInfo) => {
  const orderId = `ORD-${String(orders.length + 1).padStart(3, '0')}`
  const newOrder = {
    id: orderId,
    date: new Date().toISOString(),
    customer: customerInfo,
    items: cart.map(item => ({
      productId: item.product.id,
      name: item.product.name,
      size: item.size || null,
      quantity: item.quantity,
      price: item.product.price
    })),
    total: cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0),
    status: 'pending',
    shippingAddress: customerInfo.address || ''
  }
  orders.push(newOrder)
  return newOrder
}

// Helper function to update order status
export const updateOrderStatus = (orderId, newStatus) => {
  const order = orders.find(o => o.id === orderId)
  if (order) {
    order.status = newStatus
  }
}

// Helper function to get orders statistics
export const getOrdersStats = () => {
  const totalOrders = orders.length
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0)
  const pendingOrders = orders.filter(o => o.status === 'pending').length
  const completedOrders = orders.filter(o => o.status === 'completed').length
  
  // Calculate average order value
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0
  
  // Get recent orders (last 7 days)
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
  const recentOrders = orders.filter(o => new Date(o.date) >= sevenDaysAgo).length
  
  return {
    totalOrders,
    totalRevenue,
    pendingOrders,
    completedOrders,
    avgOrderValue,
    recentOrders
  }
}

