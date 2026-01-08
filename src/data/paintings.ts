export interface Painting {
  id: string;
  name: string;
  image: string;
  price: number;
  original_price?: number;
  category: string;
  rating: number;
  reviews: number;
  badge?: string;
  coupon_code?: string;
  coupon_discount?: number;
}

const defaultPaintings: Painting[] = [
  {
    id: "1",
    name: "Abstract Horizon",
    image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=400&fit=crop",
    price: 2499,
    original_price: 3499,
    category: "Abstract",
    rating: 4.8,
    reviews: 124,
    badge: "Bestseller",
    coupon_code: "SAVE10",
    coupon_discount: 10
  },
  {
    id: "2",
    name: "Ocean Serenity",
    image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&h=400&fit=crop",
    price: 3299,
    original_price: 4299,
    category: "Nature",
    rating: 4.9,
    reviews: 89,
    badge: "Top Rated",
    coupon_code: "OCEAN15",
    coupon_discount: 15
  },
  {
    id: "3",
    name: "Golden Sunset",
    image: "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=400&h=400&fit=crop",
    price: 2899,
    category: "Landscape",
    rating: 4.7,
    reviews: 156
  },
  {
    id: "4",
    name: "Urban Dreams",
    image: "https://images.unsplash.com/photo-1549887534-1541e9326642?w=400&h=400&fit=crop",
    price: 3499,
    original_price: 4999,
    category: "Modern",
    rating: 4.6,
    reviews: 78,
    badge: "30% OFF"
  },
  {
    id: "5",
    name: "Floral Symphony",
    image: "https://images.unsplash.com/photo-1579783928621-7a13d66a62d1?w=400&h=400&fit=crop",
    price: 2199,
    category: "Floral",
    rating: 4.5,
    reviews: 203
  },
  {
    id: "6",
    name: "Mountain Glory",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop",
    price: 3999,
    original_price: 5499,
    category: "Landscape",
    rating: 4.9,
    reviews: 167,
    badge: "Premium"
  },
  {
    id: "7",
    name: "Mystic Forest",
    image: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=400&h=400&fit=crop",
    price: 2799,
    category: "Nature",
    rating: 4.4,
    reviews: 92
  },
  {
    id: "8",
    name: "Color Burst",
    image: "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=400&h=400&fit=crop",
    price: 1999,
    original_price: 2999,
    category: "Abstract",
    rating: 4.3,
    reviews: 145,
    badge: "Sale"
  }
];

// Load paintings from localStorage (fallback if Supabase is not available)
export const paintings: Painting[] = (() => {
  try {
    const saved = localStorage.getItem("slmPaintings");
    return saved ? JSON.parse(saved) : defaultPaintings;
  } catch (error) {
    console.error("Error loading paintings from localStorage:", error);
    return defaultPaintings;
  }
})();

export const categories = [
  { id: "abstract", name: "Abstract", icon: "🎨", count: 24 },
  { id: "nature", name: "Nature", icon: "🌿", count: 32 },
  { id: "landscape", name: "Landscape", icon: "🏔️", count: 28 },
  { id: "modern", name: "Modern", icon: "🖼️", count: 19 },
  { id: "floral", name: "Floral", icon: "🌸", count: 22 },
  { id: "portrait", name: "Portrait", icon: "👤", count: 15 }
];

export const banners = [
  {
    id: "1",
    title: "Premium Collection",
    subtitle: "Up to 40% Off",
    description: "Handcrafted masterpieces for your home",
    image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&h=400&fit=crop",
    cta: "Shop Now"
  },
  {
    id: "2",
    title: "Custom Paintings",
    subtitle: "Your Vision, Our Art",
    description: "Upload your image and get a unique painting",
    image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&h=400&fit=crop",
    cta: "Create Now"
  },
  {
    id: "3",
    title: "New Arrivals",
    subtitle: "Fresh Art Weekly",
    description: "Discover the latest additions to our gallery",
    image: "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=800&h=400&fit=crop",
    cta: "Explore"
  }
];

export const sizeOptions = [
  { id: "small", name: "Small", dimensions: "12\" x 16\"", priceMultiplier: 1 },
  { id: "medium", name: "Medium", dimensions: "18\" x 24\"", priceMultiplier: 1.5 },
  { id: "large", name: "Large", dimensions: "24\" x 36\"", priceMultiplier: 2 }
];

export const frameOptions = [
  { id: "royal-gold", name: "Royal Gold", color: "#D4AF37" },
  { id: "matte-black", name: "Matte Black", color: "#1a1a1a" },
  { id: "premium-wood", name: "Premium Wood", color: "#8B4513" },
  { id: "minimal-white", name: "Minimal White", color: "#f5f5f5" }
];
