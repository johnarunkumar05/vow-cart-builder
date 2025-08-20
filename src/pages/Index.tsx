import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Wand2, Users, Heart, Filter, Grid, List } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import SearchFilters from "@/components/SearchFilters";
import VendorCard from "@/components/VendorCard";
import BudgetTracker from "@/components/BudgetTracker";
import heroImage from "@/assets/wedding-hero.jpg";

const mockVendors = [
  {
    id: "1",
    name: "Royal Gardens Resort",
    category: "Venues",
    location: "Delhi NCR",
    rating: 4.8,
    reviews: 127,
    price: "₹2,50,000",
    image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400",
    features: ["Garden Setting", "AC Halls", "Parking", "Catering"],
    available: true,
    verified: true
  },
  {
    id: "2", 
    name: "Memories Photography",
    category: "Photography",
    location: "Mumbai",
    rating: 4.9,
    reviews: 89,
    price: "₹75,000",
    image: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=400",
    features: ["Candid", "Traditional", "Pre-wedding", "Drone"],
    available: true,
    verified: true
  },
  {
    id: "3",
    name: "Spice Route Catering",
    category: "Catering", 
    location: "Bangalore",
    rating: 4.7,
    reviews: 156,
    price: "₹1,200",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400",
    features: ["Multi-cuisine", "Live Counters", "Vegan Options"],
    available: false,
    verified: true
  }
];

const budgetData = [
  { category: "Venue", allocated: 300000, spent: 250000, vendors: 1 },
  { category: "Photography", allocated: 80000, spent: 75000, vendors: 1 },
  { category: "Catering", allocated: 150000, spent: 120000, vendors: 1 },
  { category: "Decoration", allocated: 100000, spent: 0, vendors: 0 },
  { category: "Music", allocated: 50000, spent: 0, vendors: 0 }
];

export default function Index() {
  const [searchQuery, setSearchQuery] = useState("");
  const [budgetRange, setBudgetRange] = useState([50000, 500000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [searchLocation, setSearchLocation] = useState("Delhi");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [planningMode, setPlanningMode] = useState<"diy" | "planner">("diy");
  const { toast } = useToast();

  const handleSearch = () => {
    toast({
      title: "Searching vendors...",
      description: `Found ${mockVendors.length} vendors matching your criteria`,
    });
  };

  const handleAddToWishlist = (vendorId: string) => {
    toast({
      title: "Added to wishlist",
      description: "Vendor saved to your favorites",
    });
  };

  const handleCompare = (vendorId: string) => {
    toast({
      title: "Added to comparison",
      description: "You can compare up to 3 vendors",
    });
  };

  const handleContact = (vendorId: string) => {
    toast({
      title: "Contact information sent",
      description: "Check your email for vendor details",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-gradient-hero">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-black/30" />
        </div>
        
        <div className="relative z-10 text-center text-white max-w-4xl px-6">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Build Your Perfect
            <span className="block bg-gradient-primary bg-clip-text text-transparent">
              Wedding
            </span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90">
            Find, filter, and plan your dream wedding with smart vendor matching and budget tracking
          </p>
          
          {/* Search Bar */}
          <Card className="p-4 bg-white/95 backdrop-blur-sm shadow-elegant border-0 max-w-2xl mx-auto">
            <div className="flex gap-3">
              <div className="flex-1">
                <Input
                  placeholder="Search for venues, photographers, caterers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border-0 text-lg"
                />
              </div>
              <Button onClick={handleSearch} size="lg" className="bg-gradient-primary hover:opacity-90">
                <Search className="w-5 h-5 mr-2" />
                Search
              </Button>
            </div>
          </Card>

          {/* Planning Mode Toggle */}
          <div className="flex justify-center mt-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-full p-1">
              <Button
                variant={planningMode === "diy" ? "default" : "ghost"}
                onClick={() => setPlanningMode("diy")}
                className="rounded-full text-white"
              >
                <Wand2 className="w-4 h-4 mr-2" />
                DIY Planning
              </Button>
              <Button
                variant={planningMode === "planner" ? "default" : "ghost"}
                onClick={() => setPlanningMode("planner")}
                className="rounded-full text-white"
              >
                <Users className="w-4 h-4 mr-2" />
                With Planner
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <SearchFilters
                budgetRange={budgetRange}
                setBudgetRange={setBudgetRange}
                selectedCategories={selectedCategories}
                setSelectedCategories={setSelectedCategories}
                searchLocation={searchLocation}
                setSearchLocation={setSearchLocation}
              />
              
              <div className="mt-6">
                <BudgetTracker
                  totalBudget={800000}
                  budgetItems={budgetData}
                />
              </div>
            </div>

            {/* Results Section */}
            <div className="lg:col-span-3">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">
                    Wedding Vendors
                  </h2>
                  <p className="text-muted-foreground">
                    {mockVendors.length} vendors found in {searchLocation}
                  </p>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="flex rounded-lg border">
                    <Button
                      variant={viewMode === "grid" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("grid")}
                    >
                      <Grid className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("list")}
                    >
                      <List className="w-4 h-4" />
                    </Button>
                  </div>
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Sort by
                  </Button>
                </div>
              </div>

              {/* Vendor Grid */}
              <div className={`grid gap-6 ${
                viewMode === "grid" 
                  ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3" 
                  : "grid-cols-1"
              }`}>
                {mockVendors.map((vendor) => (
                  <VendorCard
                    key={vendor.id}
                    vendor={vendor}
                    onAddToWishlist={handleAddToWishlist}
                    onCompare={handleCompare}
                    onContact={handleContact}
                  />
                ))}
              </div>

              {/* Load More */}
              <div className="text-center mt-8">
                <Button variant="outline" size="lg">
                  Load More Vendors
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Planning Mode Info */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-3xl font-bold mb-6 text-foreground">
            Choose Your Planning Style
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-6 bg-gradient-card shadow-soft border-0">
              <Wand2 className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-3">DIY Planning</h3>
              <p className="text-muted-foreground mb-4">
                Get direct vendor contacts and plan everything yourself. 
                Perfect for hands-on couples who want full control.
              </p>
              <Badge className="bg-primary/10 text-primary">Commission-based</Badge>
            </Card>
            
            <Card className="p-6 bg-gradient-card shadow-soft border-0">
              <Users className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-3">With Planner</h3>
              <p className="text-muted-foreground mb-4">
                Share your detailed requirements with professional wedding planners. 
                Let experts handle the coordination.
              </p>
              <Badge className="bg-secondary text-secondary-foreground">Professional Service</Badge>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}