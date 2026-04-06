import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, CheckCircle, Lightbulb, ExternalLink, CalendarDays } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import CategoryQuiz from "@/components/CategoryQuiz";

interface PlanningStep {
  id: string;
  title: string;
  budget: number;
  completed: boolean;
  order: number;
}

interface Vendor {
  id: string;
  name: string;
  price: string;
  image: string;
  rating: number;
  reviews: number;
  features: string[];
  website: string;
  availableDates?: string[];
}

const mockVendorsByCategory: Record<string, Vendor[]> = {
  venue: [
    {
      id: "v1",
      name: "Grand Palace Resort",
      price: "₹2,80,000",
      image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400",
      rating: 4.7,
      reviews: 234,
      features: ["Garden Setting", "AC Halls", "Parking", "Catering Included"],
      website: "https://example.com",
      availableDates: ["2026-06-14", "2026-06-21", "2026-07-05", "2026-07-19"],
    },
    {
      id: "v2",
      name: "Royal Orchid Banquets",
      price: "₹3,50,000",
      image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400",
      rating: 4.9,
      reviews: 312,
      features: ["5-Star", "Poolside", "Bridal Suite", "Valet Parking"],
      website: "https://example.com",
      availableDates: ["2026-05-30", "2026-06-07", "2026-06-28", "2026-08-02"],
    },
    {
      id: "v3",
      name: "Sunset Beach Resort",
      price: "₹2,20,000",
      image: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=400",
      rating: 4.6,
      reviews: 178,
      features: ["Beachfront", "Open Air", "Bonfire Area", "Stay Packages"],
      website: "https://example.com",
      availableDates: ["2026-06-07", "2026-06-14", "2026-07-12", "2026-08-09"],
    },
  ],
  dress: [
    {
      id: "d1",
      name: "Bridal Couture Studio",
      price: "₹45,000",
      image: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400",
      rating: 4.8,
      reviews: 156,
      features: ["Designer Collection", "Custom Alterations", "Premium Fabrics"],
      website: "https://example.com",
    },
    {
      id: "d2",
      name: "Royal Wedding Attire",
      price: "₹52,000",
      image: "https://images.unsplash.com/photo-1566174824625-835060289ddb?w=400",
      rating: 4.9,
      reviews: 98,
      features: ["Handcrafted", "Traditional & Modern", "Fitting Service"],
      website: "https://example.com",
    },
    {
      id: "d3",
      name: "Elegance Bridal House",
      price: "₹38,000",
      image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400",
      rating: 4.7,
      reviews: 210,
      features: ["Budget Friendly", "Wide Range", "Same-day Alterations"],
      website: "https://example.com",
    },
  ],
  catering: [
    {
      id: "c1",
      name: "Spice Route Catering",
      price: "₹1,200/plate",
      image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400",
      rating: 4.7,
      reviews: 156,
      features: ["Multi-cuisine", "Live Counters", "Vegan Options"],
      website: "https://example.com",
    },
    {
      id: "c2",
      name: "Royal Feast Caterers",
      price: "₹1,800/plate",
      image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400",
      rating: 4.9,
      reviews: 89,
      features: ["Premium Menu", "Custom Menus", "Dessert Bar"],
      website: "https://example.com",
    },
    {
      id: "c3",
      name: "Green Leaf Kitchen",
      price: "₹900/plate",
      image: "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=400",
      rating: 4.5,
      reviews: 67,
      features: ["Pure Veg", "Organic", "Traditional Recipes"],
      website: "https://example.com",
    },
  ],
  photography: [
    {
      id: "p1",
      name: "Memories Photography",
      price: "₹75,000",
      image: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=400",
      rating: 4.9,
      reviews: 89,
      features: ["Candid", "Traditional", "Pre-wedding", "Drone"],
      website: "https://example.com",
    },
    {
      id: "p2",
      name: "Pixel Perfect Studios",
      price: "₹95,000",
      image: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=400",
      rating: 4.8,
      reviews: 145,
      features: ["Cinematic Video", "Same-day Edit", "Photo Album"],
      website: "https://example.com",
    },
    {
      id: "p3",
      name: "Candid Clicks",
      price: "₹55,000",
      image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=400",
      rating: 4.6,
      reviews: 72,
      features: ["Candid Only", "Natural Light", "Quick Delivery"],
      website: "https://example.com",
    },
  ],
  decoration: [
    {
      id: "dec1",
      name: "Floral Fantasy Decor",
      price: "₹1,20,000",
      image: "https://images.unsplash.com/photo-1478146059778-26028b07395a?w=400",
      rating: 4.8,
      reviews: 134,
      features: ["Fresh Flowers", "Stage Setup", "Lighting"],
      website: "https://example.com",
    },
    {
      id: "dec2",
      name: "Dream Décor Studio",
      price: "₹85,000",
      image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400",
      rating: 4.7,
      reviews: 98,
      features: ["Themed Setups", "LED Walls", "Draping"],
      website: "https://example.com",
    },
    {
      id: "dec3",
      name: "Royal Touch Events",
      price: "₹1,50,000",
      image: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=400",
      rating: 4.9,
      reviews: 201,
      features: ["Luxury Mandap", "Full Venue", "Custom Themes"],
      website: "https://example.com",
    },
  ],
  music: [
    {
      id: "m1",
      name: "BeatDrop DJ Services",
      price: "₹40,000",
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400",
      rating: 4.7,
      reviews: 89,
      features: ["DJ + Sound", "LED Setup", "Fog Machine"],
      website: "https://example.com",
    },
    {
      id: "m2",
      name: "Melody Live Band",
      price: "₹65,000",
      image: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=400",
      rating: 4.9,
      reviews: 67,
      features: ["Live Band", "Bollywood + Western", "Sangeet Special"],
      website: "https://example.com",
    },
    {
      id: "m3",
      name: "Sound & Soul Entertainment",
      price: "₹50,000",
      image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400",
      rating: 4.6,
      reviews: 45,
      features: ["Full Setup", "Emcee", "Choreography"],
      website: "https://example.com",
    },
  ],
};

export default function PlanningStep() {
  const navigate = useNavigate();
  const { stepId } = useParams();
  const { toast } = useToast();
  const [steps, setSteps] = useState<PlanningStep[]>([]);
  const [currentStep, setCurrentStep] = useState<PlanningStep | null>(null);
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [showQuiz, setShowQuiz] = useState(false);
  const [selectedVenueDate, setSelectedVenueDate] = useState<string>("");

  const isVenueStep = stepId === "venue";

  useEffect(() => {
    const savedSteps = localStorage.getItem("planningSteps");
    if (savedSteps) {
      const parsedSteps = JSON.parse(savedSteps);
      setSteps(parsedSteps);
      setCurrentStep(parsedSteps.find((s: PlanningStep) => s.id === stepId) || null);
      setVendors(mockVendorsByCategory[stepId || ""] || []);
    } else {
      navigate("/timeline");
    }
    setSelectedOption("");
    setShowQuiz(false);
    setSelectedVenueDate("");
  }, [stepId, navigate]);

  const currentStepIndex = steps.findIndex((s) => s.id === stepId);
  const isLastStep = currentStepIndex === steps.length - 1;
  const nextStep = !isLastStep ? steps[currentStepIndex + 1] : null;

  const handleOptionSelect = (option: string) => {
    if (option === "quiz") {
      setShowQuiz(true);
      setSelectedOption("quiz");
    } else {
      setSelectedOption(option);
      setShowQuiz(false);
    }
  };

  const handleQuizComplete = (answers: Record<string, string>) => {
    setShowQuiz(false);
    setSelectedOption("have-in-mind");
    toast({
      title: "Great choices!",
      description: "We've found the best matches based on your answers",
    });
  };

  const handleVendorSelect = (vendorId: string) => {
    if (isVenueStep && !selectedVenueDate) {
      toast({ title: "Please select a date", description: "Pick an available date for this venue first" });
      return;
    }

    const updatedSteps = steps.map((s) => (s.id === stepId ? { ...s, completed: true } : s));
    setSteps(updatedSteps);
    localStorage.setItem("planningSteps", JSON.stringify(updatedSteps));

    if (isVenueStep && selectedVenueDate) {
      const weddingData = JSON.parse(localStorage.getItem("weddingData") || "{}");
      weddingData.weddingDate = selectedVenueDate;
      localStorage.setItem("weddingData", JSON.stringify(weddingData));
      toast({ title: "Venue & date locked in!", description: `Wedding date set to ${new Date(selectedVenueDate).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}` });
    } else {
      toast({ title: "Great choice!", description: "Vendor selected and step completed" });
    }

    if (nextStep) {
      navigate(`/step/${nextStep.id}`);
    } else {
      navigate("/checkout");
    }
  };

  const skipStep = () => {
    if (nextStep) navigate(`/step/${nextStep.id}`);
    else navigate("/checkout");
  };

  if (!currentStep) return null;

  return (
    <div className="min-h-screen bg-background py-12 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button variant="outline" onClick={() => navigate("/timeline")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Timeline
          </Button>
          <div className="text-center">
            <Badge variant="outline" className="mb-2">
              Step {currentStepIndex + 1} of {steps.length}
            </Badge>
            <h1 className="text-3xl font-bold text-foreground">{currentStep.title}</h1>
            <p className="text-muted-foreground">Budget: ₹{currentStep.budget.toLocaleString()}</p>
          </div>
          <div />
        </div>

        {/* Quiz Mode */}
        {showQuiz && (
          <div className="mb-8">
            <CategoryQuiz
              category={stepId || ""}
              onComplete={handleQuizComplete}
              onCancel={() => {
                setShowQuiz(false);
                setSelectedOption("");
              }}
            />
          </div>
        )}

        {/* Option Selection (hidden during quiz) */}
        {!showQuiz && !selectedOption && (
          <Card className="mb-8 shadow-elegant border-0">
            <CardHeader>
              <CardTitle className="text-center">How would you like to proceed?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <Card
                  className="cursor-pointer transition-all hover:shadow-md hover:ring-2 hover:ring-primary/50"
                  onClick={() => handleOptionSelect("have-in-mind")}
                >
                  <CardContent className="pt-6 text-center">
                    <CheckCircle className="w-12 h-12 mx-auto mb-4 text-primary" />
                    <h3 className="text-lg font-semibold mb-2">I have something in mind</h3>
                    <p className="text-muted-foreground">
                      Browse our curated recommendations that match your budget and style
                    </p>
                  </CardContent>
                </Card>

                <Card
                  className="cursor-pointer transition-all hover:shadow-md hover:ring-2 hover:ring-primary/50"
                  onClick={() => handleOptionSelect("quiz")}
                >
                  <CardContent className="pt-6 text-center">
                    <Lightbulb className="w-12 h-12 mx-auto mb-4 text-primary" />
                    <h3 className="text-lg font-semibold mb-2">Take a quiz to find out</h3>
                    <p className="text-muted-foreground">
                      Answer a few questions and we'll match you with the best options
                    </p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Vendor Recommendations */}
        {selectedOption && !showQuiz && (
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6">Recommended for You</h2>

            {vendors.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {vendors.map((vendor) => (
                  <Card key={vendor.id} className="shadow-soft border-0 overflow-hidden">
                    <div className="aspect-video overflow-hidden">
                      <img src={vendor.image} alt={vendor.name} className="w-full h-full object-cover" />
                    </div>
                    <CardContent className="pt-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-foreground">{vendor.name}</h3>
                        <Badge variant="secondary">{vendor.price}</Badge>
                      </div>

                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={`text-sm ${i < Math.floor(vendor.rating) ? "text-yellow-400" : "text-muted"}`}>
                              ★
                            </span>
                          ))}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {vendor.rating} ({vendor.reviews} reviews)
                        </span>
                      </div>

                      <div className="space-y-1 mb-4">
                        {vendor.features.map((feature, idx) => (
                          <Badge key={idx} variant="outline" className="mr-1 mb-1 text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>

                      {/* Venue-specific: date picker */}
                      {isVenueStep && vendor.availableDates && (
                        <div className="mb-4">
                          <p className="text-sm font-medium text-foreground mb-2 flex items-center gap-1">
                            <CalendarDays className="w-4 h-4" />
                            Available Dates
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {vendor.availableDates.map((date) => {
                              const isSelected = selectedVenueDate === date;
                              const formatted = new Date(date).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              });
                              return (
                                <button
                                  key={date}
                                  onClick={() => setSelectedVenueDate(date)}
                                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                                    isSelected
                                      ? "bg-primary text-primary-foreground border-primary"
                                      : "bg-background border-border hover:border-primary hover:bg-primary/5"
                                  }`}
                                >
                                  {formatted}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      <div className="flex gap-2">
                        <Button onClick={() => handleVendorSelect(vendor.id)} className="flex-1">
                          {isVenueStep ? "Select Venue & Date" : "Select This"}
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => window.open(vendor.website, "_blank")}>
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center mb-8">
                <p className="text-muted-foreground mb-4">No vendors available for this category yet.</p>
                <Button variant="outline" onClick={skipStep}>
                  Skip This Step
                </Button>
              </Card>
            )}
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between">
          <Button variant="outline" onClick={skipStep}>
            {isVenueStep ? "Skip (not recommended)" : "Skip Step"}
          </Button>

          {nextStep ? (
            <Button variant="outline" onClick={() => navigate(`/step/${nextStep.id}`)}>
              Next: {nextStep.title}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={() => navigate("/checkout")} className="bg-gradient-primary hover:opacity-90">
              Go to Checkout
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
