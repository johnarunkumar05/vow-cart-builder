import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { ArrowLeft, Plus, Trash2, Edit3, Check, X, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface PlanningStep {
  id: string;
  title: string;
  budget: number;
  completed: boolean;
  order: number;
}

const defaultSteps: PlanningStep[] = [
  { id: "venue", title: "Book Venue & Pick Date", budget: 300000, completed: false, order: 1 },
  { id: "dress", title: "Find Wedding Dress", budget: 50000, completed: false, order: 2 },
  { id: "catering", title: "Select Catering", budget: 150000, completed: false, order: 3 },
  { id: "photography", title: "Hire Photographer", budget: 80000, completed: false, order: 4 },
  { id: "decoration", title: "Plan Decorations", budget: 100000, completed: false, order: 5 },
  { id: "music", title: "Arrange Music & DJ", budget: 50000, completed: false, order: 6 },
];

export default function Timeline() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [weddingData, setWeddingData] = useState<any>(null);
  const [steps, setSteps] = useState<PlanningStep[]>(defaultSteps);
  const [editingStep, setEditingStep] = useState<string | null>(null);
  const [newStepTitle, setNewStepTitle] = useState("");
  const [isAddingStep, setIsAddingStep] = useState(false);

  useEffect(() => {
    const savedData = localStorage.getItem("weddingData");
    if (savedData) {
      setWeddingData(JSON.parse(savedData));
    } else {
      navigate("/questionnaire");
    }
  }, [navigate]);

  const totalBudget = weddingData?.budget?.[0] || 0;
  const allocatedBudget = steps.reduce((sum, step) => sum + step.budget, 0);
  const remainingBudget = totalBudget - allocatedBudget;

  const updateStepBudget = (stepId: string, newBudget: number) => {
    setSteps(steps.map((s) => (s.id === stepId ? { ...s, budget: newBudget } : s)));
  };

  const deleteStep = (stepId: string) => {
    if (stepId === "venue") {
      toast({ title: "Cannot remove venue", description: "Venue & date selection is required" });
      return;
    }
    setSteps(steps.filter((s) => s.id !== stepId));
    toast({ title: "Step removed" });
  };

  const updateStepTitle = (stepId: string, newTitle: string) => {
    setSteps(steps.map((s) => (s.id === stepId ? { ...s, title: newTitle } : s)));
    setEditingStep(null);
  };

  const addNewStep = () => {
    if (newStepTitle.trim()) {
      const newStep: PlanningStep = {
        id: Date.now().toString(),
        title: newStepTitle,
        budget: Math.max(0, Math.floor(remainingBudget / 2)),
        completed: false,
        order: steps.length + 1,
      };
      setSteps([...steps, newStep]);
      setNewStepTitle("");
      setIsAddingStep(false);
      toast({ title: "Step added" });
    }
  };

  const startPlanning = () => {
    localStorage.setItem("planningSteps", JSON.stringify(steps));
    navigate(`/step/${steps[0].id}`);
  };

  if (!weddingData) return null;

  return (
    <div className="min-h-screen bg-background py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Button variant="outline" onClick={() => navigate("/questionnaire")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground">
              {weddingData.yourName} & {weddingData.fianceName}'s Timeline
            </h1>
            <p className="text-muted-foreground mt-1">
              <MapPin className="w-4 h-4 inline mr-1" />
              Date will be set when you pick a venue
            </p>
          </div>
          <div />
        </div>

        {/* Budget Overview */}
        <Card className="mb-8 shadow-elegant border-0">
          <CardHeader>
            <CardTitle>Budget Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-6 text-center">
              <div>
                <p className="text-2xl font-bold text-primary">₹{totalBudget.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Total Budget</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-secondary">₹{allocatedBudget.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Allocated</p>
              </div>
              <div>
                <p className={`text-2xl font-bold ${remainingBudget >= 0 ? "text-green-600" : "text-red-600"}`}>
                  ₹{remainingBudget.toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">Remaining</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Steps */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-foreground">Planning Steps</h2>
            <Button variant="outline" onClick={() => setIsAddingStep(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Step
            </Button>
          </div>

          {isAddingStep && (
            <Card className="border-dashed border-2 border-primary/30">
              <CardContent className="pt-6">
                <div className="flex gap-3">
                  <Input
                    placeholder="Enter step title..."
                    value={newStepTitle}
                    onChange={(e) => setNewStepTitle(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={addNewStep} size="sm">
                    <Check className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" onClick={() => setIsAddingStep(false)} size="sm">
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {steps.map((step, index) => (
            <Card
              key={step.id}
              className={`shadow-soft border-0 ${step.id === "venue" ? "ring-2 ring-primary/30 bg-primary/[0.02]" : ""}`}
            >
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Badge variant={step.id === "venue" ? "default" : "outline"} className="px-3">
                      {step.id === "venue" ? "⭐ Step 1" : `Step ${index + 1}`}
                    </Badge>
                    {editingStep === step.id ? (
                      <div className="flex gap-2">
                        <Input
                          value={step.title}
                          onChange={(e) => updateStepTitle(step.id, e.target.value)}
                          className="text-lg font-semibold"
                          onKeyDown={(e) => e.key === "Enter" && setEditingStep(null)}
                        />
                        <Button size="sm" onClick={() => setEditingStep(null)}>
                          <Check className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold text-foreground">{step.title}</h3>
                        <Button variant="ghost" size="sm" onClick={() => setEditingStep(step.id)}>
                          <Edit3 className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteStep(step.id)}
                    className="text-destructive hover:text-destructive"
                    disabled={step.id === "venue"}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                {step.id === "venue" && (
                  <p className="text-sm text-muted-foreground mb-3">
                    You'll pick your venue and wedding date together based on availability
                  </p>
                )}

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-medium">
                        Budget: ₹{step.budget.toLocaleString()}
                      </label>
                      <span className="text-xs text-muted-foreground">
                        {((step.budget / totalBudget) * 100).toFixed(1)}% of total
                      </span>
                    </div>
                    <Slider
                      value={[step.budget]}
                      onValueChange={([value]) => updateStepBudget(step.id, value)}
                      max={totalBudget}
                      min={0}
                      step={5000}
                      className="w-full"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-8">
          <Button
            size="lg"
            onClick={startPlanning}
            className="bg-gradient-primary hover:opacity-90 px-8"
            disabled={steps.length === 0}
          >
            Start Planning Process
          </Button>
        </div>
      </div>
    </div>
  );
}
