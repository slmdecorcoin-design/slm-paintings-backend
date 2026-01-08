# 🎨 Admin Panel - Product Management Guide

## How to Access the Admin Panel

Click the **⚙️ Settings button** (gear icon) in the bottom-right corner of the app to access the Admin Panel.

## Features

### 1. **View All Products**
- See all existing paintings/products with their:
  - Product photo/image
  - Name and category
  - Selling price and discount price (if any)
  - Coupon code and discount percentage
  - Rating and reviews
  - Badge (Bestseller, Top Rated, etc.)

### 2. **Add New Product**
Click the **"+ Add New Product"** button and fill in:

**Required Fields:**
- **Product Name**: Name of the painting (e.g., "Mountain View")
- **Category**: Type of painting (Abstract, Nature, Landscape, etc.)
- **Selling Price (₹)**: Price for sale
- **Image URL**: Link to the product image

**Optional Fields:**
- **Original Price (₹)**: Set this to show a discount (e.g., 3499 with selling price 2499)
- **Coupon Code**: Code customers can use (e.g., SAVE15)
- **Coupon Discount (%)**: Discount percentage for coupon (e.g., 15%)
- **Badge**: Special label like "Bestseller", "Top Rated", "Sale", "30% OFF"
- **Rating**: Star rating (0-5)
- **Number of Reviews**: Customer review count

**Image Preview**: See a preview of the image before saving.

### 3. **Edit Product**
- Click **"Edit"** on any product card
- Modify the details
- Click **"Save Product"** to update

### 4. **Delete Product**
- Click **"Delete"** on any product card
- Confirm the deletion
- Product will be removed instantly

### 5. **Search Products**
- Use the search bar to find products by:
  - Product name
  - Category

## Data Storage

✅ **All data is saved locally in your browser**
- No server needed
- Changes sync instantly across the app
- Data persists when you refresh the page
- Products appear in the app immediately after saving

## Example Product Entry

```
Name: Mountain Glory
Category: Landscape
Selling Price: 3999
Original Price: 5499 (shows 27% OFF discount)
Image URL: https://images.unsplash.com/photo-1506905925346...
Badge: Premium
Rating: 4.9
Reviews: 167
Coupon Code: MOUNTAIN20
Coupon Discount: 20%
```

## Tips

1. **Use high-quality image URLs** - URLs work best from Unsplash, Pexels, or your own hosting
2. **Set original price higher** to show discount badges automatically
3. **Use relevant categories** - helps customers find products easily
4. **Add coupon codes** for promotional campaigns
5. **Update ratings** based on customer feedback
6. **Use badges wisely** - they stand out to customers (Bestseller, New, Sale, etc.)

## Troubleshooting

**Products not showing?**
- Make sure all required fields are filled
- Check that the image URL is valid
- Products might be cached - try refreshing the page

**Changes not saved?**
- Click "Save Product" button
- Check browser console for errors (F12)
- Ensure localStorage is enabled in your browser

**Want to reset to default products?**
- Clear browser cache or localStorage
- Delete the "slmPaintings" key from browser storage
- Refresh the page

---

All products managed here automatically sync with the main app! 🚀
