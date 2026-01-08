import { useState, useEffect, useRef } from "react";
import { ShoppingCart, Palette, Image, Star, Truck, Shield, ChevronLeft, ChevronRight, Search, Bell, Heart, TrendingUp, Zap, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { banners, Painting, paintings as defaultPaintings, categories } from "@/data/paintings";
import { fetchProducts } from "@/lib/supabaseClient";
import ShareMenu from "./ShareMenu";
import logo from "@/assets/logo.jpeg";

interface HomeScreenProps {
  onNavigate: (screen: "gallery" | "custom" | "cart") => void;
  onSelectPainting: (painting: Painting) => void;
  cartCount: number;
}

const HomeScreen = ({ onNavigate, onSelectPainting, cartCount }: HomeScreenProps) => {
  const [currentBanner, setCurrentBanner] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [paintings, setPaintings] = useState<Painting[]>(defaultPaintings);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Load paintings from Supabase
  useEffect(() => {
    const loadPaintings = async () => {
      try {
        setIsLoading(true);
        const products = await fetchProducts();
        if (products && products.length > 0) {
          // Convert products to Painting format
          const paintingsData: Painting[] = products.map((p) => ({
            id: p.id || "",
            name: p.name || "",
            image: p.image || "",
            price: p.price || 0,
            original_price: p.original_price,
            category: p.category || "General",
            rating: p.rating || 0,
            reviews: p.reviews || 0,
            badge: p.badge,
            coupon_code: p.coupon_code,
            coupon_discount: p.coupon_discount
          }));
          setPaintings(paintingsData);
        } else {
          // Use default paintings if fetch returns empty
          setPaintings(defaultPaintings);
        }
      } catch (error) {
        console.error("Error loading paintings:", error);
        // Use default paintings on error
        setPaintings(defaultPaintings);
      } finally {
        setIsLoading(false);
      }
    };
    loadPaintings();
  }, []);

  // Auto-rotate banners
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextBanner = () => {
    setIsAutoPlaying(false);
    setCurrentBanner((prev) => (prev + 1) % banners.length);
  };

  const prevBanner = () => {
    setIsAutoPlaying(false);
    setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const features = [
    { icon: Zap, title: "Fast Delivery", desc: "3-5 Days", color: "text-amber-500" },
    { icon: Shield, title: "Quality Assured", desc: "100% Original", color: "text-emerald-500" },
    { icon: Award, title: "Premium Frames", desc: "Handcrafted", color: "text-primary" }
  ];

  // Show loading state only if actually loading and no paintings yet
  if (isLoading && paintings.length === 0) {
    return (
      <div className="min-h-screen bg-muted/30 flex flex-col items-center justify-center">
        <div className="w-16 h-16 rounded-full border-4 border-primary border-t-transparent animate-spin mb-4" />
        <p className="text-muted-foreground text-center px-4">Loading paintings...</p>
      </div>
    );
  }

  // Ensure we always have paintings to display
  const displayPaintings = paintings.length > 0 ? paintings : defaultPaintings;

  const trendingPaintings = displayPaintings.filter(p => p.badge);
  const dealsPaintings = displayPaintings.filter(p => p.original_price);

  // Get share message
  const getShareMessage = (painting: Painting) => {
    return `Check out this beautiful painting!\n\n🎨 ${painting.name}\n📂 ${painting.category}\n⭐ ${painting.rating} (${painting.reviews} reviews)\n💰 ₹${painting.price.toLocaleString()}\n\nAvailable in our AI UI Enhancer gallery.`;
  };

  // Search filter function
  const searchResults = displayPaintings.filter(painting =>
    painting.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    painting.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="gradient-primary px-4 py-3 sticky top-0 z-50 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl overflow-hidden bg-background shadow-md animate-scale-in">
              <img src={logo} alt="SLM" className="w-full h-full object-contain p-0.5" />
            </div>
            <div className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
              <h1 className="text-lg font-serif font-bold text-primary-foreground leading-tight">SLM Paintings</h1>
              <p className="text-[10px] text-primary-foreground/70">Decorate your dream</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-primary-foreground hover:bg-primary-foreground/10 animate-fade-in"
              style={{ animationDelay: "0.2s" }}
            >
              <Bell className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="relative text-primary-foreground hover:bg-primary-foreground/10 animate-fade-in"
              style={{ animationDelay: "0.3s" }}
              onClick={() => onNavigate("cart")}
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground text-xs font-bold rounded-full flex items-center justify-center animate-scale-in">
                  {cartCount}
                </span>
              )}
            </Button>
          </div>
        </div>
        
        {/* Search Bar */}
        <div className="relative animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search paintings, styles, categories..."
            className="w-full h-10 pl-10 pr-4 rounded-lg bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSearchResults(e.target.value.length > 0);
            }}
            onFocus={() => searchQuery.length > 0 && setShowSearchResults(true)}
          />
          
          {/* Search Results Dropdown */}
          {showSearchResults && searchQuery && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-background rounded-lg shadow-lg border border-border z-50 max-h-72 overflow-y-auto">
              {searchResults.length > 0 ? (
                <div className="divide-y">
                  {searchResults.map((painting) => (
                    <div
                      key={painting.id}
                      className="p-3 flex items-center gap-3 hover:bg-secondary cursor-pointer transition-colors"
                      onClick={() => {
                        setShowSearchResults(false);
                        setSearchQuery("");
                        onSelectPainting(painting);
                      }}
                    >
                      <img
                        src={painting.image}
                        alt={painting.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-foreground text-sm truncate">{painting.name}</h4>
                        <p className="text-xs text-muted-foreground">{painting.category}</p>
                        <p className="text-primary font-semibold text-sm">₹{painting.price.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center">
                  <p className="text-muted-foreground text-sm">No paintings found</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-2 text-primary hover:bg-primary/10"
                    onClick={() => {
                      setShowSearchResults(false);
                      setSearchQuery("");
                      onNavigate("gallery");
                    }}
                  >
                    Browse Gallery
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      <main className="pb-6">
        {/* Hero Banner Carousel */}
        <section className="relative overflow-hidden animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <div 
            className="flex transition-transform duration-700 ease-out"
            style={{ transform: `translateX(-${currentBanner * 100}%)` }}
          >
            {banners.map((banner, index) => (
              <div key={banner.id} className="w-full flex-shrink-0 relative">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={banner.image} 
                    alt={banner.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/50 to-transparent" />
                  <div className="absolute inset-0 flex flex-col justify-center px-5">
                    <Badge className="w-fit mb-2 bg-primary text-primary-foreground animate-fade-in">
                      {banner.subtitle}
                    </Badge>
                    <h2 className="text-2xl font-serif font-bold text-background mb-1 animate-slide-up">
                      {banner.title}
                    </h2>
                    <p className="text-background/80 text-sm mb-3 animate-slide-up" style={{ animationDelay: "0.1s" }}>
                      {banner.description}
                    </p>
                    <Button 
                      size="sm" 
                      className="w-fit gradient-primary shadow-glow animate-scale-in hover:scale-105 transition-transform"
                      style={{ animationDelay: "0.2s" }}
                      onClick={() => index === 1 ? onNavigate("custom") : onNavigate("gallery")}
                    >
                      {banner.cta}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Banner Navigation */}
          <button 
            onClick={prevBanner}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-background/80 backdrop-blur flex items-center justify-center shadow-md hover:bg-background transition-all hover:scale-110"
          >
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>
          <button 
            onClick={nextBanner}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-background/80 backdrop-blur flex items-center justify-center shadow-md hover:bg-background transition-all hover:scale-110"
          >
            <ChevronRight className="w-5 h-5 text-foreground" />
          </button>
          
          {/* Banner Indicators */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => { setIsAutoPlaying(false); setCurrentBanner(index); }}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentBanner === index 
                    ? "w-6 bg-primary" 
                    : "w-2 bg-background/60 hover:bg-background"
                }`}
              />
            ))}
          </div>
        </section>

        {/* Features Strip */}
        <section className="px-4 py-4 animate-slide-up" style={{ animationDelay: "0.4s" }}>
          <div className="flex justify-between gap-2">
            {features.map((feature, index) => (
              <div 
                key={feature.title}
                className="flex-1 flex flex-col items-center text-center p-3 rounded-xl bg-background shadow-sm hover:shadow-card transition-all duration-300 hover:-translate-y-1 animate-scale-in"
                style={{ animationDelay: `${0.4 + index * 0.1}s` }}
              >
                <feature.icon className={`w-6 h-6 ${feature.color} mb-1`} />
                <p className="text-[10px] font-semibold text-foreground">{feature.title}</p>
                <p className="text-[9px] text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Main Action Cards */}
        <section className="px-4 mb-6 animate-slide-up" style={{ animationDelay: "0.5s" }}>
          <div className="grid grid-cols-2 gap-3">
            <Card 
              className="p-4 cursor-pointer group hover:shadow-glow transition-all duration-500 border-2 border-transparent hover:border-primary/30 overflow-hidden relative"
              onClick={() => onNavigate("gallery")}
            >
              <div className="absolute inset-0 gradient-primary opacity-0 group-hover:opacity-5 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center shadow-md mb-3 group-hover:scale-110 transition-transform duration-300">
                  <Palette className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">Ready Paintings</h3>
                <p className="text-xs text-muted-foreground">Premium collection</p>
              </div>
            </Card>

            <Card 
              className="p-4 cursor-pointer group hover:shadow-glow transition-all duration-500 border-2 border-transparent hover:border-primary/30 overflow-hidden relative"
              onClick={() => onNavigate("custom")}
            >
              <div className="absolute inset-0 gradient-primary opacity-0 group-hover:opacity-5 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center shadow-md mb-3 group-hover:scale-110 transition-transform duration-300">
                  <Image className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">Custom Painting</h3>
                <p className="text-xs text-muted-foreground">Upload your image</p>
              </div>
            </Card>
          </div>
        </section>

        {/* Categories */}
        <section className="mb-6 animate-slide-up" style={{ animationDelay: "0.6s" }}>
          <div className="px-4 flex items-center justify-between mb-3">
            <h2 className="text-lg font-serif font-bold text-foreground">Categories</h2>
            <Button variant="ghost" size="sm" className="text-primary text-xs hover:bg-primary/10" onClick={() => onNavigate("gallery")}>
              View All
            </Button>
          </div>
          <div className="flex gap-3 overflow-x-auto px-4 pb-2 scrollbar-hide">
            {categories.map((category, index) => (
              <div 
                key={category.id}
                className="flex-shrink-0 w-20 text-center cursor-pointer group animate-scale-in"
                style={{ animationDelay: `${0.6 + index * 0.05}s` }}
                onClick={() => onNavigate("gallery")}
              >
                <div className="w-16 h-16 mx-auto rounded-2xl bg-secondary flex items-center justify-center text-2xl mb-2 group-hover:bg-primary group-hover:scale-110 transition-all duration-300 shadow-sm group-hover:shadow-glow">
                  <span className="group-hover:scale-125 transition-transform duration-300">{category.icon}</span>
                </div>
                <p className="text-xs font-medium text-foreground truncate">{category.name}</p>
                <p className="text-[10px] text-muted-foreground">{category.count} items</p>
              </div>
            ))}
          </div>
        </section>

        {/* Trending Now */}
        <section className="mb-6 animate-slide-up" style={{ animationDelay: "0.7s" }}>
          <div className="px-4 flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-serif font-bold text-foreground">Trending Now</h2>
            </div>
            <Button variant="ghost" size="sm" className="text-primary text-xs hover:bg-primary/10" onClick={() => onNavigate("gallery")}>
              See All
            </Button>
          </div>
          <div className="flex gap-3 overflow-x-auto px-4 pb-2 scrollbar-hide" ref={scrollRef}>
            {trendingPaintings.map((painting, index) => (
              <Card 
                key={painting.id}
                className="flex-shrink-0 w-40 overflow-hidden cursor-pointer group hover:shadow-glow transition-all duration-500 animate-scale-in"
                style={{ animationDelay: `${0.7 + index * 0.1}s` }}
                onClick={() => onSelectPainting(painting)}
              >
                <div className="relative aspect-square overflow-hidden">
                  <img 
                    src={painting.image} 
                    alt={painting.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  {painting.badge && (
                    <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground text-[10px] animate-fade-in">
                      {painting.badge}
                    </Badge>
                  )}
                  <button className="absolute top-2 right-2 w-7 h-7 rounded-full bg-background/80 backdrop-blur flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-background hover:scale-110">
                    <Heart className="w-4 h-4 text-foreground" />
                  </button>
                  {/* Share Menu */}
                  <div className="absolute top-2 right-12 z-50 backdrop-blur-sm">
                    <ShareMenu
                      title={painting.name}
                      message={getShareMessage(painting)}
                      className="w-7 h-7 p-1 bg-black/50 hover:bg-black/70 text-white backdrop-blur"
                    />
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="font-medium text-foreground text-sm truncate">{painting.name}</h3>
                  <div className="flex items-center gap-1 my-1">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span className="text-xs text-foreground font-medium">{painting.rating}</span>
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
        </section>

        {/* Deals of the Day */}
        <section className="px-4 mb-6 animate-slide-up" style={{ animationDelay: "0.8s" }}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" />
              <h2 className="text-lg font-serif font-bold text-foreground">Deals of the Day</h2>
            </div>
            <Button variant="ghost" size="sm" className="text-primary text-xs hover:bg-primary/10" onClick={() => onNavigate("gallery")}>
              See All
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {dealsPaintings.slice(0, 4).map((painting, index) => (
              <Card 
                key={painting.id}
                className="overflow-hidden cursor-pointer group hover:shadow-glow transition-all duration-500 animate-scale-in"
                style={{ animationDelay: `${0.8 + index * 0.1}s` }}
                onClick={() => onSelectPainting(painting)}
              >
                <div className="relative aspect-square overflow-hidden">
                  <img 
                    src={painting.image} 
                    alt={painting.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-2 left-2 bg-destructive text-destructive-foreground text-[10px] font-bold px-2 py-0.5 rounded animate-[pulse_2s_ease-in-out_infinite]">
                    {painting.original_price ? Math.round((1 - painting.price / painting.original_price) * 100) : 0}% OFF
                  </div>
                  {/* Share Menu */}
                  <div className="absolute top-2 right-2 z-50 backdrop-blur-sm">
                    <ShareMenu
                      title={painting.name}
                      message={getShareMessage(painting)}
                      className="w-7 h-7 p-1 bg-black/50 hover:bg-black/70 text-white backdrop-blur"
                    />
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="font-medium text-foreground text-sm truncate">{painting.name}</h3>
                  <div className="flex items-center gap-1 my-1">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span className="text-xs text-foreground">{painting.rating}</span>
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
        </section>

        {/* CTA Banner */}
        <section className="px-4 animate-slide-up" style={{ animationDelay: "0.9s" }}>
          <Card className="overflow-hidden relative group cursor-pointer" onClick={() => onNavigate("gallery")}>
            <div className="absolute inset-0 gradient-primary opacity-90" />
            <div className="relative z-10 p-6 text-center">
              <h3 className="text-xl font-serif font-bold text-primary-foreground mb-2">
                Explore Full Collection
              </h3>
              <p className="text-primary-foreground/80 text-sm mb-4">
                100+ premium paintings waiting for you
              </p>
              <Button 
                variant="secondary" 
                className="font-semibold hover:scale-105 transition-transform shadow-lg"
              >
                Browse Gallery
              </Button>
            </div>
          </Card>
        </section>
      </main>
    </div>
  );
};

export default HomeScreen;
