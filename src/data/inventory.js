// Inventory tracking per product and size
export const initialInventory = {
  1: { // Classic Tee
    XS: 50,
    S: 100,
    M: 150,
    L: 120,
    XL: 80
  },
  2: { // Oversized Hoodie
    S: 60,
    M: 80,
    L: 90,
    XL: 70,
    XXL: 40
  },
  3: { // Logo Sticker Pack (no sizes)
    default: 500
  },
  4: { // Cargo Pants
    '28': 30,
    '30': 50,
    '32': 70,
    '34': 60,
    '36': 40
  },
  5: { // Minimalist Cap (no sizes)
    default: 200
  },
  6: { // Vintage Sticker Set (no sizes)
    default: 300
  },
  7: { // Long Sleeve Tee
    XS: 40,
    S: 90,
    M: 130,
    L: 110,
    XL: 70
  },
  8: { // Canvas Tote (no sizes)
    default: 150
  },
  9: { // Graphic Sticker (no sizes)
    default: 1000
  },
  10: { // Track Jacket
    S: 50,
    M: 70,
    L: 80,
    XL: 60
  },
  11: { // Beanie (no sizes)
    default: 180
  },
  12: { // Crewneck Sweatshirt
    XS: 35,
    S: 75,
    M: 120,
    L: 100,
    XL: 80,
    XXL: 50
  }
}

// Helper function to get inventory for a product
export const getInventory = (productId, size = 'default') => {
  return initialInventory[productId]?.[size] || 0
}

// Helper function to update inventory
export const updateInventory = (productId, size, quantity) => {
  if (!initialInventory[productId]) {
    initialInventory[productId] = {}
  }
  if (initialInventory[productId][size] === undefined) {
    initialInventory[productId][size] = 0
  }
  initialInventory[productId][size] = Math.max(0, initialInventory[productId][size] - quantity)
}

