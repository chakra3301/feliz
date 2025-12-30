# FELIZ - Minimalist Ecommerce Store

A modern, minimalist ecommerce storefront inspired by clean streetwear aesthetics.

## Features

- **Minimalist Design**: Clean, white background with focus on product imagery
- **Responsive Grid**: 2-4 column product grid that adapts to screen size
- **Category Filtering**: Filter products by Clothing, Stickers, or Accessories
- **Product Pages**: Detailed product views with size selection
- **Shopping Cart**: Slide-out cart with quantity management
- **Smooth Animations**: Subtle hover effects and transitions
- **Mobile-First**: Optimized for all device sizes

## Getting Started

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

## Project Structure

```
src/
  ├── components/     # React components
  │   ├── Header.jsx
  │   ├── ProductGrid.jsx
  │   ├── ProductCard.jsx
  │   ├── ProductPage.jsx
  │   ├── Cart.jsx
  │   └── Footer.jsx
  ├── data/
  │   └── products.js  # Sample product data
  ├── App.jsx         # Main app component
  └── main.jsx        # Entry point
```

## Customization

- **Products**: Edit `src/data/products.js` to add or modify products
- **Styling**: Each component has its own CSS file for easy customization
- **Categories**: Update categories in `src/components/Header.jsx`

