-- Example seed data for products and variants
-- Run this in Supabase SQL Editor after creating the schema

-- Insert Products
INSERT INTO products (name, category, description, image_url) VALUES
('Classic Tee', 'Clothing', 'Essential cotton tee with minimal branding. Perfect for everyday wear.', '/tshit.png'),
('Oversized Hoodie', 'Clothing', 'Comfortable oversized fit with premium cotton blend.', '/tshit.png'),
('Logo Sticker Pack', 'Stickers', 'Set of 5 vinyl stickers with our signature logo.', '/tshit.png'),
('Cargo Pants', 'Clothing', 'Functional streetwear pants with multiple pockets.', '/tshit.png'),
('Minimalist Cap', 'Accessories', 'Clean design cap with adjustable strap.', '/tshit.png'),
('Vintage Sticker Set', 'Stickers', 'Collection of retro-inspired designs.', '/tshit.png'),
('Long Sleeve Tee', 'Clothing', 'Soft long sleeve with ribbed cuffs.', '/tshit.png'),
('Canvas Tote', 'Accessories', 'Eco-friendly canvas tote bag with minimal branding.', '/tshit.png'),
('Graphic Sticker', 'Stickers', 'Single premium vinyl sticker.', '/tshit.png'),
('Track Jacket', 'Clothing', 'Lightweight track jacket with zip closure.', '/tshit.png'),
('Beanie', 'Accessories', 'Warm knit beanie for all seasons.', '/tshit.png'),
('Crewneck Sweatshirt', 'Clothing', 'Classic crewneck with soft fleece interior.', '/tshit.png');

-- Insert Product Variants with SKUs and Prices (in cents)
-- Classic Tee (Product ID 1)
INSERT INTO product_variants (product_id, size, sku, price, stock_count) VALUES
(1, 'XS', 'TEE-CLASSIC-XS-001', 3500, 50),
(1, 'S', 'TEE-CLASSIC-S-001', 3500, 100),
(1, 'M', 'TEE-CLASSIC-M-001', 3500, 150),
(1, 'L', 'TEE-CLASSIC-L-001', 3500, 120),
(1, 'XL', 'TEE-CLASSIC-XL-001', 3500, 80);

-- Oversized Hoodie (Product ID 2)
INSERT INTO product_variants (product_id, size, sku, price, stock_count) VALUES
(2, 'S', 'HOODIE-OVERSIZED-S-001', 7500, 60),
(2, 'M', 'HOODIE-OVERSIZED-M-001', 7500, 80),
(2, 'L', 'HOODIE-OVERSIZED-L-001', 7500, 90),
(2, 'XL', 'HOODIE-OVERSIZED-XL-001', 7500, 70),
(2, 'XXL', 'HOODIE-OVERSIZED-XXL-001', 7500, 40);

-- Logo Sticker Pack (Product ID 3) - No size
INSERT INTO product_variants (product_id, size, sku, price, stock_count) VALUES
(3, NULL, 'STICKER-LOGO-PACK-001', 800, 500);

-- Cargo Pants (Product ID 4)
INSERT INTO product_variants (product_id, size, sku, price, stock_count) VALUES
(4, '28', 'PANTS-CARGO-28-001', 8500, 30),
(4, '30', 'PANTS-CARGO-30-001', 8500, 50),
(4, '32', 'PANTS-CARGO-32-001', 8500, 70),
(4, '34', 'PANTS-CARGO-34-001', 8500, 60),
(4, '36', 'PANTS-CARGO-36-001', 8500, 40);

-- Minimalist Cap (Product ID 5) - No size
INSERT INTO product_variants (product_id, size, sku, price, stock_count) VALUES
(5, NULL, 'CAP-MINIMALIST-001', 2800, 200);

-- Vintage Sticker Set (Product ID 6) - No size
INSERT INTO product_variants (product_id, size, sku, price, stock_count) VALUES
(6, NULL, 'STICKER-VINTAGE-SET-001', 1200, 300);

-- Long Sleeve Tee (Product ID 7)
INSERT INTO product_variants (product_id, size, sku, price, stock_count) VALUES
(7, 'XS', 'TEE-LONG-XS-001', 4200, 40),
(7, 'S', 'TEE-LONG-S-001', 4200, 90),
(7, 'M', 'TEE-LONG-M-001', 4200, 130),
(7, 'L', 'TEE-LONG-L-001', 4200, 110),
(7, 'XL', 'TEE-LONG-XL-001', 4200, 70);

-- Canvas Tote (Product ID 8) - No size
INSERT INTO product_variants (product_id, size, sku, price, stock_count) VALUES
(8, NULL, 'TOTE-CANVAS-001', 2200, 150);

-- Graphic Sticker (Product ID 9) - No size
INSERT INTO product_variants (product_id, size, sku, price, stock_count) VALUES
(9, NULL, 'STICKER-GRAPHIC-001', 500, 1000);

-- Track Jacket (Product ID 10)
INSERT INTO product_variants (product_id, size, sku, price, stock_count) VALUES
(10, 'S', 'JACKET-TRACK-S-001', 6800, 50),
(10, 'M', 'JACKET-TRACK-M-001', 6800, 70),
(10, 'L', 'JACKET-TRACK-L-001', 6800, 80),
(10, 'XL', 'JACKET-TRACK-XL-001', 6800, 60);

-- Beanie (Product ID 11) - No size
INSERT INTO product_variants (product_id, size, sku, price, stock_count) VALUES
(11, NULL, 'BEANIE-001', 1800, 180);

-- Crewneck Sweatshirt (Product ID 12)
INSERT INTO product_variants (product_id, size, sku, price, stock_count) VALUES
(12, 'XS', 'SWEATSHIRT-CREW-XS-001', 5800, 35),
(12, 'S', 'SWEATSHIRT-CREW-S-001', 5800, 75),
(12, 'M', 'SWEATSHIRT-CREW-M-001', 5800, 120),
(12, 'L', 'SWEATSHIRT-CREW-L-001', 5800, 100),
(12, 'XL', 'SWEATSHIRT-CREW-XL-001', 5800, 80),
(12, 'XXL', 'SWEATSHIRT-CREW-XXL-001', 5800, 50);

