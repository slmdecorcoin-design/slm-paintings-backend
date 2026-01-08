import { useState, useRef } from "react";
import { ArrowLeft, Upload, X, Check, ImagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { sizeOptions, frameOptions } from "@/data/paintings";

interface CustomPaintingProps {
  onBack: () => void;
  onProceed: (imageData: string, size: string, frame: string, price: number) => void;
}

const CustomPainting = ({ onBack, onProceed }: CustomPaintingProps) => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState(sizeOptions[0].id);
  const [selectedFrame, setSelectedFrame] = useState(frameOptions[0].id);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const basePrice = 1999;
  const sizeOption = sizeOptions.find(s => s.id === selectedSize)!;
  const totalPrice = Math.round(basePrice * sizeOption.priceMultiplier);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      setUploadedImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      processFile(file);
    }
  };

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
            Custom Painting
          </h1>
        </div>
      </header>

      <div className="p-4 space-y-6 animate-fade-in">
        {/* Upload Area */}
        <div className="animate-slide-up">
          <h3 className="text-lg font-semibold text-foreground mb-3">Upload Your Image</h3>
          
          {!uploadedImage ? (
            <Card
              className={`aspect-square border-2 border-dashed cursor-pointer transition-all duration-300 flex flex-col items-center justify-center ${
                isDragging 
                  ? "border-primary bg-primary/5 scale-[1.02]" 
                  : "border-primary/30 hover:border-primary hover:bg-primary/5"
              }`}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
            >
              <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mb-4 animate-[bounce_2s_ease-in-out_infinite]">
                <ImagePlus className="w-10 h-10 text-primary" />
              </div>
              <p className="text-foreground font-medium mb-1">Tap to upload</p>
              <p className="text-sm text-muted-foreground">or drag and drop</p>
              <p className="text-xs text-muted-foreground mt-2">JPG, PNG up to 10MB</p>
            </Card>
          ) : (
            <Card className="aspect-square overflow-hidden relative shadow-card animate-scale-in">
              <img
                src={uploadedImage}
                alt="Uploaded"
                className="w-full h-full object-cover"
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-3 right-3 rounded-full shadow-lg hover:scale-110 transition-transform"
                onClick={() => setUploadedImage(null)}
              >
                <X className="w-4 h-4" />
              </Button>
            </Card>
          )}
          
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>

        {uploadedImage && (
          <>
            {/* Size Selection */}
            <div className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
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
                    <p className="font-semibold text-foreground text-sm">{size.name}</p>
                    <p className="text-xs text-muted-foreground">{size.dimensions}</p>
                  </Card>
                ))}
              </div>
            </div>

            {/* Frame Selection */}
            <div className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
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
            <div className="pt-4 border-t border-border animate-slide-up" style={{ animationDelay: "0.3s" }}>
              <div className="flex items-center justify-between mb-4">
                <span className="text-muted-foreground">Total Price</span>
                <span className="text-2xl font-bold text-primary">₹{totalPrice.toLocaleString()}</span>
              </div>
              <Button
                className="w-full h-14 text-lg font-semibold gradient-primary hover:opacity-90 shadow-glow hover:scale-[1.02] transition-transform"
                onClick={() => onProceed(uploadedImage, selectedSize, selectedFrame, totalPrice)}
              >
                Proceed to Order
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CustomPainting;
