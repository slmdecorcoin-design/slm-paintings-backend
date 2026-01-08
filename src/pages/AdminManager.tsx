import { useState, useEffect, useRef } from "react";
import { Plus, Edit, Trash2, Save, X, LogOut, Lock, Upload, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { fetchProducts, addProduct, updateProduct, deleteProduct, Product } from "@/lib/supabaseClient";
import { CATEGORIES } from "@/lib/shareUtils";
import ShareMenu from "@/components/ShareMenu";

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || "slm1234";

const AdminManager = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [activeTab, setActiveTab] = useState<"products" | "messaging">("products");
  const [customerMessage, setCustomerMessage] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<Partial<Product>>({
    name: "",
    image: "",
    price: 0,
    original_price: undefined,
    category: "",
    rating: 4.5,
    reviews: 0,
    badge: "",
    coupon_code: "",
    coupon_discount: 0
  });

  useEffect(() => {
    if (isAuthenticated) {
      loadProducts();
    }
  }, [isAuthenticated]);

  const loadProducts = async () => {
    setIsLoading(true);
    const data = await fetchProducts();
    setProducts(data);
    setIsLoading(false);
  };

  const handlePasswordSubmit = () => {
    if (passwordInput === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setPasswordInput("");
    } else {
      alert("❌ Wrong password! Access denied.");
      setPasswordInput("");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPasswordInput("");
    setIsAddingNew(false);
    setEditingId(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "price" || name === "reviews" || name === "rating" || name === "original_price" || name === "coupon_discount"
        ? parseFloat(value) || 0
        : value
    }));
  };

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setFormData(prev => ({ ...prev, image: result }));
      setIsDragOver(false);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      handleImageUpload(file);
    } else {
      alert("❌ Please drop an image file");
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleAddNew = () => {
    setIsAddingNew(true);
    setEditingId(null);
    setFormData({
      name: "",
      image: "",
      price: 0,
      original_price: undefined,
      category: "",
      rating: 4.5,
      reviews: 0,
      badge: "",
      coupon_code: "",
      coupon_discount: 0
    });
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setIsAddingNew(false);
    setFormData(product);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.image || !formData.category || !formData.price) {
      alert("Please fill in all required fields (Name, Image URL, Category, Price)");
      return;
    }

    setIsLoading(true);

    try {
      if (isAddingNew) {
        const newProduct: Omit<Product, 'created_at'> = {
          id: Date.now().toString(),
          name: formData.name || "",
          image: formData.image || "",
          price: formData.price || 0,
          original_price: formData.original_price,
          category: formData.category || "",
          rating: formData.rating || 4.5,
          reviews: formData.reviews || 0,
          badge: formData.badge || undefined,
          coupon_code: formData.coupon_code || undefined,
          coupon_discount: formData.coupon_discount || 0
        };
        const result = await addProduct(newProduct);
        if (result) {
          alert("✅ Product added successfully!");
          await loadProducts();
        } else {
          alert("❌ Error adding product");
        }
      } else if (editingId) {
        const result = await updateProduct(editingId, formData);
        if (result) {
          alert("✅ Product updated successfully!");
          await loadProducts();
        } else {
          alert("❌ Error updating product");
        }
      }

      setIsAddingNew(false);
      setEditingId(null);
      setFormData({});
    } catch (error) {
      console.error("Error saving product:", error);
      alert("❌ Error saving product");
    }

    setIsLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      setIsLoading(true);
      const success = await deleteProduct(id);
      if (success) {
        alert("✅ Product deleted successfully!");
        await loadProducts();
      } else {
        alert("❌ Error deleting product");
      }
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsAddingNew(false);
    setEditingId(null);
    setFormData({});
  };

  const handleSendMessage = () => {
    if (!customerPhone || !customerMessage) {
      alert("❌ Please enter both phone number and message");
      return;
    }

    // Validate phone number (should be numeric)
    if (!/^\d{10,}$/.test(customerPhone.replace(/\D/g, ""))) {
      alert("❌ Please enter a valid phone number (at least 10 digits)");
      return;
    }

    // Send message via WhatsApp
    const phoneNumber = customerPhone.replace(/\D/g, "");
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(customerMessage)}`;
    window.open(whatsappUrl, "_blank");

    // Clear form
    setCustomerMessage("");
    setCustomerPhone("");
    alert("✅ Message opened in WhatsApp!");
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Password Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Admin Panel</h1>
            <p className="text-muted-foreground">🔒 Protected Area - Password Required</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Enter Admin Password
              </label>
              <Input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handlePasswordSubmit()}
                placeholder="Enter password..."
                className="h-12 text-lg"
                autoFocus
              />
            </div>

            <Button
              className="w-full h-12 gradient-primary text-white font-semibold"
              onClick={handlePasswordSubmit}
            >
              🔓 Unlock Admin Panel
            </Button>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                💡 <strong>Tip:</strong> This panel is password protected. Only you should have access!
              </p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // Admin Dashboard
  return (
    <div className="min-h-screen bg-muted/30 p-4">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-serif font-bold text-foreground">Admin Panel</h1>
            <p className="text-muted-foreground">Manage products and send messages ☁️</p>
          </div>
          <Button
            variant="outline"
            className="h-12 px-6 text-destructive hover:bg-destructive/10"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5 mr-2" />
            Logout
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex gap-3 mb-4 border-b">
          <Button
            variant={activeTab === "products" ? "default" : "ghost"}
            className={`h-10 px-4 ${activeTab === "products" ? "gradient-primary text-white" : ""}`}
            onClick={() => setActiveTab("products")}
          >
            📦 Products
          </Button>
          <Button
            variant={activeTab === "messaging" ? "default" : "ghost"}
            className={`h-10 px-4 ${activeTab === "messaging" ? "gradient-primary text-white" : ""}`}
            onClick={() => setActiveTab("messaging")}
          >
            💬 Send Message
          </Button>
        </div>
      </div>

      {/* Products Tab */}
      {activeTab === "products" && (
        <div className="max-w-7xl mx-auto">
          {/* Add Product Button */}
          <div className="mb-6 flex gap-3">
            <Button
              className="gradient-primary h-12 px-6 text-white"
              onClick={handleAddNew}
              disabled={isAddingNew || editingId !== null || isLoading}
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Product
            </Button>
          </div>

          {/* Search */}
          <div className="mb-4">
            <Input
              placeholder="Search by name or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-10"
            />
          </div>

        {/* Add/Edit Form */}
        {(isAddingNew || editingId) && (
          <Card className="p-6 mb-6 border-2 border-primary/30 animate-slide-up">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              {isAddingNew ? "Add New Product" : "Edit Product"}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Product Name *
                </label>
                <Input
                  name="name"
                  value={formData.name || ""}
                  onChange={handleInputChange}
                  placeholder="e.g., Abstract Horizon"
                  className="h-10"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category || ""}
                  onChange={handleInputChange}
                  className="w-full h-10 px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm"
                >
                  <option value="">Select a category</option>
                  {CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Selling Price (₹) *
                </label>
                <Input
                  name="price"
                  type="number"
                  value={formData.price || ""}
                  onChange={handleInputChange}
                  placeholder="2499"
                  className="h-10"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Original Price (₹)
                </label>
                <Input
                  name="original_price"
                  type="number"
                  value={formData.original_price || ""}
                  onChange={handleInputChange}
                  placeholder="3499"
                  className="h-10"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Coupon Code
                </label>
                <Input
                  name="coupon_code"
                  value={formData.coupon_code || ""}
                  onChange={handleInputChange}
                  placeholder="e.g., SAVE10"
                  className="h-10"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Coupon Discount (%)
                </label>
                <Input
                  name="coupon_discount"
                  type="number"
                  value={formData.coupon_discount || ""}
                  onChange={handleInputChange}
                  placeholder="10"
                  className="h-10"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Product Image * (Drag & Drop or Click)
                </label>
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
                    isDragOver
                      ? "border-primary bg-primary/10 scale-105"
                      : "border-gray-300 hover:border-primary hover:bg-primary/5"
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileInputChange}
                    className="hidden"
                  />
                  <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm font-medium text-foreground">
                    {isDragOver ? "Drop image here" : "Drag image here or click to browse"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Supports JPG, PNG, GIF
                  </p>
                </div>
                {formData.image && (
                  <div className="mt-4">
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="h-32 w-32 object-cover rounded-lg border border-gray-200"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Badge
                </label>
                <Input
                  name="badge"
                  value={formData.badge || ""}
                  onChange={handleInputChange}
                  placeholder="e.g., Bestseller"
                  className="h-10"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Rating (0-5)
                </label>
                <Input
                  name="rating"
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  value={formData.rating || ""}
                  onChange={handleInputChange}
                  placeholder="4.5"
                  className="h-10"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Reviews Count
                </label>
                <Input
                  name="reviews"
                  type="number"
                  value={formData.reviews || ""}
                  onChange={handleInputChange}
                  placeholder="124"
                  className="h-10"
                />
              </div>
            </div>

            {formData.image && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-foreground mb-2">Image Preview</label>
                <div className="w-48 h-48 rounded-lg overflow-hidden border border-primary/20">
                  <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <Button
                className="gradient-primary text-white h-10 px-6"
                onClick={handleSave}
                disabled={isLoading}
              >
                <Save className="w-4 h-4 mr-2" />
                {isLoading ? "Saving..." : "Save Product"}
              </Button>
              <Button variant="outline" className="h-10 px-6" onClick={handleCancel} disabled={isLoading}>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          </Card>
        )}

        {/* Products List */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Products ({filteredProducts.length}) {isLoading && "⏳"}
          </h2>

          {isLoading && products.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">Loading products...</p>
            </Card>
          ) : filteredProducts.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">No products found</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredProducts.map((product, index) => (
                <Card
                  key={product.id}
                  className="overflow-hidden hover:shadow-glow transition-all duration-300 animate-scale-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="grid grid-cols-3">
                    <div className="col-span-1 aspect-square overflow-hidden bg-muted">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    </div>

                    <div className="col-span-2 p-4 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-bold text-foreground text-sm truncate">{product.name}</h3>
                            <p className="text-xs text-muted-foreground">{product.category}</p>
                          </div>
                          {product.badge && (
                            <Badge className="bg-primary text-primary-foreground text-[10px]">
                              {product.badge}
                            </Badge>
                          )}
                        </div>

                        <div className="mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-primary font-bold text-lg">₹{product.price}</span>
                            {product.original_price && (
                              <span className="text-xs text-muted-foreground line-through">
                                ₹{product.original_price}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="text-xs text-muted-foreground mb-2">
                          ⭐ {product.rating} ({product.reviews} reviews)
                        </div>

                        {product.coupon_code && (
                          <div className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded inline-block">
                            {product.coupon_code} ({product.coupon_discount}% OFF)
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2 mt-3">
                        <ShareMenu
                          title={product.name}
                          message={`Check out ${product.name}!\n\n${product.category}\n⭐ ${product.rating} (${product.reviews} reviews)\n💰 ₹${product.price}\n\nAvailable now!`}
                          className="h-8 px-2 text-xs flex-1"
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 h-8 text-xs"
                          onClick={() => handleEdit(product)}
                          disabled={isAddingNew || editingId !== null || isLoading}
                        >
                          <Edit className="w-3 h-3 mr-1" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="flex-1 h-8 text-xs"
                          onClick={() => handleDelete(product.id)}
                          disabled={isAddingNew || editingId !== null || isLoading}
                        >
                          <Trash2 className="w-3 h-3 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        <Card className="p-4 mt-8 bg-green-50 border-green-200">
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <h3 className="font-semibold text-green-900 mb-1">☁️ Supabase Connected</h3>
              <p className="text-sm text-green-800">
                Products are safely stored in Supabase. All changes sync automatically across all users!
              </p>
            </div>
          </div>
        </Card>
      </div>
    )}

    {/* Messaging Tab */}
    {activeTab === "messaging" && (
      <div className="max-w-7xl mx-auto mt-6">
        <Card className="p-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">Send Message to Customer</h2>
          <p className="text-muted-foreground mb-6">Send WhatsApp messages to your customers directly</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
            {/* Phone Number Input */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Customer Phone Number *
              </label>
              <Input
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="Enter phone number with country code (e.g., 919876543210)"
                className="h-12"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Include country code (e.g., 91 for India, 1 for USA)
              </p>
            </div>

            {/* Message Input */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Message *
              </label>
              <textarea
                value={customerMessage}
                onChange={(e) => setCustomerMessage(e.target.value)}
                placeholder="Type your message here..."
                className="w-full h-12 px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
              />
            </div>
          </div>

          {/* Full Width Message Box */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-foreground mb-2">
              Full Message Preview
            </label>
            <div className="p-4 bg-muted rounded-lg border border-border min-h-32 max-h-48 overflow-y-auto">
              <p className="text-foreground whitespace-pre-wrap break-words">
                {customerMessage || "Your message preview will appear here..."}
              </p>
            </div>
          </div>

          {/* Send Button */}
          <div className="mt-6 flex gap-3">
            <Button
              className="gradient-primary text-white h-12 px-8 font-semibold"
              onClick={handleSendMessage}
              disabled={!customerPhone || !customerMessage}
            >
              📱 Send via WhatsApp
            </Button>
            <Button
              variant="outline"
              className="h-12 px-8"
              onClick={() => {
                setCustomerMessage("");
                setCustomerPhone("");
              }}
            >
              Clear
            </Button>
          </div>

          {/* Info Box */}
          <Card className="p-4 mt-6 bg-blue-50 border-blue-200">
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <h4 className="font-semibold text-blue-900 mb-1">💡 How to Use</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>✓ Enter the customer's phone number with country code</li>
                  <li>✓ Type your message</li>
                  <li>✓ Click "Send via WhatsApp" to open WhatsApp with the message</li>
                  <li>✓ The customer will receive the message when they click send</li>
                </ul>
              </div>
            </div>
          </Card>
        </Card>
      </div>
    )}
    </div>
  );
};

export default AdminManager;
