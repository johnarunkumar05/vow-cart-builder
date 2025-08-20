import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { CalendarIcon, ArrowLeft, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

export default function Questionnaire() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    yourName: "",
    fianceName: "",
    weddingDate: undefined as Date | undefined,
    budget: [500000]
  });

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Save to localStorage and navigate to timeline
      localStorage.setItem('weddingData', JSON.stringify(formData));
      navigate('/timeline');
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      navigate('/');
    }
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return formData.yourName && formData.fianceName;
      case 2:
        return formData.weddingDate;
      case 3:
        return formData.budget[0] > 0;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-background py-12 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Let's Build Your Dream Wedding
          </h1>
          <p className="text-muted-foreground text-lg">
            Step {step} of 3 - Tell us about your special day
          </p>
        </div>

        <Card className="shadow-elegant border-0">
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              {step === 1 && "About You & Your Partner"}
              {step === 2 && "When's the Big Day?"}
              {step === 3 && "What's Your Budget?"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Your Name
                  </label>
                  <Input
                    placeholder="Enter your name"
                    value={formData.yourName}
                    onChange={(e) => setFormData({...formData, yourName: e.target.value})}
                    className="text-lg p-4"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Your Fiancé's Name
                  </label>
                  <Input
                    placeholder="Enter your fiancé's name"
                    value={formData.fianceName}
                    onChange={(e) => setFormData({...formData, fianceName: e.target.value})}
                    className="text-lg p-4"
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="flex justify-center">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal p-4 text-lg",
                        !formData.weddingDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-5 w-5" />
                      {formData.weddingDate ? format(formData.weddingDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.weddingDate}
                      onSelect={(date) => setFormData({...formData, weddingDate: date})}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium text-foreground mb-4 block">
                    Wedding Budget: ₹{formData.budget[0].toLocaleString()}
                  </label>
                  <Slider
                    value={formData.budget}
                    onValueChange={(value) => setFormData({...formData, budget: value})}
                    max={2000000}
                    min={100000}
                    step={50000}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground mt-2">
                    <span>₹1L</span>
                    <span>₹20L</span>
                  </div>
                </div>
                <div className="bg-muted/30 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Don't worry, you can adjust your budget and allocate it across different 
                    categories in the next step.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-between mt-8">
          <Button variant="outline" onClick={handleBack} className="flex items-center">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button 
            onClick={handleNext} 
            disabled={!isStepValid()}
            className="bg-gradient-primary hover:opacity-90 flex items-center"
          >
            {step === 3 ? "Create Timeline" : "Next"}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}