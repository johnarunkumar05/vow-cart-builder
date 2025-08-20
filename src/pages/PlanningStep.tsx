import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, CheckCircle, ExternalLink, Lightbulb } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

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
}

const mockVendorsByCategory: Record<string, Vendor[]> = {
  dress: [
    {
      id: "1",
      name: "Bridal Couture Studio",
      price: "₹45,000",
      image: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400",
      rating: 4.8,
      reviews: 156,
      features: ["Designer Collection", "Custom Alterations", "Premium Fabrics"],
      website: "https://example.com"
    },
    {
      id: "2", 
      name: "Royal Wedding Attire",
      price: "₹52,000",
      image: "https://images.unsplash.com/photo-1566174824625-835060289ddb?w=400",
      rating: 4.9,
      reviews: 98,
      features: ["Handcrafted", "Traditional & Modern", "Fitting Service"],
      website: "https://example.com"
    }
  ],
  venue: [
    {
      id: "3",
      name: "Grand Palace Resort",
      price: "₹2,80,000",
      image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400",
      rating: 4.7,
      reviews: 234,
      features: ["Garden Setting", "AC Halls", "Parking", "Catering Included"],
      website: "https://example.com"
    }
  ]
};

export default function PlanningStep() {
  const navigate = useNavigate();
  const { stepId } = useParams();
  const { toast } = useToast();
  const [steps, setSteps] = useState<PlanningStep[]>([]);
  const [currentStep, setCurrentStep] = useState<PlanningStep | null>(null);
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [vendors, setVendors] = useState<Vendor[]>([]);

  useEffect(() => {
    const savedSteps = localStorage.getItem('planningSteps');
    if (savedSteps) {
      const parsedSteps = JSON.parse(savedSteps);
      setSteps(parsedSteps);
      const current = parsedSteps.find((step: PlanningStep) => step.id === stepId);
      setCurrentStep(current);
      
      // Load mock vendors based on step
      const categoryVendors = mockVendorsByCategory[stepId || ''] || [];
      setVendors(categoryVendors);
    } else {
      navigate('/timeline');
    }
  }, [stepId, navigate]);

  const currentStepIndex = steps.findIndex(step => step.id === stepId);
  const isLastStep = currentStepIndex === steps.length - 1;
  const nextStep = !isLastStep ? steps[currentStepIndex + 1] : null;

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
    if (option === "quiz") {
      toast({
        title: "Quiz feature coming soon!",
        description: "For now, check out our curated recommendations below"
      });
    }
  };

  const handleVendorSelect = (vendorId: string) => {
    // Mark step as completed
    const updatedSteps = steps.map(step => 
      step.id === stepId ? { ...step, completed: true } : step
    );
    setSteps(updatedSteps);
    localStorage.setItem('planningSteps', JSON.stringify(updatedSteps));
    
    toast({
      title: "Great choice!",
      description: "Vendor selected and step completed"
    });

    // Navigate to next step or checkout
    if (nextStep) {
      navigate(`/step/${nextStep.id}`);
    } else {
      navigate('/checkout');
    }
  };

  const skipStep = () => {
    if (nextStep) {
      navigate(`/step/${nextStep.id}`);
    } else {
      navigate('/checkout');
    }
  };

  if (!currentStep) return null;

  return (
    <div className="min-h-screen bg-background py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Button variant="outline" onClick={() => navigate('/timeline')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Timeline
          </Button>
          <div className="text-center">
            <Badge variant="outline" className="mb-2">
              Step {currentStepIndex + 1} of {steps.length}
            </Badge>
            <h1 className="text-3xl font-bold text-foreground">
              {currentStep.title}
            </h1>
            <p className="text-muted-foreground">
              Budget: ₹{currentStep.budget.toLocaleString()}
            </p>
          </div>
          <div></div>
        </div>

        {/* Option Selection */}
        <Card className="mb-8 shadow-elegant border-0">
          <CardHeader>
            <CardTitle className="text-center">How would you like to proceed?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <Card 
                className={`cursor-pointer transition-all ${
                  selectedOption === "have-in-mind" 
                    ? "ring-2 ring-primary bg-primary/5" 
                    : "hover:shadow-md"
                }`}
                onClick={() => handleOptionSelect("have-in-mind")}
              >
                <CardContent className="pt-6 text-center">
                  <CheckCircle className="w-12 h-12 mx-auto mb-4 text-primary" />
                  <h3 className="text-lg font-semibold mb-2">
                    I have something in mind
                  </h3>
                  <p className="text-muted-foreground">
                    Browse our curated recommendations that match your budget and style
                  </p>
                </CardContent>
              </Card>

              <Card 
                className={`cursor-pointer transition-all ${
                  selectedOption === "quiz" 
                    ? "ring-2 ring-primary bg-primary/5" 
                    : "hover:shadow-md"
                }`}
                onClick={() => handleOptionSelect("quiz")}
              >
                <CardContent className="pt-6 text-center">
                  <Lightbulb className="w-12 h-12 mx-auto mb-4 text-primary" />
                  <h3 className="text-lg font-semibold mb-2">
                    Take a quiz to find what suits me
                  </h3>
                  <p className="text-muted-foreground">
                    Answer a few questions to get personalized recommendations
                  </p>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Vendor Recommendations */}
        {selectedOption && (
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Recommended for You
            </h2>
            
            {vendors.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {vendors.map((vendor) => (
                  <Card key={vendor.id} className="shadow-soft border-0 overflow-hidden">
                    <div className="aspect-video overflow-hidden">
                      <img 
                        src={vendor.image} 
                        alt={vendor.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardContent className="pt-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-foreground">{vendor.name}</h3>
                        <Badge variant="secondary">{vendor.price}</Badge>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <span 
                              key={i} 
                              className={`text-sm ${i < Math.floor(vendor.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {vendor.rating} ({vendor.reviews} reviews)
                        </span>
                      </div>
                      
                      <div className="space-y-1 mb-4">
                        {vendor.features.map((feature, index) => (
                          <Badge key={index} variant="outline" className="mr-1 mb-1 text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          onClick={() => handleVendorSelect(vendor.id)}
                          className="flex-1"
                        >
                          Select This
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => window.open(vendor.website, '_blank')}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center mb-8">
                <p className="text-muted-foreground mb-4">
                  No vendors available for this category yet. 
                </p>
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
            Skip Step
          </Button>
          
          {nextStep ? (
            <Button variant="outline" onClick={() => navigate(`/step/${nextStep.id}`)}>
              Next: {nextStep.title}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button 
              onClick={() => navigate('/checkout')}
              className="bg-gradient-primary hover:opacity-90"
            >
              Go to Checkout
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}