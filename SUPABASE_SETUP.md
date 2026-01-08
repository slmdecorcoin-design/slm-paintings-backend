# 🚀 Supabase Integration - Setup Guide

## **What You Have:**

✅ Password-Protected Admin Panel
✅ Supabase Backend Integration
✅ Cloud Storage for Products
✅ Real-time Updates Across All Users

---

## **STEP 1: Edit .env.local File**

Open: `c:\Users\rm770\Downloads\ai-ui-enhancer-main\ai-ui-enhancer-main\.env.local`

You'll see:
```
https://fzfefgyrsvztoiqgqoyr.supabase.co
sb_publishable_T7FDxDCRgXWOOK4TvzDXJg_CwSrQtVy
Ramesh@1981#2025bysanskarmaurya@2010 
```

**Replace with YOUR values:**

### **Get Supabase URL & Key:**
1. Go to Supabase dashboard
2. Click **Settings** → **API**
3. Copy your Project URL
4. Copy your anon key (NOT the service role key)

### **Example (don't use these!):**
```
https://fzfefgyrsvztoiqgqoyr.supabase.co
sb_publishable_T7FDxDCRgXWOOK4TvzDXJg_CwSrQtVy
Ramesh@1981#2025bysanskarmaurya@2010 
```

### **Change Admin Password:**
Replace `Ramesh@1981#2025bysanskarmaurya@2010 `

**Save the file!** ✅

---

## **STEP 2: Test the Setup**

1. Start your dev server:
```bash
npm run dev
```

2. Click the **⚙️ gear icon** (bottom-right)

3. You should see **password login screen**

4. Enter your admin password (from `.env.local`)

5. If it works, you'll see the admin panel! 🎉

---

## **STEP 3: Add Products**

1. **Login to admin panel** with your password
2. Click **"+ Add Product"**
3. Fill in product details:
   - Name
   - Category
   - Price
   - Image URL
   - (Optional) Original Price, Coupon Code, Badge, etc.
4. Click **"Save Product"**
5. Product appears in app instantly! ⚡

---

## **STEP 4: Regular Users**

Regular users will:
- ❌ NOT see the ⚙️ button
- ✅ Only see your curated products from Supabase
- ✅ Can't modify anything

---

## **Security Checklist:**

- ✅ `.env.local` is in `.gitignore` (never shared)
- ✅ Password protects admin panel
- ✅ Products stored in Supabase (secure cloud)
- ✅ Regular users can't access admin
- ✅ Anon key has read/write permissions only for `paintings` table

---

## **Troubleshooting:**

**Admin panel shows error?**
- Check `.env.local` file exists
- Verify Supabase URL and key are correct
- Check Supabase `paintings` table exists
- Check browser console (F12) for error messages

**Products not loading?**
- Make sure you added products in admin panel
- Check Supabase dashboard → `paintings` table
- Refresh the page

**Wrong password won't let me in?**
- Double-check your password in `.env.local`
- Remember it's case-sensitive
- Edit `.env.local` and restart dev server

**Can't add products?**
- Check Supabase `paintings` table has correct columns
- Verify anon key has insert/update/delete permissions

---

## **For Play Store Release:**

1. **Keep `.env.local` secret** - never commit to GitHub
2. Products are in Supabase cloud, not on user's phone
3. You can update products anytime without releasing new app version
4. Users always see latest products
5. Complete security - no way users can hack the app

---

## **Column Names in Supabase Table:**

Make sure your `paintings` table has these columns (case-sensitive):

```
- id (text)
- name (text)
- image (text/URL)
- price (integer/numeric)
- original_price (integer/numeric, nullable)
- category (text)
- rating (decimal)
- reviews (integer)
- badge (text, nullable)
- coupon_code (text, nullable)
- coupon_discount (integer, nullable)
- created_at (timestamp, auto)
```

---

**Questions? Check the file at `.env.local` - your credentials are safely stored there!** 🔒
