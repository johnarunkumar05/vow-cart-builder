import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { MapPin, Calendar, Users, Star } from "lucide-react";

interface SearchFiltersProps {
  budgetRange: number[];
  setBudgetRange: (range: number[]) => void;
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
  searchLocation: string;
  setSearchLocation: (location: string) => void;
}

const categories = [
  "Venues", "Photography", "Catering", "Decoration", 
  "Music & DJ", "Makeup", "Flowers", "Transport"
];

const locations = ["Delhi", "Mumbai", "Bangalore", "Chennai", "Hyderabad", "Pune"];

export default function SearchFilters({
  budgetRange,
  setBudgetRange,
  selectedCategories,
  setSelectedCategories,
  searchLocation,
  setSearchLocation
}: SearchFiltersProps) {
  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  return (
    <Card className="p-6 bg-gradient-card shadow-soft border-0">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4 text-foreground">Filter Options</h3>
        </div>

        {/* Budget Range */}
        <div className="space-y-3">
          <Label className="text-sm font-medium flex items-center gap-2">
            <span>Budget Range</span>
            <Badge variant="secondary" className="text-xs">
              ₹{budgetRange[0].toLocaleString()} - ₹{budgetRange[1].toLocaleString()}
            </Badge>
          </Label>
          <Slider
            value={budgetRange}
            onValueChange={setBudgetRange}
            max={1000000}
            min={10000}
            step={10000}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>₹10K</span>
            <span>₹10L+</span>
          </div>
        </div>

        {/* Location */}
        <div className="space-y-3">
          <Label className="text-sm font-medium flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Location
          </Label>
          <div className="grid grid-cols-2 gap-2">
            {locations.map((location) => (
              <Button
                key={location}
                variant={searchLocation === location ? "default" : "outline"}
                size="sm"
                onClick={() => setSearchLocation(location)}
                className="text-xs"
              >
                {location}
              </Button>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Categories</Label>
          <div className="grid grid-cols-2 gap-2">
            {categories.map((category) => (
              <div key={category} className="flex items-center space-x-2">
                <Checkbox
                  id={category}
                  checked={selectedCategories.includes(category)}
                  onCheckedChange={() => toggleCategory(category)}
                />
                <Label htmlFor={category} className="text-xs cursor-pointer">
                  {category}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Filters */}
        <div className="space-y-3">
          <Label className="text-sm font-medium flex items-center gap-2">
            <Star className="w-4 h-4" />
            Quick Filters
          </Label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox id="verified" />
              <Label htmlFor="verified" className="text-xs">Verified Vendors Only</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="available" />
              <Label htmlFor="available" className="text-xs">Available This Month</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="packages" />
              <Label htmlFor="packages" className="text-xs">Package Deals</Label>
            </div>
          </div>
        </div>

        <Button className="w-full bg-gradient-primary hover:opacity-90 transition-opacity">
          Apply Filters
        </Button>
      </div>
    </Card>
  );
}