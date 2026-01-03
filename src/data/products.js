import tshirtImage from '../../assets/tshit.png'

// Products with Stripe Price IDs
// Replace 'price_XXXXX' with your actual Stripe Price IDs
// To get Price IDs: Stripe Dashboard → Products → Click a product → Copy Price ID
export const products = [
  {
    id: 1,
    name: "Classic Tee",
    category: "Clothing",
    price: 35,
    image: tshirtImage,
    description: "Essential cotton tee with minimal branding. Perfect for everyday wear.",
    sizes: ["XS", "S", "M", "L", "XL"],
    // For products with sizes, create a Stripe Price for each size
    // Then add variants array with priceId for each size
    variants: [
      { size: "XS", priceId: "price_XXXXX" }, // Replace with actual Stripe Price ID
      { size: "S", priceId: "price_XXXXX" },
      { size: "M", priceId: "price_XXXXX" },
      { size: "L", priceId: "price_XXXXX" },
      { size: "XL", priceId: "price_XXXXX" }
    ],
    // Or use a single priceId if all sizes are the same price
    priceId: "price_XXXXX" // Replace with actual Stripe Price ID
  },
  {
    id: 2,
    name: "Oversized Hoodie",
    category: "Clothing",
    price: 75,
    image: tshirtImage,
    description: "Comfortable oversized fit with premium cotton blend.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    variants: [
      { size: "S", priceId: "price_XXXXX" },
      { size: "M", priceId: "price_XXXXX" },
      { size: "L", priceId: "price_XXXXX" },
      { size: "XL", priceId: "price_XXXXX" },
      { size: "XXL", priceId: "price_XXXXX" }
    ],
    priceId: "price_XXXXX"
  },
  {
    id: 3,
    name: "Logo Sticker Pack",
    category: "Stickers",
    price: 8,
    image: tshirtImage,
    description: "Set of 5 vinyl stickers with our signature logo.",
    priceId: "price_XXXXX" // Replace with actual Stripe Price ID
  },
  {
    id: 4,
    name: "Cargo Pants",
    category: "Clothing",
    price: 85,
    image: tshirtImage,
    description: "Functional streetwear pants with multiple pockets.",
    sizes: ["28", "30", "32", "34", "36"],
    variants: [
      { size: "28", priceId: "price_XXXXX" },
      { size: "30", priceId: "price_XXXXX" },
      { size: "32", priceId: "price_XXXXX" },
      { size: "34", priceId: "price_XXXXX" },
      { size: "36", priceId: "price_XXXXX" }
    ],
    priceId: "price_XXXXX"
  },
  {
    id: 5,
    name: "Minimalist Cap",
    category: "Accessories",
    price: 28,
    image: tshirtImage,
    description: "Clean design cap with adjustable strap.",
    priceId: "price_XXXXX"
  },
  {
    id: 6,
    name: "Vintage Sticker Set",
    category: "Stickers",
    price: 12,
    image: tshirtImage,
    description: "Collection of retro-inspired designs.",
    priceId: "price_XXXXX"
  },
  {
    id: 7,
    name: "Long Sleeve Tee",
    category: "Clothing",
    price: 42,
    image: tshirtImage,
    description: "Soft long sleeve with ribbed cuffs.",
    sizes: ["XS", "S", "M", "L", "XL"],
    variants: [
      { size: "XS", priceId: "price_XXXXX" },
      { size: "S", priceId: "price_XXXXX" },
      { size: "M", priceId: "price_XXXXX" },
      { size: "L", priceId: "price_XXXXX" },
      { size: "XL", priceId: "price_XXXXX" }
    ],
    priceId: "price_XXXXX"
  },
  {
    id: 8,
    name: "Canvas Tote",
    category: "Accessories",
    price: 22,
    image: tshirtImage,
    description: "Eco-friendly canvas tote bag with minimal branding.",
    priceId: "price_XXXXX"
  },
  {
    id: 9,
    name: "Graphic Sticker",
    category: "Stickers",
    price: 5,
    image: tshirtImage,
    description: "Single premium vinyl sticker.",
    priceId: "price_XXXXX"
  },
  {
    id: 10,
    name: "Track Jacket",
    category: "Clothing",
    price: 68,
    image: tshirtImage,
    description: "Lightweight track jacket with zip closure.",
    sizes: ["S", "M", "L", "XL"],
    variants: [
      { size: "S", priceId: "price_XXXXX" },
      { size: "M", priceId: "price_XXXXX" },
      { size: "L", priceId: "price_XXXXX" },
      { size: "XL", priceId: "price_XXXXX" }
    ],
    priceId: "price_XXXXX"
  },
  {
    id: 11,
    name: "Beanie",
    category: "Accessories",
    price: 18,
    image: tshirtImage,
    description: "Warm knit beanie for all seasons.",
    priceId: "price_XXXXX"
  },
  {
    id: 12,
    name: "Crewneck Sweatshirt",
    category: "Clothing",
    price: 58,
    image: tshirtImage,
    description: "Classic crewneck with soft fleece interior.",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    variants: [
      { size: "XS", priceId: "price_XXXXX" },
      { size: "S", priceId: "price_XXXXX" },
      { size: "M", priceId: "price_XXXXX" },
      { size: "L", priceId: "price_XXXXX" },
      { size: "XL", priceId: "price_XXXXX" },
      { size: "XXL", priceId: "price_XXXXX" }
    ],
    priceId: "price_XXXXX"
  }
]
