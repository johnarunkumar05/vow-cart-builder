import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Phone, Heart, BarChart3 } from "lucide-react";
import { useState } from "react";

interface VendorCardProps {
  vendor: {
    id: string;
    name: string;
    category: string;
    location: string;
    rating: number;
    reviews: number;
    price: string;
    image: string;
    features: string[];
    available: boolean;
    verified: boolean;
  };
  onAddToWishlist: (vendorId: string) => void;
  onCompare: (vendorId: string) => void;
  onContact: (vendorId: string) => void;
}

export default function VendorCard({ vendor, onAddToWishlist, onCompare, onContact }: VendorCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    onAddToWishlist(vendor.id);
  };

  return (
    <Card className="group overflow-hidden bg-gradient-card shadow-soft hover:shadow-elegant transition-all duration-300 border-0">
      <div className="relative">
        <img 
          src={vendor.image} 
          alt={vendor.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3 flex gap-2">
          {vendor.verified && (
            <Badge className="bg-primary text-primary-foreground text-xs">
              Verified
            </Badge>
          )}
          {vendor.available && (
            <Badge variant="secondary" className="text-xs">
              Available
            </Badge>
          )}
        </div>
        <Button
          size="sm"
          variant="ghost"
          className={`absolute top-3 left-3 p-2 rounded-full ${
            isWishlisted ? 'bg-primary text-primary-foreground' : 'bg-white/80 hover:bg-white'
          } transition-colors`}
          onClick={handleWishlist}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </Button>
      </div>
      
      <div className="p-4 space-y-3">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg text-foreground">{vendor.name}</h3>
            <p className="text-sm text-muted-foreground">{vendor.category}</p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 text-sm">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{vendor.rating}</span>
              <span className="text-muted-foreground">({vendor.reviews})</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="w-4 h-4" />
          <span>{vendor.location}</span>
        </div>

        <div className="flex flex-wrap gap-1">
          {vendor.features.slice(0, 3).map((feature, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {feature}
            </Badge>
          ))}
          {vendor.features.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{vendor.features.length - 3} more
            </Badge>
          )}
        </div>

        <div className="flex justify-between items-center pt-2">
          <div>
            <span className="text-lg font-bold text-primary">{vendor.price}</span>
            <span className="text-sm text-muted-foreground ml-1">onwards</span>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => onCompare(vendor.id)}>
              <BarChart3 className="w-4 h-4 mr-1" />
              Compare
            </Button>
            <Button size="sm" onClick={() => onContact(vendor.id)} className="bg-gradient-primary hover:opacity-90">
              <Phone className="w-4 h-4 mr-1" />
              Contact
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}