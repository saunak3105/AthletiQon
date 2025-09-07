import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingUp, Activity } from "lucide-react";

interface PerformanceChartProps {
  data: any;
  showDetails?: boolean;
}

export default function PerformanceChart({ data, showDetails = false }: PerformanceChartProps) {
  if (!data || !data.performanceByCategory) {
    return (
      <Card data-testid="card-performance-chart-empty">
        <CardContent className="p-6 text-center">
          <BarChart3 className="mx-auto mb-4 text-muted-foreground" size={48} />
          <h4 className="font-medium mb-2">No performance data yet</h4>
          <p className="text-sm text-muted-foreground">
            Complete some tests to see your performance trends
          </p>
        </CardContent>
      </Card>
    );
  }

  const categories = Object.keys(data.performanceByCategory);
  const totalTests = data.totalTests || 0;

  // Calculate overall progress trend
  const getOverallTrend = () => {
    if (totalTests === 0) return 0;
    
    let totalImprovement = 0;
    let categoryCount = 0;
    
    Object.values(data.performanceByCategory).forEach((categoryData: any) => {
      if (categoryData.length > 1) {
        const first = categoryData[0].value;
        const last = categoryData[categoryData.length - 1].value;
        totalImprovement += ((last - first) / first) * 100;
        categoryCount++;
      }
    });
    
    return categoryCount > 0 ? totalImprovement / categoryCount : 0;
  };

  const overallTrend = getOverallTrend();

  return (
    <Card data-testid="card-performance-chart" className="chart-container">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center space-x-2">
            <BarChart3 className="text-primary" size={20} />
            <span>Performance Overview</span>
          </span>
          {showDetails && (
            <Badge variant="outline" className="text-xs">
              {totalTests} Tests
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Overall Score Display */}
          <div className="text-center py-4">
            <div className="text-3xl font-bold text-accent mb-2" data-testid="text-overall-trend">
              {overallTrend > 0 ? '+' : ''}{overallTrend.toFixed(1)}%
            </div>
            <div className="text-sm text-muted-foreground flex items-center justify-center space-x-1">
              <TrendingUp className={overallTrend >= 0 ? 'text-accent' : 'text-destructive'} size={14} />
              <span>Overall Trend</span>
            </div>
          </div>

          {/* Category Performance Bars */}
          {categories.length > 0 ? (
            <div className="space-y-4">
              <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                Performance by Category
              </h4>
              
              {categories.map((category, index) => {
                const categoryData = data.performanceByCategory[category];
                const avgValue = categoryData.reduce((sum: number, item: any) => sum + item.value, 0) / categoryData.length;
                const maxValue = Math.max(...categories.map(cat => {
                  const data = data.performanceByCategory[cat];
                  return data.reduce((sum: number, item: any) => sum + item.value, 0) / data.length;
                }));
                const percentage = (avgValue / maxValue) * 100;
                
                const getBarColor = (index: number) => {
                  const colors = ['bg-primary', 'bg-accent', 'bg-secondary', 'bg-chart-4', 'bg-chart-5'];
                  return colors[index % colors.length];
                };

                return (
                  <div key={category} data-testid={`performance-bar-${category}`} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium capitalize">{category}</span>
                      <span className="text-sm text-muted-foreground">
                        {avgValue.toFixed(1)} avg
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${getBarColor(index)}`}
                        style={{ width: `${Math.max(percentage, 5)}%` }}
                      />
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {categoryData.length} test{categoryData.length !== 1 ? 's' : ''} completed
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-6">
              <Activity className="mx-auto mb-2 text-muted-foreground" size={32} />
              <p className="text-sm text-muted-foreground">
                No category data available
              </p>
            </div>
          )}

          {/* Recent Activity Summary */}
          {showDetails && data.recentActivity && data.recentActivity.length > 0 && (
            <div className="border-t border-border pt-4">
              <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide mb-3">
                Recent Activity
              </h4>
              <div className="grid grid-cols-6 gap-2">
                {data.recentActivity.slice(0, 6).map((activity: any, index: number) => (
                  <div 
                    key={index}
                    data-testid={`activity-dot-${index}`}
                    className="h-8 bg-gradient-to-t from-primary/60 to-primary rounded"
                    style={{ 
                      height: `${Math.max(20 + (activity.value % 30), 20)}px`,
                      opacity: 1 - (index * 0.1)
                    }}
                    title={`${activity.testName}: ${activity.value} ${activity.testUnit}`}
                  />
                ))}
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>Oldest</span>
                <span>Most Recent</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
