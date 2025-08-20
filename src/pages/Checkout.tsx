import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, CheckCircle, Download, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface PlanningStep {
  id: string;
  title: string;
  budget: number;
  completed: boolean;
  order: number;
}

export default function Checkout() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [weddingData, setWeddingData] = useState<any>(null);
  const [steps, setSteps] = useState<PlanningStep[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const savedWeddingData = localStorage.getItem('weddingData');
    const savedSteps = localStorage.getItem('planningSteps');
    
    if (savedWeddingData) {
      setWeddingData(JSON.parse(savedWeddingData));
    }
    if (savedSteps) {
      setSteps(JSON.parse(savedSteps));
    }
  }, []);

  const completedSteps = steps.filter(step => step.completed);
  const totalBudget = weddingData?.budget?.[0] || 0;
  const usedBudget = completedSteps.reduce((sum, step) => sum + step.budget, 0);
  const savings = totalBudget - usedBudget;

  const handleDownloadPlan = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      toast({
        title: "Wedding plan downloaded!",
        description: "Your complete wedding plan has been saved to your downloads"
      });
    }, 2000);
  };

  const handleStartFresh = () => {
    localStorage.removeItem('weddingData');
    localStorage.removeItem('planningSteps');
    navigate('/');
  };

  if (!weddingData) return null;

  return (
    <div className="min-h-screen bg-background py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Congratulations!
          </h1>
          <p className="text-xl text-muted-foreground">
            Your wedding plan is ready, {weddingData.yourName} & {weddingData.fianceName}!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Wedding Summary */}
          <Card className="shadow-elegant border-0">
            <CardHeader>
              <CardTitle>Wedding Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Wedding Date</p>
                <p className="font-semibold">
                  {weddingData.weddingDate && new Date(weddingData.weddingDate).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Total Budget</p>
                <p className="font-semibold text-2xl">₹{totalBudget.toLocaleString()}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Budget Used</p>
                <p className="font-semibold text-xl text-primary">₹{usedBudget.toLocaleString()}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Savings</p>
                <p className="font-semibold text-xl text-green-600">₹{savings.toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>

          {/* Completed Steps */}
          <Card className="shadow-elegant border-0">
            <CardHeader>
              <CardTitle>Completed Planning Steps</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {completedSteps.map((step, index) => (
                  <div key={step.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="font-medium">{step.title}</span>
                    </div>
                    <Badge variant="secondary">₹{step.budget.toLocaleString()}</Badge>
                  </div>
                ))}
                
                {steps.filter(step => !step.completed).map((step) => (
                  <div key={step.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg opacity-60">
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />
                      <span>{step.title}</span>
                    </div>
                    <Badge variant="outline">Skipped</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Separator className="my-8" />

        {/* Next Steps */}
        <Card className="shadow-elegant border-0 mb-8">
          <CardHeader>
            <CardTitle>What's Next?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="font-semibold text-primary">DIY Planning</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Download your complete wedding plan</li>
                  <li>• Contact vendors directly using provided information</li>
                  <li>• Use our budget tracker to stay on track</li>
                  <li>• Access planning tips and timelines</li>
                </ul>
              </div>
              
              <div className="space-y-3">
                <h3 className="font-semibold text-primary">Professional Planning</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Share your plan details with wedding planners</li>
                  <li>• Get quotes from certified professionals</li>
                  <li>• Let experts handle vendor coordination</li>
                  <li>• Enjoy stress-free wedding planning</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={handleDownloadPlan}
            disabled={isProcessing}
            className="bg-gradient-primary hover:opacity-90 px-8"
          >
            <Download className="w-4 h-4 mr-2" />
            {isProcessing ? "Preparing Download..." : "Download Wedding Plan"}
          </Button>
          
          <Button variant="outline" onClick={() => navigate('/')}>
            <Home className="w-4 h-4 mr-2" />
            Explore More Vendors
          </Button>
          
          <Button variant="outline" onClick={handleStartFresh}>
            Start New Wedding Plan
          </Button>
        </div>

        <div className="text-center mt-8">
          <Button variant="ghost" onClick={() => navigate('/timeline')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Timeline
          </Button>
        </div>
      </div>
    </div>
  );
}