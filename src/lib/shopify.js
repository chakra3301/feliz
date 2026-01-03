/**
 * Shopify Storefront API Client
 * 
 * Uses the Shopify Headless sales channel with a public Storefront API token.
 * This token is safe to expose to the frontend - it only allows read access
 * to products/collections and write access to carts.
 * 
 * 2026-Safe: Uses public Storefront API token, no OAuth, no session tokens.
 */

const SHOPIFY_STORE_DOMAIN = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN;
const SHOPIFY_STOREFRONT_ACCESS_TOKEN = import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN;
const API_VERSION = '2024-10';

// Validate configuration
if (!SHOPIFY_STORE_DOMAIN) {
  console.warn('⚠️ Missing VITE_SHOPIFY_STORE_DOMAIN environment variable');
}
if (!SHOPIFY_STOREFRONT_ACCESS_TOKEN) {
  console.warn('⚠️ Missing VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN environment variable');
}

const GRAPHQL_ENDPOINT = `https://${SHOPIFY_STORE_DOMAIN}/api/${API_VERSION}/graphql.json`;

/**
 * Execute GraphQL query against Shopify Storefront API
 * @param {string} query - GraphQL query
 * @param {Object} variables - Query variables
 * @returns {Promise<Object>} Response data
 */
export async function shopifyFetch(query, variables = {}) {
  if (!SHOPIFY_STORE_DOMAIN || !SHOPIFY_STOREFRONT_ACCESS_TOKEN) {
    throw new Error('Shopify credentials not configured');
  }

  try {
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_ACCESS_TOKEN,
      },
      body: JSON.stringify({ query, variables }),
    });

    if (!response.ok) {
      throw new Error(`Shopify API error: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();

    if (result.errors) {
      console.error('Shopify GraphQL errors:', result.errors);
      throw new Error(result.errors[0]?.message || 'GraphQL error');
    }

    return result.data;
  } catch (error) {
    console.error('Shopify fetch error:', error);
    throw error;
  }
}

// ============================================================================
// PRODUCT QUERIES
// ============================================================================

const PRODUCT_FRAGMENT = `
  fragment ProductFields on Product {
    id
    handle
    title
    description
    featuredImage {
      url
      altText
    }
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    variants(first: 100) {
      edges {
        node {
          id
          title
          availableForSale
          quantityAvailable
          price {
            amount
            currencyCode
          }
          selectedOptions {
            name
            value
          }
        }
      }
    }
  }
`;

const PRODUCTS_QUERY = `
  ${PRODUCT_FRAGMENT}
  query getProducts($first: Int!, $query: String) {
    products(first: $first, query: $query) {
      edges {
        node {
          ...ProductFields
        }
      }
    }
  }
`;

const PRODUCT_BY_HANDLE_QUERY = `
  ${PRODUCT_FRAGMENT}
  query getProductByHandle($handle: String!) {
    product(handle: $handle) {
      ...ProductFields
    }
  }
`;

const COLLECTIONS_QUERY = `
  query getCollections($first: Int!) {
    collections(first: $first) {
      edges {
        node {
          id
          handle
          title
          description
          image {
            url
            altText
          }
        }
      }
    }
  }
`;

const COLLECTION_PRODUCTS_QUERY = `
  ${PRODUCT_FRAGMENT}
  query getCollectionProducts($handle: String!, $first: Int!) {
    collection(handle: $handle) {
      id
      title
      products(first: $first) {
        edges {
          node {
            ...ProductFields
          }
        }
      }
    }
  }
`;

// ============================================================================
// CART MUTATIONS
// ============================================================================

const CART_FRAGMENT = `
  fragment CartFields on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      totalAmount {
        amount
        currencyCode
      }
      subtotalAmount {
        amount
        currencyCode
      }
    }
    lines(first: 100) {
      edges {
        node {
          id
          quantity
          merchandise {
            ... on ProductVariant {
              id
              title
              price {
                amount
                currencyCode
              }
              product {
                id
                handle
                title
                featuredImage {
                  url
                  altText
                }
              }
            }
          }
        }
      }
    }
  }
`;

const CREATE_CART_MUTATION = `
  ${CART_FRAGMENT}
  mutation createCart($lines: [CartLineInput!]) {
    cartCreate(input: { lines: $lines }) {
      cart {
        ...CartFields
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const ADD_TO_CART_MUTATION = `
  ${CART_FRAGMENT}
  mutation addToCart($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        ...CartFields
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const UPDATE_CART_MUTATION = `
  ${CART_FRAGMENT}
  mutation updateCart($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        ...CartFields
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const REMOVE_FROM_CART_MUTATION = `
  ${CART_FRAGMENT}
  mutation removeFromCart($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        ...CartFields
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const GET_CART_QUERY = `
  ${CART_FRAGMENT}
  query getCart($cartId: ID!) {
    cart(id: $cartId) {
      ...CartFields
    }
  }
`;

// ============================================================================
// DATA NORMALIZATION
// ============================================================================

/**
 * Normalize Shopify product to internal format
 * @param {Object} product - Raw Shopify product
 * @returns {Object} Normalized product
 */
function normalizeProduct(product) {
  if (!product) return null;

  const variants = product.variants?.edges?.map((edge) => {
    const variant = edge.node;
    const sizeOption = variant.selectedOptions?.find(
      (opt) => opt.name.toLowerCase() === 'size'
    );

    return {
      id: variant.id,
      title: variant.title,
      size: sizeOption?.value || variant.title,
      price: parseFloat(variant.price.amount),
      available: variant.availableForSale,
      quantityAvailable: variant.quantityAvailable,
    };
  }) || [];

  // Extract unique sizes
  const sizes = [...new Set(variants.map((v) => v.size).filter(Boolean))];

  return {
    id: product.id,
    handle: product.handle,
    name: product.title,
    title: product.title,
    description: product.description || '',
    price: parseFloat(product.priceRange?.minVariantPrice?.amount || 0),
    image: product.featuredImage?.url || '',
    imageAlt: product.featuredImage?.altText || product.title,
    sizes: sizes.length > 0 ? sizes : undefined,
    variants,
  };
}

/**
 * Normalize Shopify cart to internal format
 * @param {Object} cart - Raw Shopify cart
 * @returns {Object} Normalized cart
 */
function normalizeCart(cart) {
  if (!cart) return null;

  const items = cart.lines?.edges?.map((edge) => {
    const line = edge.node;
    const variant = line.merchandise;
    const product = variant.product;

    return {
      id: line.id,
      lineId: line.id,
      quantity: line.quantity,
      variantId: variant.id,
      variantTitle: variant.title,
      price: parseFloat(variant.price.amount),
      product: {
        id: product.id,
        handle: product.handle,
        name: product.title,
        image: product.featuredImage?.url || '',
      },
    };
  }) || [];

  return {
    id: cart.id,
    checkoutUrl: cart.checkoutUrl,
    totalQuantity: cart.totalQuantity,
    total: parseFloat(cart.cost?.totalAmount?.amount || 0),
    subtotal: parseFloat(cart.cost?.subtotalAmount?.amount || 0),
    items,
  };
}

// ============================================================================
// PUBLIC API - PRODUCTS
// ============================================================================

/**
 * Get all products
 * @param {Object} options - Query options
 * @param {number} options.first - Number of products to fetch (default: 100)
 * @param {string} options.query - Search/filter query
 * @returns {Promise<Array>} Normalized products
 */
export async function getProducts({ first = 100, query = null } = {}) {
  const data = await shopifyFetch(PRODUCTS_QUERY, {
    first,
    query: query || undefined,
  });

  return data.products.edges.map((edge) => normalizeProduct(edge.node));
}

/**
 * Get products by category/type
 * @param {string} category - Product type to filter by
 * @returns {Promise<Array>} Normalized products
 */
export async function getProductsByCategory(category) {
  return getProducts({
    query: category ? `product_type:${category}` : null,
  });
}

/**
 * Get single product by handle
 * @param {string} handle - Product handle (slug)
 * @returns {Promise<Object|null>} Normalized product or null
 */
export async function getProductByHandle(handle) {
  const data = await shopifyFetch(PRODUCT_BY_HANDLE_QUERY, { handle });
  return normalizeProduct(data.product);
}

/**
 * Get all collections
 * @param {number} first - Number of collections to fetch
 * @returns {Promise<Array>} Collections
 */
export async function getCollections(first = 100) {
  const data = await shopifyFetch(COLLECTIONS_QUERY, { first });

  return data.collections.edges.map((edge) => ({
    id: edge.node.id,
    handle: edge.node.handle,
    title: edge.node.title,
    description: edge.node.description || '',
    image: edge.node.image?.url || '',
  }));
}

/**
 * Get products in a collection
 * @param {string} handle - Collection handle
 * @param {number} first - Number of products to fetch
 * @returns {Promise<Object>} Collection with products
 */
export async function getCollectionProducts(handle, first = 100) {
  const data = await shopifyFetch(COLLECTION_PRODUCTS_QUERY, { handle, first });

  if (!data.collection) {
    return null;
  }

  return {
    id: data.collection.id,
    title: data.collection.title,
    products: data.collection.products.edges.map((edge) =>
      normalizeProduct(edge.node)
    ),
  };
}

// ============================================================================
// PUBLIC API - CART
// ============================================================================

const CART_ID_KEY = 'shopify_cart_id';

/**
 * Get cart ID from localStorage
 */
function getCartId() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(CART_ID_KEY);
}

/**
 * Save cart ID to localStorage
 */
function saveCartId(cartId) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CART_ID_KEY, cartId);
}

/**
 * Clear cart ID from localStorage
 */
function clearCartId() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(CART_ID_KEY);
}

/**
 * Create a new cart
 * @param {Array} lines - Initial cart lines [{ merchandiseId, quantity }]
 * @returns {Promise<Object>} Normalized cart
 */
export async function createCart(lines = []) {
  const formattedLines = lines.map((line) => ({
    merchandiseId: line.merchandiseId || line.variantId,
    quantity: line.quantity || 1,
  }));

  const data = await shopifyFetch(CREATE_CART_MUTATION, {
    lines: formattedLines.length > 0 ? formattedLines : null,
  });

  if (data.cartCreate.userErrors?.length > 0) {
    throw new Error(data.cartCreate.userErrors[0].message);
  }

  const cart = normalizeCart(data.cartCreate.cart);
  saveCartId(cart.id);
  return cart;
}

/**
 * Get cart by ID
 * @param {string} cartId - Cart ID (optional, uses localStorage if not provided)
 * @returns {Promise<Object|null>} Normalized cart or null
 */
export async function getCart(cartId = null) {
  const id = cartId || getCartId();
  if (!id) return null;

  try {
    const data = await shopifyFetch(GET_CART_QUERY, { cartId: id });

    if (!data.cart) {
      // Cart expired or invalid
      clearCartId();
      return null;
    }

    return normalizeCart(data.cart);
  } catch (error) {
    console.error('Error fetching cart:', error);
    clearCartId();
    return null;
  }
}

/**
 * Add items to cart
 * @param {string} variantId - Variant ID to add
 * @param {number} quantity - Quantity to add
 * @returns {Promise<Object>} Updated cart
 */
export async function addToCart(variantId, quantity = 1) {
  let cartId = getCartId();

  // Create cart if it doesn't exist
  if (!cartId) {
    const cart = await createCart([{ merchandiseId: variantId, quantity }]);
    return cart;
  }

  // Try to add to existing cart
  try {
    const data = await shopifyFetch(ADD_TO_CART_MUTATION, {
      cartId,
      lines: [{ merchandiseId: variantId, quantity }],
    });

    if (data.cartLinesAdd.userErrors?.length > 0) {
      throw new Error(data.cartLinesAdd.userErrors[0].message);
    }

    return normalizeCart(data.cartLinesAdd.cart);
  } catch (error) {
    // Cart might be expired, try creating a new one
    console.warn('Cart expired, creating new cart');
    clearCartId();
    const cart = await createCart([{ merchandiseId: variantId, quantity }]);
    return cart;
  }
}

/**
 * Update cart line quantity
 * @param {string} lineId - Cart line ID
 * @param {number} quantity - New quantity
 * @returns {Promise<Object>} Updated cart
 */
export async function updateCartLine(lineId, quantity) {
  const cartId = getCartId();
  if (!cartId) throw new Error('No cart found');

  const data = await shopifyFetch(UPDATE_CART_MUTATION, {
    cartId,
    lines: [{ id: lineId, quantity }],
  });

  if (data.cartLinesUpdate.userErrors?.length > 0) {
    throw new Error(data.cartLinesUpdate.userErrors[0].message);
  }

  return normalizeCart(data.cartLinesUpdate.cart);
}

/**
 * Remove items from cart
 * @param {string|Array} lineIds - Line ID(s) to remove
 * @returns {Promise<Object>} Updated cart
 */
export async function removeFromCart(lineIds) {
  const cartId = getCartId();
  if (!cartId) throw new Error('No cart found');

  const ids = Array.isArray(lineIds) ? lineIds : [lineIds];

  const data = await shopifyFetch(REMOVE_FROM_CART_MUTATION, {
    cartId,
    lineIds: ids,
  });

  if (data.cartLinesRemove.userErrors?.length > 0) {
    throw new Error(data.cartLinesRemove.userErrors[0].message);
  }

  return normalizeCart(data.cartLinesRemove.cart);
}

/**
 * Get checkout URL for current cart
 * @returns {Promise<string|null>} Checkout URL or null
 */
export async function getCheckoutUrl() {
  const cart = await getCart();
  return cart?.checkoutUrl || null;
}

/**
 * Redirect to Shopify checkout
 */
export async function redirectToCheckout() {
  const checkoutUrl = await getCheckoutUrl();

  if (!checkoutUrl) {
    throw new Error('No cart or checkout URL available');
  }

  window.location.href = checkoutUrl;
}

