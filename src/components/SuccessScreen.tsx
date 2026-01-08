import { CheckCircle, Home, MessageCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface SuccessScreenProps {
  onGoHome: () => void;
}

const SuccessScreen = ({ onGoHome }: SuccessScreenProps) => {
  return (
    <div className="min-h-screen bg-muted/30 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 text-primary/20 animate-[bounce_3s_ease-in-out_infinite]">
          <Sparkles className="w-8 h-8" />
        </div>
        <div className="absolute top-40 right-10 text-primary/20 animate-[bounce_4s_ease-in-out_infinite_0.5s]">
          <Sparkles className="w-6 h-6" />
        </div>
        <div className="absolute bottom-40 left-20 text-primary/20 animate-[bounce_3.5s_ease-in-out_infinite_1s]">
          <Sparkles className="w-10 h-10" />
        </div>
      </div>

      <Card className="w-full max-w-md p-8 text-center shadow-glow animate-scale-in relative z-10">
        <div className="w-24 h-24 rounded-full gradient-primary mx-auto flex items-center justify-center mb-6 animate-[bounce_1s_ease-out]">
          <CheckCircle className="w-12 h-12 text-primary-foreground" />
        </div>
        
        <h1 className="text-2xl font-serif font-bold text-foreground mb-3 animate-slide-up" style={{ animationDelay: "0.2s" }}>
          Order Sent Successfully!
        </h1>
        
        <p className="text-muted-foreground mb-6 animate-slide-up" style={{ animationDelay: "0.3s" }}>
          Your order has been sent via WhatsApp. Our team will contact you shortly to confirm your order.
        </p>

        <div className="bg-secondary/50 rounded-xl p-4 mb-6 animate-slide-up" style={{ animationDelay: "0.4s" }}>
          <div className="flex items-center justify-center gap-2 text-primary">
            <MessageCircle className="w-5 h-5 animate-[pulse_2s_ease-in-out_infinite]" />
            <span className="font-medium">Check your WhatsApp</span>
          </div>
        </div>

        <Button
          className="w-full h-14 text-lg font-semibold gradient-primary hover:opacity-90 shadow-glow hover:scale-105 transition-transform animate-slide-up"
          style={{ animationDelay: "0.5s" }}
          onClick={onGoHome}
        >
          <Home className="w-5 h-5 mr-2" />
          Back to Home
        </Button>
      </Card>
    </div>
  );
};

export default SuccessScreen;
