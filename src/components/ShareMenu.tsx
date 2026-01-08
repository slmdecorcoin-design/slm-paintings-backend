import { Share2, MessageCircle, Facebook, Twitter, Mail, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect } from "react";
import {
  shareToWhatsApp,
  shareToFacebook,
  shareToInstagram,
  shareToTwitter,
  shareViaEmail,
  isNativeShareAvailable,
  handleNativeShare,
} from "@/lib/shareUtils";

interface ShareMenuProps {
  title: string;
  message: string;
  url?: string;
  className?: string;
}

const ShareMenu = ({ title, message, url, className = "" }: ShareMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const hasNativeShare = isNativeShareAvailable();

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  const handleNativeShareClick = async () => {
    await handleNativeShare({
      title,
      text: message,
      url: url || window.location.href,
    });
    setIsOpen(false);
  };

  const handleShareClick = (shareType: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    switch (shareType) {
      case "whatsapp":
        shareToWhatsApp(message);
        break;
      case "facebook":
        shareToFacebook(url || window.location.href, message);
        break;
      case "instagram":
        shareToInstagram(message);
        break;
      case "twitter":
        shareToTwitter(message, url || window.location.href);
        break;
      case "email":
        shareViaEmail(title, message);
        break;
      case "copy":
        navigator.clipboard.writeText(message);
        alert("Copied to clipboard!");
        break;
    }
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <Button
        variant="ghost"
        size="icon"
        className={className}
        onClick={() => setIsOpen(!isOpen)}
        title="Share"
      >
        <Share2 className="w-5 h-5" />
      </Button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-50 min-w-[200px] animate-scale-in">
          {/* Native Share (if available) */}
          {hasNativeShare && (
            <>
              <button
                onClick={handleNativeShareClick}
                className="w-full px-4 py-3 text-left text-sm font-medium hover:bg-gray-100 first:rounded-t-lg flex items-center gap-2 transition-colors"
              >
                <Share2 className="w-4 h-4" />
                Native Share
              </button>
              <div className="border-t border-gray-200" />
            </>
          )}

          {/* WhatsApp */}
          <button
            onClick={(e) => handleShareClick("whatsapp", e)}
            className="w-full px-4 py-3 text-left text-sm hover:bg-gray-100 flex items-center gap-2 transition-colors"
          >
            <MessageCircle className="w-4 h-4 text-green-500" />
            <span>WhatsApp</span>
          </button>

          {/* Facebook */}
          <button
            onClick={(e) => handleShareClick("facebook", e)}
            className="w-full px-4 py-3 text-left text-sm hover:bg-gray-100 flex items-center gap-2 transition-colors"
          >
            <Facebook className="w-4 h-4 text-blue-600" />
            <span>Facebook</span>
          </button>

          {/* Instagram */}
          <button
            onClick={(e) => handleShareClick("instagram", e)}
            className="w-full px-4 py-3 text-left text-sm hover:bg-gray-100 flex items-center gap-2 transition-colors"
          >
            <Share2 className="w-4 h-4 text-pink-500" />
            <span>Instagram</span>
          </button>

          {/* Twitter */}
          <button
            onClick={(e) => handleShareClick("twitter", e)}
            className="w-full px-4 py-3 text-left text-sm hover:bg-gray-100 flex items-center gap-2 transition-colors"
          >
            <Twitter className="w-4 h-4 text-blue-400" />
            <span>Twitter</span>
          </button>

          {/* Email */}
          <button
            onClick={(e) => handleShareClick("email", e)}
            className="w-full px-4 py-3 text-left text-sm hover:bg-gray-100 flex items-center gap-2 transition-colors"
          >
            <Mail className="w-4 h-4 text-gray-600" />
            <span>Email</span>
          </button>

          {/* Copy */}
          <button
            onClick={(e) => handleShareClick("copy", e)}
            className="w-full px-4 py-3 text-left text-sm hover:bg-gray-100 last:rounded-b-lg flex items-center gap-2 transition-colors border-t border-gray-200"
          >
            <Copy className="w-4 h-4 text-gray-600" />
            <span>Copy</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ShareMenu;
