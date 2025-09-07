import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingUp, Calendar, Target, Activity, Zap } from "lucide-react";
import PerformanceChart from "@/components/ui/performance-chart";

export default function Analytics() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ["/api/analytics"],
    retry: false,
  });

  const { data: testResults = [], isLoading: resultsLoading } = useQuery({
    queryKey: ["/api/test-results"],
    retry: false,
  });

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'speed':
        return Zap;
      case 'strength':
        return Target;
      case 'agility':
        return Activity;
      case 'endurance':
        return TrendingUp;
      default:
        return BarChart3;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'speed':
        return 'text-primary';
      case 'strength':
        return 'text-secondary';
      case 'agility':
        return 'text-accent';
      case 'endurance':
        return 'text-chart-4';
      default:
        return 'text-muted-foreground';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-4">
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  const totalTests = analytics?.totalTests || 0;
  const performanceByCategory = analytics?.performanceByCategory || {};
  const recentActivity = analytics?.recentActivity || [];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-[100] bg-card border-b border-border px-4 py-4 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
            <BarChart3 className="text-white" size={16} />
          </div>
          <div>
            <h1 data-testid="text-page-title" className="text-lg font-bold">Performance Analytics</h1>
            <p className="text-sm text-muted-foreground">Track your progress and identify trends</p>
          </div>
        </div>
      </header>

      <main className="p-4 space-y-6">
        {/* Overview Stats */}
        <section>
          <h2 className="text-lg font-semibold mb-4">Overview</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card data-testid="card-total-tests">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary mb-1">{totalTests}</div>
                <div className="text-sm text-muted-foreground">Total Tests</div>
              </CardContent>
            </Card>
            
            <Card data-testid="card-categories-tested">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-accent mb-1">
                  {Object.keys(performanceByCategory).length}
                </div>
                <div className="text-sm text-muted-foreground">Categories</div>
              </CardContent>
            </Card>
            
            <Card data-testid="card-recent-activity">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-secondary mb-1">
                  {recentActivity.length}
                </div>
                <div className="text-sm text-muted-foreground">Recent Tests</div>
              </CardContent>
            </Card>
            
            <Card data-testid="card-improvement">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-chart-4 mb-1">--</div>
                <div className="text-sm text-muted-foreground">Avg Improvement</div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Performance Chart */}
        <section>
          <h2 className="text-lg font-semibold mb-4">Performance Trends</h2>
          {analyticsLoading ? (
            <Skeleton className="h-64 w-full" />
          ) : (
            <PerformanceChart data={analytics} showDetails />
          )}
        </section>

        {/* Category Breakdown */}
        <section>
          <h2 className="text-lg font-semibold mb-4">Performance by Category</h2>
          
          {analyticsLoading ? (
            <div className="grid gap-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          ) : Object.keys(performanceByCategory).length > 0 ? (
            <div className="grid gap-4">
              {Object.entries(performanceByCategory).map(([category, data]: [string, any]) => {
                const IconComponent = getCategoryIcon(category);
                const colorClass = getCategoryColor(category);
                const testCount = data.length;
                const avgPerformance = testCount > 0 
                  ? (data.reduce((sum: number, item: any) => sum + item.value, 0) / testCount).toFixed(2)
                  : "0";
                
                return (
                  <Card key={category} data-testid={`card-category-${category}`}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 bg-muted rounded-lg flex items-center justify-center`}>
                            <IconComponent className={colorClass} size={20} />
                          </div>
                          <div>
                            <h3 className="font-medium capitalize">{category}</h3>
                            <p className="text-sm text-muted-foreground">
                              {testCount} test{testCount !== 1 ? 's' : ''} completed
                            </p>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className={`text-lg font-bold ${colorClass}`}>
                            {avgPerformance}
                          </div>
                          <div className="text-xs text-muted-foreground">Average</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card data-testid="card-no-category-data">
              <CardContent className="p-6 text-center">
                <Target className="mx-auto mb-4 text-muted-foreground" size={48} />
                <h4 className="font-medium mb-2">No category data yet</h4>
                <p className="text-sm text-muted-foreground">
                  Complete tests in different categories to see your performance breakdown
                </p>
              </CardContent>
            </Card>
          )}
        </section>

        {/* Recent Activity */}
        <section>
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
          
          {resultsLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : recentActivity.length > 0 ? (
            <div className="space-y-3">
              {recentActivity.slice(0, 10).map((activity: any, index: number) => (
                <Card key={index} data-testid={`card-activity-${index}`}>
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <div>
                        <h4 className="font-medium">{activity.testName}</h4>
                        <p className="text-sm text-muted-foreground">
                          {new Date(activity.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="font-medium">
                        {activity.value} {activity.testUnit}
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {activity.testCategory}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card data-testid="card-no-activity">
              <CardContent className="p-6 text-center">
                <Calendar className="mx-auto mb-4 text-muted-foreground" size={48} />
                <h4 className="font-medium mb-2">No recent activity</h4>
                <p className="text-sm text-muted-foreground">
                  Start completing tests to see your activity timeline
                </p>
              </CardContent>
            </Card>
          )}
        </section>

        {/* Performance Insights */}
        <section>
          <h2 className="text-lg font-semibold mb-4">Performance Insights</h2>
          
          <Card data-testid="card-insights">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="text-accent" size={20} />
                <span>Key Insights</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {totalTests === 0 ? (
                  <p className="text-muted-foreground text-center">
                    Complete your first test to see personalized insights
                  </p>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                      <div>
                        <h4 className="font-medium">Test Frequency</h4>
                        <p className="text-sm text-muted-foreground">
                          You've completed {totalTests} test{totalTests !== 1 ? 's' : ''} so far. 
                          {totalTests < 5 && " Try to test regularly for better progress tracking."}
                        </p>
                      </div>
                    </div>
                    
                    {Object.keys(performanceByCategory).length > 0 && (
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-accent rounded-full mt-2"></div>
                        <div>
                          <h4 className="font-medium">Category Coverage</h4>
                          <p className="text-sm text-muted-foreground">
                            You've tested {Object.keys(performanceByCategory).length} different categories. 
                            Consider expanding to other areas for a complete fitness profile.
                          </p>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-secondary rounded-full mt-2"></div>
                      <div>
                        <h4 className="font-medium">Consistency Tip</h4>
                        <p className="text-sm text-muted-foreground">
                          Regular testing helps identify trends and track improvements over time. 
                          Aim to test at least once per week.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
