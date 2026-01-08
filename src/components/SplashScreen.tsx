import { useEffect } from "react";
import logo from "@/assets/logo.jpeg";

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="min-h-screen gradient-primary flex flex-col items-center justify-center px-6 overflow-hidden">
      {/* Animated background circles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-primary-foreground/5 rounded-full animate-[pulse_4s_ease-in-out_infinite]" />
        <div className="absolute top-1/3 -right-32 w-96 h-96 bg-primary-foreground/5 rounded-full animate-[pulse_5s_ease-in-out_infinite_1s]" />
        <div className="absolute -bottom-20 left-1/4 w-72 h-72 bg-primary-foreground/5 rounded-full animate-[pulse_4.5s_ease-in-out_infinite_0.5s]" />
      </div>

      <div className="relative z-10">
        <div className="animate-[bounceIn_0.8s_ease-out]">
          <div className="w-40 h-40 rounded-3xl overflow-hidden shadow-2xl bg-background mb-8 mx-auto transform hover:scale-105 transition-transform duration-500">
            <img 
              src={logo} 
              alt="SLM Furniture" 
              className="w-full h-full object-contain p-3"
            />
          </div>
        </div>
        
        <div className="animate-fade-in text-center" style={{ animationDelay: "0.4s", animationFillMode: "backwards" }}>
          <h1 className="text-4xl font-serif font-bold text-primary-foreground mb-3 tracking-tight">
            SLM Paintings
          </h1>
          <p className="text-primary-foreground/80 text-lg font-light tracking-wide">
            Decorate your dream...
          </p>
        </div>
      </div>
      
      <div className="absolute bottom-16 z-10">
        <div className="flex gap-2">
          <div className="w-3 h-3 bg-primary-foreground/60 rounded-full animate-[bounce_1s_ease-in-out_infinite]" />
          <div className="w-3 h-3 bg-primary-foreground/60 rounded-full animate-[bounce_1s_ease-in-out_infinite_0.2s]" />
          <div className="w-3 h-3 bg-primary-foreground/60 rounded-full animate-[bounce_1s_ease-in-out_infinite_0.4s]" />
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
