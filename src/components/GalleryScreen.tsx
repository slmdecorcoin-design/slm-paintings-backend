import { useState, useEffect } from "react";
import { ArrowLeft, ShoppingCart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Painting } from "@/data/paintings";
import { fetchProducts } from "@/lib/supabaseClient";
import ShareMenu from "./ShareMenu";
import { CATEGORIES } from "@/lib/shareUtils";

interface GalleryScreenProps {
  onBack: () => void;
  onSelectPainting: (painting: Painting) => void;
  onCartClick: () => void;
  cartCount: number;
}

const GalleryScreen = ({ onBack, onSelectPainting, onCartClick, cartCount }: GalleryScreenProps) => {
  const [paintings, setPaintings] = useState<Painting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  // Load paintings from Supabase
  useEffect(() => {
    const loadPaintings = async () => {
      setIsLoading(true);
      const products = await fetchProducts();
      setPaintings(products);
      setIsLoading(false);
    };
    loadPaintings();
  }, []);

  const filteredPaintings =
    selectedCategory === "All"
      ? paintings
      : paintings.filter((p) => p.category === selectedCategory);

  const getShareMessage = (painting: Painting) => {
    return `Check out this beautiful painting!\n\n🎨 ${painting.name}\n📂 ${painting.category}\n⭐ ${painting.rating} (${painting.reviews} reviews)\n💰 ₹${painting.price.toLocaleString()}\n\nAvailable in our AI UI Enhancer gallery.`;
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
              Our Collection
            </h1>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="relative text-primary-foreground hover:bg-primary-foreground/10"
            onClick={onCartClick}
          >
            <ShoppingCart className="w-6 h-6" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground text-xs font-bold rounded-full flex items-center justify-center animate-scale-in">
                {cartCount}
              </span>
            )}
          </Button>
        </div>
      </header>

      {/* Category Filter */}
      <div className="px-4 py-3 bg-white border-b overflow-x-auto sticky top-16 z-10">
        <div className="flex gap-2">
          <Button
            variant={selectedCategory === "All" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory("All")}
            className="whitespace-nowrap"
          >
            All
          </Button>
          {CATEGORIES.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="whitespace-nowrap"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="p-4">
        {filteredPaintings.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">No paintings found in this category</p>
          </Card>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filteredPaintings.map((painting, index) => (
              <Card
                key={painting.id}
                className="overflow-hidden cursor-pointer group hover:shadow-glow transition-all duration-500 animate-scale-in"
                style={{ animationDelay: `${index * 0.05}s` }}
                onClick={() => onSelectPainting(painting)}
              >
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={painting.image}
                    alt={painting.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  {painting.badge && (
                    <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground text-[10px]">
                      {painting.badge}
                    </Badge>
                  )}
                  {/* Share Menu */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ShareMenu
                      title={painting.name}
                      message={getShareMessage(painting)}
                      className="bg-black/40 hover:bg-black/60 text-white"
                    />
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="font-semibold text-foreground text-sm truncate">{painting.name}</h3>
                  <p className="text-xs text-muted-foreground">{painting.category}</p>
                  <div className="flex items-center gap-1 my-1">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span className="text-xs text-foreground">{painting.rating}</span>
                    <span className="text-xs text-muted-foreground">({painting.reviews})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-primary font-bold">₹{painting.price.toLocaleString()}</span>
                    {painting.original_price && (
                      <span className="text-xs text-muted-foreground line-through">₹{painting.original_price.toLocaleString()}</span>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GalleryScreen;
