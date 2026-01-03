import tshirtImage from '../../assets/tshit.png'

/**
 * Fallback products for development/preview
 * 
 * In production, products will be fetched from Shopify.
 * These are only used when Shopify is not configured.
 * 
 * To use Shopify:
 * 1. Add your products in Shopify Admin
 * 2. Configure VITE_SHOPIFY_STORE_DOMAIN and VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN in .env
 * 3. Products will be automatically fetched from Shopify
 */
export const products = [
  {
    id: 1,
    name: "Classic Tee",
    handle: "classic-tee",
    category: "Clothing",
    price: 35,
    image: tshirtImage,
    description: "Essential cotton tee with minimal branding. Perfect for everyday wear.",
    sizes: ["XS", "S", "M", "L", "XL"],
    variants: [
      { size: "XS", id: "variant-1-xs", available: true },
      { size: "S", id: "variant-1-s", available: true },
      { size: "M", id: "variant-1-m", available: true },
      { size: "L", id: "variant-1-l", available: true },
      { size: "XL", id: "variant-1-xl", available: true }
    ]
  },
  {
    id: 2,
    name: "Oversized Hoodie",
    handle: "oversized-hoodie",
    category: "Clothing",
    price: 75,
    image: tshirtImage,
    description: "Comfortable oversized fit with premium cotton blend.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    variants: [
      { size: "S", id: "variant-2-s", available: true },
      { size: "M", id: "variant-2-m", available: true },
      { size: "L", id: "variant-2-l", available: true },
      { size: "XL", id: "variant-2-xl", available: true },
      { size: "XXL", id: "variant-2-xxl", available: true }
    ]
  },
  {
    id: 3,
    name: "Logo Sticker Pack",
    handle: "logo-sticker-pack",
    category: "Stickers",
    price: 8,
    image: tshirtImage,
    description: "Set of 5 vinyl stickers with our signature logo."
  },
  {
    id: 4,
    name: "Cargo Pants",
    handle: "cargo-pants",
    category: "Clothing",
    price: 85,
    image: tshirtImage,
    description: "Functional streetwear pants with multiple pockets.",
    sizes: ["28", "30", "32", "34", "36"],
    variants: [
      { size: "28", id: "variant-4-28", available: true },
      { size: "30", id: "variant-4-30", available: true },
      { size: "32", id: "variant-4-32", available: true },
      { size: "34", id: "variant-4-34", available: true },
      { size: "36", id: "variant-4-36", available: true }
    ]
  },
  {
    id: 5,
    name: "Minimalist Cap",
    handle: "minimalist-cap",
    category: "Accessories",
    price: 28,
    image: tshirtImage,
    description: "Clean design cap with adjustable strap."
  },
  {
    id: 6,
    name: "Vintage Sticker Set",
    handle: "vintage-sticker-set",
    category: "Stickers",
    price: 12,
    image: tshirtImage,
    description: "Collection of retro-inspired designs."
  },
  {
    id: 7,
    name: "Long Sleeve Tee",
    handle: "long-sleeve-tee",
    category: "Clothing",
    price: 42,
    image: tshirtImage,
    description: "Soft long sleeve with ribbed cuffs.",
    sizes: ["XS", "S", "M", "L", "XL"],
    variants: [
      { size: "XS", id: "variant-7-xs", available: true },
      { size: "S", id: "variant-7-s", available: true },
      { size: "M", id: "variant-7-m", available: true },
      { size: "L", id: "variant-7-l", available: true },
      { size: "XL", id: "variant-7-xl", available: true }
    ]
  },
  {
    id: 8,
    name: "Canvas Tote",
    handle: "canvas-tote",
    category: "Accessories",
    price: 22,
    image: tshirtImage,
    description: "Eco-friendly canvas tote bag with minimal branding."
  },
  {
    id: 9,
    name: "Graphic Sticker",
    handle: "graphic-sticker",
    category: "Stickers",
    price: 5,
    image: tshirtImage,
    description: "Single premium vinyl sticker."
  },
  {
    id: 10,
    name: "Track Jacket",
    handle: "track-jacket",
    category: "Clothing",
    price: 68,
    image: tshirtImage,
    description: "Lightweight track jacket with zip closure.",
    sizes: ["S", "M", "L", "XL"],
    variants: [
      { size: "S", id: "variant-10-s", available: true },
      { size: "M", id: "variant-10-m", available: true },
      { size: "L", id: "variant-10-l", available: true },
      { size: "XL", id: "variant-10-xl", available: true }
    ]
  },
  {
    id: 11,
    name: "Beanie",
    handle: "beanie",
    category: "Accessories",
    price: 18,
    image: tshirtImage,
    description: "Warm knit beanie for all seasons."
  },
  {
    id: 12,
    name: "Crewneck Sweatshirt",
    handle: "crewneck-sweatshirt",
    category: "Clothing",
    price: 58,
    image: tshirtImage,
    description: "Classic crewneck with soft fleece interior.",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    variants: [
      { size: "XS", id: "variant-12-xs", available: true },
      { size: "S", id: "variant-12-s", available: true },
      { size: "M", id: "variant-12-m", available: true },
      { size: "L", id: "variant-12-l", available: true },
      { size: "XL", id: "variant-12-xl", available: true },
      { size: "XXL", id: "variant-12-xxl", available: true }
    ]
  }
]
