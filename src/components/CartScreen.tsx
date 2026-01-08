import { ArrowLeft, Trash2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CartItem } from "@/types/order";
import { sizeOptions, frameOptions } from "@/data/paintings";

interface CartScreenProps {
  cart: CartItem[];
  onBack: () => void;
  onRemoveItem: (index: number) => void;
  onProceedToOrder: () => void;
}

const CartScreen = ({ cart, onBack, onRemoveItem, onProceedToOrder }: CartScreenProps) => {
  const total = cart.reduce((sum, item) => sum + item.price, 0);

  const getSizeName = (sizeId: string) => sizeOptions.find(s => s.id === sizeId)?.name || sizeId;
  const getFrameName = (frameId: string) => frameOptions.find(f => f.id === frameId)?.name || frameId;

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="gradient-primary px-4 py-4 shadow-lg sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="text-primary-foreground hover:bg-primary-foreground/10"
            onClick={onBack}
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-xl font-serif font-bold text-primary-foreground">
            Your Cart ({cart.length})
          </h1>
        </div>
      </header>

      <div className="p-4 animate-fade-in">
        {cart.length === 0 ? (
          <div className="text-center py-16 animate-scale-in">
            <div className="w-24 h-24 rounded-full bg-secondary mx-auto flex items-center justify-center mb-4">
              <ShoppingBag className="w-12 h-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Your cart is empty</h3>
            <p className="text-muted-foreground mb-6">Start exploring our beautiful paintings</p>
            <Button onClick={onBack} className="gradient-primary hover:scale-105 transition-transform">
              Browse Paintings
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {cart.map((item, index) => (
              <Card 
                key={index} 
                className="p-4 shadow-card animate-slide-up hover:shadow-glow transition-all duration-300" 
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex gap-4">
                  <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 shadow-sm">
                    <img
                      src={item.customImage || item.painting?.image}
                      alt={item.painting?.name || "Custom painting"}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-foreground truncate">
                      {item.painting?.name || "Custom Painting"}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {getSizeName(item.size)} • {getFrameName(item.frame)}
                    </p>
                    <p className="text-primary font-bold mt-1">₹{item.price.toLocaleString()}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:bg-destructive/10 hover:scale-110 transition-transform"
                    onClick={() => onRemoveItem(index)}
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </div>
              </Card>
            ))}

            {/* Total & Proceed */}
            <div className="pt-6 border-t border-border mt-6 animate-slide-up" style={{ animationDelay: "0.3s" }}>
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg text-muted-foreground">Total</span>
                <span className="text-2xl font-bold text-primary">₹{total.toLocaleString()}</span>
              </div>
              <Button
                className="w-full h-14 text-lg font-semibold gradient-primary hover:opacity-90 shadow-glow hover:scale-[1.02] transition-transform"
                onClick={onProceedToOrder}
              >
                Proceed to Order
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartScreen;
