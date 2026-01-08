// Share utility for native web sharing (Amazon/Flipkart style)
export const CATEGORIES = [
  "Abstract",
  "Nature",
  "Landscape",
  "Modern",
  "Floral",
  "Portrait",
  "Vintage",
  "Minimalist",
  "Contemporary",
  "Traditional"
];

export interface ShareOptions {
  title: string;
  text: string;
  url?: string;
}

// Check if native share API is available
export const isNativeShareAvailable = () => {
  return !!navigator.share;
};

// Handle native web share
export const handleNativeShare = async (options: ShareOptions) => {
  try {
    if (navigator.share) {
      await navigator.share(options);
    } else {
      // Fallback to copy URL if native share not available
      const shareText = `${options.title}\n\n${options.text}`;
      await navigator.clipboard.writeText(shareText);
      return true;
    }
  } catch (error) {
    console.log("Share cancelled or error:", error);
  }
};

// Share to WhatsApp
export const shareToWhatsApp = (message: string) => {
  const whatsappURL = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
  window.open(whatsappURL, "_blank");
};

// Share to Facebook
export const shareToFacebook = (url: string, message?: string) => {
  const facebookURL = `https://www.facebook.com/sharer/sharer.php?quote=${encodeURIComponent(message || "Check this out!")}&u=${encodeURIComponent(url)}`;
  window.open(facebookURL, "_blank");
};

// Share to Instagram (direct to app)
export const shareToInstagram = (message: string) => {
  // Instagram doesn't have a direct web share API, so we'll copy to clipboard
  navigator.clipboard.writeText(message);
  alert("Message copied! Open Instagram and paste in your post or story.");
};

// Share to Twitter
export const shareToTwitter = (message: string, url?: string) => {
  const twitterURL = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}${url ? `&url=${encodeURIComponent(url)}` : ""}`;
  window.open(twitterURL, "_blank");
};

// Share via Email
export const shareViaEmail = (subject: string, message: string) => {
  const mailtoURL = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
  window.location.href = mailtoURL;
};
