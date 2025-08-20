import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PieChart, TrendingUp, AlertCircle } from "lucide-react";

interface BudgetItem {
  category: string;
  allocated: number;
  spent: number;
  vendors: number;
}

interface BudgetTrackerProps {
  totalBudget: number;
  budgetItems: BudgetItem[];
}

export default function BudgetTracker({ totalBudget, budgetItems }: BudgetTrackerProps) {
  const totalSpent = budgetItems.reduce((sum, item) => sum + item.spent, 0);
  const totalAllocated = budgetItems.reduce((sum, item) => sum + item.allocated, 0);
  const remaining = totalBudget - totalSpent;
  const progressPercentage = (totalSpent / totalBudget) * 100;

  return (
    <Card className="p-6 bg-gradient-card shadow-soft border-0">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <PieChart className="w-5 h-5" />
            Budget Tracker
          </h3>
          <Button size="sm" variant="outline">
            Export Receipt
          </Button>
        </div>

        {/* Overall Budget Overview */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Total Budget</span>
            <span className="font-semibold">₹{totalBudget.toLocaleString()}</span>
          </div>
          
          <Progress value={progressPercentage} className="h-3" />
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-primary">₹{totalSpent.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">Spent</div>
            </div>
            <div>
              <div className="text-lg font-bold text-green-600">₹{remaining.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">Remaining</div>
            </div>
            <div>
              <div className="text-lg font-bold text-muted-foreground">₹{totalAllocated.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">Allocated</div>
            </div>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="space-y-3">
          <h4 className="font-medium text-foreground">Category Breakdown</h4>
          <div className="space-y-3">
            {budgetItems.map((item, index) => {
              const categoryProgress = item.allocated > 0 ? (item.spent / item.allocated) * 100 : 0;
              const isOverBudget = item.spent > item.allocated;
              
              return (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{item.category}</span>
                      {isOverBudget && <AlertCircle className="w-4 h-4 text-destructive" />}
                      <Badge variant="secondary" className="text-xs">
                        {item.vendors} vendors
                      </Badge>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">
                        ₹{item.spent.toLocaleString()} / ₹{item.allocated.toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <Progress 
                    value={Math.min(categoryProgress, 100)} 
                    className={`h-2 ${isOverBudget ? 'text-destructive' : ''}`}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-2">
          <h4 className="font-medium text-foreground">Quick Actions</h4>
          <div className="grid grid-cols-2 gap-2">
            <Button size="sm" variant="outline" className="text-xs">
              <TrendingUp className="w-4 h-4 mr-1" />
              Adjust Budget
            </Button>
            <Button size="sm" variant="outline" className="text-xs">
              Add Category
            </Button>
          </div>
        </div>

        {/* Budget Health */}
        <div className="p-3 rounded-lg bg-muted/30">
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-2 h-2 rounded-full ${
              progressPercentage < 70 ? 'bg-green-500' : 
              progressPercentage < 90 ? 'bg-yellow-500' : 'bg-red-500'
            }`} />
            <span className="text-sm font-medium">
              Budget Health: {
                progressPercentage < 70 ? 'Good' : 
                progressPercentage < 90 ? 'Caution' : 'Over Budget'
              }
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            {progressPercentage < 70 
              ? "You're within budget limits. Great planning!"
              : progressPercentage < 90
              ? "Getting close to budget limit. Consider reviewing expenses."
              : "You've exceeded your budget. Time to reassess priorities."
            }
          </p>
        </div>
      </div>
    </Card>
  );
}