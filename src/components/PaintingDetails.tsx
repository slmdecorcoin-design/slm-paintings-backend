import { useState } from "react";
import { ArrowLeft, ShoppingCart, Check, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Painting, sizeOptions, frameOptions } from "@/data/paintings";
import ShareMenu from "./ShareMenu";

interface PaintingDetailsProps {
  painting: Painting;
  onBack: () => void;
  onProceed: (size: string, frame: string, price: number) => void;
  onAddToCart: (size: string, frame: string, price: number) => void;
  onCartClick: () => void;
  cartCount: number;
}

const PaintingDetails = ({ painting, onBack, onProceed, onAddToCart, onCartClick, cartCount }: PaintingDetailsProps) => {
  const [selectedSize, setSelectedSize] = useState(sizeOptions[0].id);
  const [selectedFrame, setSelectedFrame] = useState(frameOptions[0].id);

  const sizeOption = sizeOptions.find(s => s.id === selectedSize)!;
  const totalPrice = Math.round(painting.price * sizeOption.priceMultiplier);
  const frameName = frameOptions.find(f => f.id === selectedFrame)?.name || "Standard Frame";

  const getShareMessage = () => {
    return `Check out this beautiful painting!\n\n🎨 ${painting.name}\n📏 Size: ${sizeOption.name} | Frame: ${frameName}\n💰 Price: ₹${totalPrice.toLocaleString()}\n\nAvailable in our AI UI Enhancer gallery.`;
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="gradient-primary px-4 py-4 shadow-lg sticky top-0 z-10">
        <div className="flex items-center justify-between">
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
              Details
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <ShareMenu
              title={painting.name}
              message={getShareMessage()}
              className="text-primary-foreground hover:bg-primary-foreground/10"
            />
            <Button
              variant="ghost"
              size="icon"
              className="relative text-primary-foreground hover:bg-primary-foreground/10"
              onClick={onCartClick}
            >
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground text-xs font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Button>
          </div>
        </div>
      </header>

      <div className="p-4 space-y-6 animate-fade-in">
        {/* Painting Image */}
        <Card className="overflow-hidden shadow-card animate-scale-in">
          <div className="relative aspect-square">
            <img
              src={painting.image}
              alt={painting.name}
              className="w-full h-full object-cover"
            />
            {painting.badge && (
              <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
                {painting.badge}
              </Badge>
            )}
          </div>
        </Card>

        {/* Info */}
        <div className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <h2 className="text-2xl font-serif font-bold text-foreground">{painting.name}</h2>
          <p className="text-muted-foreground">{painting.category}</p>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="font-medium text-foreground">{painting.rating}</span>
            </div>
            <span className="text-muted-foreground">({painting.reviews} reviews)</span>
          </div>
        </div>

        {/* Size Selection */}
        <div className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <h3 className="text-lg font-semibold text-foreground mb-3">Select Size</h3>
          <div className="grid grid-cols-3 gap-3">
            {sizeOptions.map((size) => (
              <Card
                key={size.id}
                className={`p-3 cursor-pointer transition-all duration-300 text-center hover:scale-105 ${
                  selectedSize === size.id
                    ? "border-2 border-primary bg-secondary shadow-glow"
                    : "border-primary/10 hover:border-primary/50"
                }`}
                onClick={() => setSelectedSize(size.id)}
              >
                {selectedSize === size.id && (
                  <Check className="w-4 h-4 text-primary absolute top-2 right-2" />
                )}
                <p className="font-semibold text-foreground text-sm">{size.name}</p>
                <p className="text-xs text-muted-foreground">{size.dimensions}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Frame Selection */}
        <div className="animate-slide-up" style={{ animationDelay: "0.3s" }}>
          <h3 className="text-lg font-semibold text-foreground mb-3">Select Frame</h3>
          <div className="grid grid-cols-2 gap-3">
            {frameOptions.map((frame) => (
              <Card
                key={frame.id}
                className={`p-3 cursor-pointer transition-all duration-300 flex items-center gap-3 hover:scale-105 ${
                  selectedFrame === frame.id
                    ? "border-2 border-primary bg-secondary shadow-glow"
                    : "border-primary/10 hover:border-primary/50"
                }`}
                onClick={() => setSelectedFrame(frame.id)}
              >
                <div
                  className="w-8 h-8 rounded-lg border-2 border-border shadow-sm"
                  style={{ backgroundColor: frame.color }}
                />
                <p className="font-medium text-foreground text-sm">{frame.name}</p>
                {selectedFrame === frame.id && (
                  <Check className="w-4 h-4 text-primary ml-auto" />
                )}
              </Card>
            ))}
          </div>
        </div>

        {/* Price & CTA */}
        <div className="pt-4 border-t border-border animate-slide-up" style={{ animationDelay: "0.4s" }}>
          <div className="flex items-center justify-between mb-4">
            <span className="text-muted-foreground">Total Price</span>
            <div className="text-right">
              <span className="text-2xl font-bold text-primary">₹{totalPrice.toLocaleString()}</span>
              {painting.originalPrice && (
                <span className="text-sm text-muted-foreground line-through ml-2">
                  ₹{Math.round(painting.originalPrice * sizeOption.priceMultiplier).toLocaleString()}
                </span>
              )}
            </div>
          </div>
          <div className="space-y-3">
            <Button
              className="w-full h-14 text-lg font-semibold gradient-primary hover:opacity-90 shadow-glow hover:scale-[1.02] transition-transform"
              onClick={() => onProceed(selectedSize, selectedFrame, totalPrice)}
            >
              Order via WhatsApp
            </Button>
            <Button
              variant="outline"
              className="w-full h-12 text-base font-semibold border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all hover:scale-[1.02]"
              onClick={() => onAddToCart(selectedSize, selectedFrame, totalPrice)}
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaintingDetails;
