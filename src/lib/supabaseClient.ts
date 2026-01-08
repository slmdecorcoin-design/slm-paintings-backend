import { createClient } from '@supabase/supabase-js';
import { paintings as defaultPaintings } from '@/data/paintings';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase configuration. Using default paintings.');
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');

export interface Product {
  id: string;
  name: string;
  image: string;
  price: number
  original_price?: number;
  category: string;
  rating: number;
  reviews: number;
  badge?: string;
  coupon_code?: string;
  coupon_discount?: number;
  created_at?: string;
}

// Fetch all products from Supabase with fallback to default paintings
export const fetchProducts = async (): Promise<Product[]> => {
  try {
    // If Supabase is not configured, return default paintings
    if (!supabaseUrl || !supabaseAnonKey) {
      console.log('Supabase not configured, using default paintings');
      return defaultPaintings;
    }

    const { data, error } = await supabase
      .from('paintings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Error fetching products from Supabase:', error);
      console.log('Using default paintings as fallback');
      return defaultPaintings;
    }

    // Return Supabase data if available, otherwise use default
    return (data && data.length > 0) ? data : defaultPaintings;
  } catch (error) {
    console.warn('Error fetching products:', error);
    console.log('Using default paintings as fallback');
    return defaultPaintings;
  }
};

// Add new product to Supabase
export const addProduct = async (product: Omit<Product, 'created_at'>) => {
  try {
    const { data, error } = await supabase
      .from('paintings')
      .insert([
        {
          id: product.id,
          name: product.name,
          image: product.image,
          price: product.price,
          original_price: product.original_price,
          category: product.category,
          rating: product.rating,
          reviews: product.reviews,
          badge: product.badge,
          coupon_code: product.coupon_code,
          coupon_discount: product.coupon_discount
        }
      ])
      .select();

    if (error) {
      console.error('Error adding product:', error);
      return null;
    }

    return data?.[0];
  } catch (error) {
    console.error('Error adding product:', error);
    return null;
  }
};

// Update product in Supabase
export const updateProduct = async (id: string, product: Partial<Product>) => {
  try {
    const { data, error } = await supabase
      .from('paintings')
      .update({
        name: product.name,
        image: product.image,
        price: product.price,
        original_price: product.original_price,
        category: product.category,
        rating: product.rating,
        reviews: product.reviews,
        badge: product.badge,
        coupon_code: product.coupon_code,
        coupon_discount: product.coupon_discount
      })
      .eq('id', id)
      .select();

    if (error) {
      console.error('Error updating product:', error);
      return null;
    }

    return data?.[0];
  } catch (error) {
    console.error('Error updating product:', error);
    return null;
  }
};

// Delete product from Supabase
export const deleteProduct = async (id: string) => {
  try {
    const { error } = await supabase
      .from('paintings')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting product:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error deleting product:', error);
    return false;
  }
};
