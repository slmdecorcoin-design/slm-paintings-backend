import { useState, useCallback } from "react";
import SplashScreen from "@/components/SplashScreen";
import HomeScreen from "@/components/HomeScreen";
import GalleryScreen from "@/components/GalleryScreen";
import PaintingDetails from "@/components/PaintingDetails";
import CustomPainting from "@/components/CustomPainting";
import CartScreen from "@/components/CartScreen";
import CustomerDetails from "@/components/CustomerDetails";
import SuccessScreen from "@/components/SuccessScreen";
import AdminManager from "@/pages/AdminManager";
import { Painting, sizeOptions, frameOptions } from "@/data/paintings";
import { CartItem, CustomerDetails as CustomerDetailsType, Screen } from "@/types/order";

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>("splash");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedPainting, setSelectedPainting] = useState<Painting | null>(null);
  const [customImage, setCustomImage] = useState<string | null>(null);
  const [pendingOrder, setPendingOrder] = useState<CartItem | null>(null);
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  // WhatsApp numbers
  const WHATSAPP_NUMBER = "919876543210"; // Customer WhatsApp number
  const COMPANY_WHATSAPP_NUMBER = "917007597203"; // Company WhatsApp number to receive custom order images

  const handleSplashComplete = useCallback(() => {
    setCurrentScreen("home");
  }, []);

  const handleSelectPainting = (painting: Painting) => {
    setSelectedPainting(painting);
    setCurrentScreen("details");
  };

  const handleProceedFromDetails = (size: string, frame: string, price: number) => {
    if (selectedPainting) {
      const orderItem: CartItem = {
        painting: selectedPainting,
        size,
        frame,
        price
      };
      setPendingOrder(orderItem);
      setCurrentScreen("customer");
    }
  };

  const handleAddToCart = (size: string, frame: string, price: number) => {
    if (selectedPainting) {
      const cartItem: CartItem = {
        id: Date.now().toString(),
        name: selectedPainting.name,
        painting: selectedPainting,
        size,
        frame,
        price,
        quantity: 1
      };
      setCart(prev => [...prev, cartItem]);
      setCurrentScreen("cart");
    }
  };

  const handleProceedFromCustom = (imageData: string, size: string, frame: string, price: number) => {
    setCustomImage(imageData);
    const orderItem: CartItem = {
      customImage: imageData,
      size,
      frame,
      price
    };
    setPendingOrder(orderItem);
    setCurrentScreen("customer");
  };

  const handleRemoveFromCart = (index: number) => {
    setCart(prev => prev.filter((_, i) => i !== index));
  };

  const handleProceedFromCart = () => {
    if (cart.length > 0) {
      setCurrentScreen("customer");
    }
  };

  const handleCustomerSubmit = (details: CustomerDetailsType) => {
    // Build order message
    const items = pendingOrder ? [pendingOrder] : cart;
    
    let message = `🎨 *New Order from SLM Paintings*\n\n`;
    message += `👤 *Customer Details*\n`;
    message += `Name: ${details.fullName}\n`;
    message += `Phone: ${details.phone}\n`;
    message += `WhatsApp: ${details.whatsapp}\n`;
    message += `Address: ${details.address}\n`;
    message += `ZIP: ${details.zipCode}\n\n`;
    if (details.latitude && details.longitude) {
      message += `Location: ${details.latitude.toFixed(6)}, ${details.longitude.toFixed(6)}\n`;
      if (details.city || details.state) {
        message += `City/State: ${details.city || ""}${details.state ? `, ${details.state}` : ""}\n\n`;
      }
    }
    message += `📦 *Order Items*\n`;

    let total = 0;
    let hasCustomImage = false;

    items.forEach((item, index) => {
      const sizeName = sizeOptions.find(s => s.id === item.size)?.name || item.size;
      const frameName = frameOptions.find(f => f.id === item.frame)?.name || item.frame;
      
      message += `\n${index + 1}. ${item.painting?.name || "Custom Painting"}\n`;
      message += `   Size: ${sizeName}\n`;
      message += `   Frame: ${frameName}\n`;
      message += `   Price: ₹${item.price.toLocaleString()}\n`;
      if (item.customImage) {
        message += `   (Custom image uploaded)\n`;
        hasCustomImage = true;
      }
      total += item.price;
    });

    message += `\n💰 *Total: ₹${total.toLocaleString()}*`;

    // Open WhatsApp with order details to customer
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");

    // If there's a custom image, send it to company WhatsApp with customer details
    if (hasCustomImage) {
      setTimeout(() => {
        const customImageMessage = `📸 *Custom Order Image*\n\nCustomer: ${details.fullName}\nPhone: ${details.phone}\nOrder ID: ${new Date().getTime()}\n\nPlease find the custom painting image attached above.`;
        const companyWhatsappUrl = `https://wa.me/${COMPANY_WHATSAPP_NUMBER}?text=${encodeURIComponent(customImageMessage)}`;
        window.open(companyWhatsappUrl, "_blank");
      }, 500);
    }

    // Reset state and show success
    setCart([]);
    setSelectedPainting(null);
    setCustomImage(null);
    setPendingOrder(null);
    setCurrentScreen("success");
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case "splash":
        return <SplashScreen onComplete={handleSplashComplete} />;
      
      case "home":
        return (
          <HomeScreen
            onNavigate={(screen) => setCurrentScreen(screen)}
            onSelectPainting={handleSelectPainting}
            cartCount={cart.length}
          />
        );
      
      case "gallery":
        return (
          <GalleryScreen
            onBack={() => setCurrentScreen("home")}
            onSelectPainting={handleSelectPainting}
            onCartClick={() => setCurrentScreen("cart")}
            cartCount={cart.length}
          />
        );
      
      case "details":
        return selectedPainting ? (
          <PaintingDetails
            painting={selectedPainting}
            onBack={() => setCurrentScreen("gallery")}
            onProceed={handleProceedFromDetails}
            onAddToCart={handleAddToCart}
            onCartClick={() => setCurrentScreen("cart")}
            cartCount={cart.length}
          />
        ) : null;
      
      case "custom":
        return (
          <CustomPainting
            onBack={() => setCurrentScreen("home")}
            onProceed={handleProceedFromCustom}
          />
        );
      
      case "cart":
        return (
          <CartScreen
            cart={cart}
            onBack={() => setCurrentScreen("home")}
            onRemoveItem={handleRemoveFromCart}
            onProceedToOrder={handleProceedFromCart}
          />
        );
      
      case "customer":
        return (
          <CustomerDetails
            onBack={() => setCurrentScreen(pendingOrder ? "details" : "cart")}
            onSubmit={handleCustomerSubmit}
          />
        );
      
      case "success":
        return <SuccessScreen onGoHome={() => setCurrentScreen("home")} />;
      
      default:
        return null;
    }
  };

  return (
    <div className="w-full min-h-screen bg-background">
      {showAdminPanel ? (
        <div>
          <div className="p-4 bg-gradient-to-r from-primary to-primary/80">
            <button
              onClick={() => setShowAdminPanel(false)}
              className="text-white font-semibold hover:opacity-80 transition"
            >
              ← Back to App
            </button>
          </div>
          <AdminManager />
        </div>
      ) : (
        <div className="max-w-md mx-auto min-h-screen bg-background shadow-2xl relative">
          {/* Admin Access Button */}
          <div className="fixed bottom-4 right-4 z-50">
            <button
              onClick={() => setShowAdminPanel(true)}
              className="w-12 h-12 rounded-full bg-primary text-white shadow-lg hover:shadow-xl hover:scale-110 transition-all flex items-center justify-center font-bold text-lg"
              title="Admin Panel"
            >
              ⚙️
            </button>
          </div>
          {renderScreen()}
        </div>
      )}
    </div>
  );
};

export default Index;
