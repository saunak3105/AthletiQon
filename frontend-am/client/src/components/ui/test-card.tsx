import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, TrendingUp, TrendingDown, Minus, Clock } from "lucide-react";

interface TestCardProps {
  test: {
    id: string;
    name: string;
    description: string;
    unit: string;
    category: string;
    instructions?: string;
  };
  lastResult?: {
    id: string;
    value: string;
    createdAt: string;
  };
  onStartTest: () => void;
  testId?: string;
}

export default function TestCard({ test, lastResult, onStartTest, testId }: TestCardProps) {
  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'speed':
        return '⚡';
      case 'strength':
        return '💪';
      case 'agility':
        return '🔄';
      case 'endurance':
        return '🏃';
      case 'power':
        return '🎯';
      default:
        return '⏱️';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'speed':
        return 'bg-primary/20 text-primary border-primary/20';
      case 'strength':
        return 'bg-secondary/20 text-secondary border-secondary/20';
      case 'agility':
        return 'bg-accent/20 text-accent border-accent/20';
      case 'endurance':
        return 'bg-chart-4/20 text-chart-4 border-chart-4/20';
      case 'power':
        return 'bg-chart-5/20 text-chart-5 border-chart-5/20';
      default:
        return 'bg-muted/20 text-muted-foreground border-muted/20';
    }
  };

  const getProgressIndicator = () => {
    // Since we don't have historical data, we'll show a neutral state
    return (
      <div className="flex items-center space-x-1 text-muted-foreground">
        <Minus size={14} />
        <span className="text-xs">First test</span>
      </div>
    );
  };

  return (
    <Card 
      data-testid={testId || `test-card-${test.id}`}
      className="test-card border-border hover:border-primary/50 transition-all duration-200"
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-1">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-xl ${getCategoryColor(test.category)}`}>
              {getCategoryIcon(test.category)}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <h4 data-testid={`test-name-${test.id}`} className="font-medium truncate">
                  {test.name}
                </h4>
                <Badge 
                  variant="outline" 
                  className={`text-xs ${getCategoryColor(test.category)}`}
                >
                  {test.category}
                </Badge>
              </div>
              
              {lastResult ? (
                <div className="space-y-1">
                  <p data-testid={`last-result-${test.id}`} className="text-sm text-muted-foreground">
                    Last: <span className="font-medium text-foreground">
                      {parseFloat(lastResult.value).toFixed(2)} {test.unit}
                    </span>
                  </p>
                  <div className="flex items-center space-x-2">
                    {getProgressIndicator()}
                    <span className="text-xs text-muted-foreground flex items-center space-x-1">
                      <Clock size={10} />
                      <span>{new Date(lastResult.createdAt).toLocaleDateString()}</span>
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No previous results
                </p>
              )}
            </div>
          </div>
          
          <Button
            data-testid={`button-start-test-${test.id}`}
            onClick={onStartTest}
            size="sm"
            className="bg-primary hover:bg-primary/90 ml-4"
          >
            <Play size={14} className="mr-1" />
            Start
          </Button>
        </div>
        
        {test.description && (
          <div className="mt-3 pt-3 border-t border-border">
            <p className="text-xs text-muted-foreground">
              {test.description}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
