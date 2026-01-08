import { useState } from "react";
import { ArrowLeft, User, Phone, MapPin, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CustomerDetails as CustomerDetailsType } from "@/types/order";

/** ✅ COMPANY WHATSAPP NUMBER (NO + SIGN) */
const COMPANY_WHATSAPP = "917007597203"; // +91 70075 97203

interface CustomerDetailsProps {
  onBack: () => void;
  onSubmit: (details: CustomerDetailsType) => void;
}

const CustomerDetails = ({ onBack, onSubmit }: CustomerDetailsProps) => {
  const [details, setDetails] = useState<CustomerDetailsType>({
    fullName: "",
    phone: "",
    whatsapp: "",
    address: "",
    zipCode: "",
  });

  const [errors, setErrors] = useState<Partial<CustomerDetailsType>>({});

  /* ✅ VALIDATION */
  const validate = () => {
    const newErrors: Partial<CustomerDetailsType> = {};

    if (!details.fullName.trim()) newErrors.fullName = "Name is required";
    if (!details.phone.trim() || details.phone.length < 10)
      newErrors.phone = "Valid phone number required";
    if (!details.address.trim()) newErrors.address = "Address is required";
    if (!details.zipCode.trim()) newErrors.zipCode = "ZIP / PIN code is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ✅ HANDLE INPUT */
  const handleChange = (field: keyof CustomerDetailsType, value: string) => {
    setDetails((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  // When user submits, hand details to parent for processing (send WhatsApp / save)
  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit(details);
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* HEADER */}
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
            Your Details
          </h1>
        </div>
      </header>

      {/* FORM */}
      <div className="p-4 space-y-6">
        <Card className="p-6 shadow-card">
          <div className="space-y-5">
            {/* NAME */}
            <div>
              <Label className="flex items-center gap-2">
                <User className="w-4 h-4 text-primary" />
                Full Name
              </Label>
              <Input
                value={details.fullName}
                onChange={(e) => handleChange("fullName", e.target.value)}
              />
              {errors.fullName && <p className="text-xs text-destructive">{errors.fullName}</p>}
            </div>

            {/* PHONE */}
            <div>
              <Label className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary" />
                Phone
              </Label>
              <Input
                type="tel"
                value={details.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
              />
              {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
            </div>

            {/* ADDRESS */}
            <div>
              <Label className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                Delivery Address
              </Label>
              <Textarea
                rows={3}
                placeholder="Enter complete address"
                value={details.address}
                onChange={(e) => handleChange("address", e.target.value)}
              />
              {errors.address && <p className="text-xs text-destructive">{errors.address}</p>}
            </div>

            {/* PIN */}
            <div>
              <Label>PIN Code</Label>
              <Input
                value={details.zipCode}
                onChange={(e) => handleChange("zipCode", e.target.value)}
              />
              {errors.zipCode && <p className="text-xs text-destructive">{errors.zipCode}</p>}
            </div>
          </div>
        </Card>

        {/* BUTTON */}
        <Button
          className="w-full h-14 text-lg font-semibold gradient-primary"
          onClick={handleSubmit}
        >
          <MessageCircle className="w-5 h-5 mr-2" />
          Send Order via WhatsApp
        </Button>
      </div>
    </div>
  );
};

export default CustomerDetails;
