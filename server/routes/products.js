import express from 'express';
import { supabase } from '../config/supabase.js';

const router = express.Router();

/**
 * Get all products with variants
 * GET /api/products
 */
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;

    let query = supabase
      .from('products')
      .select(`
        *,
        product_variants (*)
      `);

    if (category) {
      query = query.eq('category', category);
    }

    const { data: products, error } = await query;

    if (error) {
      console.error('Error fetching products:', error);
      return res.status(500).json({ error: 'Failed to fetch products' });
    }

    res.json(products);
  } catch (error) {
    console.error('Error in products route:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Get low stock items
 * GET /api/products/low-stock
 * Query param: threshold (default: 10)
 */
router.get('/low-stock', async (req, res) => {
  try {
    const threshold = parseInt(req.query.threshold) || 10;

    const { data: variants, error } = await supabase
      .from('product_variants')
      .select(`
        *,
        products (*)
      `)
      .lt('stock_count', threshold)
      .order('stock_count', { ascending: true });

    if (error) {
      console.error('Error fetching low stock items:', error);
      return res.status(500).json({ error: 'Failed to fetch low stock items' });
    }

    res.json(variants);
  } catch (error) {
    console.error('Error in low stock route:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

