import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Zap, Trophy, Play, BarChart3, TrendingUp, Medal, Target, Clock } from "lucide-react";
import { Link } from "wouter";
import AchievementBadge from "@/components/ui/achievement-badge";
import PerformanceChart from "@/components/ui/performance-chart";

export default function Dashboard() {
  const { toast } = useToast();
  const { user, isAuthenticated, isLoading } = useAuth();

  // Redirect to home if not authenticated
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

  const { data: recentResults = [], isLoading: resultsLoading } = useQuery({
    queryKey: ["/api/test-results/recent"],
    retry: false,
  });

  const { data: userAchievements = [], isLoading: achievementsLoading } = useQuery({
    queryKey: ["/api/achievements/user"],
    retry: false,
  });

  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ["/api/analytics"],
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  const firstName = user?.firstName || "Athlete";
  const totalTests = analytics?.totalTests || 0;
  const recentAchievements = userAchievements.slice(0, 3);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-[100] bg-card border-b border-border px-4 py-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <Zap className="text-white" size={16} />
            </div>
            <div>
              <h1 data-testid="text-app-title" className="text-lg font-bold text-foreground">AthletiQon</h1>
              <p className="text-xs text-muted-foreground">Elite Performance</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              data-testid="button-notifications"
              size="sm"
              variant="ghost"
              className="w-10 h-10 bg-muted rounded-full p-0"
            >
              <Trophy className="text-accent" size={16} />
            </Button>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-secondary to-primary flex items-center justify-center">
              <span className="text-sm font-bold text-white">
                {firstName.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="px-4 py-6">
        {/* Hero Section with Stats */}
        <section className="mb-6">
          <div className="relative rounded-xl overflow-hidden mb-6 chart-container p-6">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20"></div>
            <div className="relative z-10">
              <h2 data-testid="text-welcome" className="text-2xl font-bold mb-2">Welcome Back, {firstName}!</h2>
              <p className="text-muted-foreground mb-4">Ready to crush your personal records today?</p>
              
              {/* Quick Stats Grid */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div data-testid="text-total-tests" className="text-2xl font-bold text-accent">{totalTests}</div>
                  <div className="text-xs text-muted-foreground">Tests Completed</div>
                </div>
                <div className="text-center">
                  <div data-testid="text-state-ranking" className="text-2xl font-bold text-primary">--</div>
                  <div className="text-xs text-muted-foreground">State Ranking</div>
                </div>
                <div className="text-center">
                  <div data-testid="text-achievement-count" className="text-2xl font-bold text-secondary">{userAchievements.length}</div>
                  <div className="text-xs text-muted-foreground">Achievements</div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Achievement Banner */}
          {recentAchievements.length > 0 && (
            <div className="gradient-border mb-6 achievement-glow">
              <div className="p-4 flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-accent to-primary rounded-full flex items-center justify-center">
                  <Trophy className="text-white" size={20} />
                </div>
                <div className="flex-1">
                  <h3 data-testid="text-recent-achievement" className="font-semibold text-accent">Recent Achievement!</h3>
                  <p className="text-sm text-muted-foreground">{recentAchievements[0].name}</p>
                </div>
                <Link href="/profile">
                  <Button data-testid="button-view-achievement" size="sm" variant="ghost">
                    <TrendingUp className="text-muted-foreground" size={16} />
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </section>

        {/* Quick Actions */}
        <section className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <Link href="/tests">
              <Button 
                data-testid="button-start-test"
                className="bg-primary hover:bg-primary/90 text-primary-foreground p-4 rounded-xl flex flex-col items-center space-y-2 transition-all duration-200 transform hover:scale-105 w-full h-auto"
              >
                <Play size={24} />
                <span className="font-medium">Start Test</span>
              </Button>
            </Link>
            
            <Link href="/analytics">
              <Button 
                data-testid="button-view-progress"
                className="bg-accent hover:bg-accent/90 text-accent-foreground p-4 rounded-xl flex flex-col items-center space-y-2 transition-all duration-200 transform hover:scale-105 w-full h-auto"
              >
                <BarChart3 size={24} />
                <span className="font-medium">View Progress</span>
              </Button>
            </Link>
          </div>
        </section>

        {/* Recent Test Results */}
        <section className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Recent Tests</h3>
            <Link href="/tests">
              <Button data-testid="button-view-all-tests" variant="ghost" size="sm" className="text-accent">
                View All
              </Button>
            </Link>
          </div>
          
          {resultsLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : recentResults.length > 0 ? (
            <div className="space-y-3">
              {recentResults.map((result: any, index: number) => (
                <Card key={result.id} data-testid={`card-test-result-${index}`} className="test-card">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                        <Target className="text-primary" size={20} />
                      </div>
                      <div>
                        <h4 className="font-medium">{result.testName}</h4>
                        <p className="text-sm text-muted-foreground">
                          {result.value} {result.testUnit}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary" className="text-xs">
                        {result.testCategory}
                      </Badge>
                      <div className="text-xs text-muted-foreground mt-1">
                        <Clock size={12} className="inline mr-1" />
                        {new Date(result.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card data-testid="card-no-tests">
              <CardContent className="p-6 text-center">
                <Target className="mx-auto mb-4 text-muted-foreground" size={48} />
                <h4 className="font-medium mb-2">No tests completed yet</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Start your fitness journey by taking your first test
                </p>
                <Link href="/tests">
                  <Button data-testid="button-start-first-test" size="sm">
                    Take Your First Test
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </section>

        {/* Performance Analytics Preview */}
        <section className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Performance Overview</h3>
            <Link href="/analytics">
              <Button data-testid="button-detailed-analytics" variant="ghost" size="sm" className="text-accent">
                Detailed View
              </Button>
            </Link>
          </div>
          
          {analyticsLoading ? (
            <Skeleton className="h-48 w-full" />
          ) : (
            <PerformanceChart data={analytics} />
          )}
        </section>

        {/* Achievement Showcase */}
        <section className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Recent Achievements</h3>
            <Link href="/profile">
              <Button data-testid="button-view-all-achievements" variant="ghost" size="sm" className="text-accent">
                View All
              </Button>
            </Link>
          </div>
          
          {achievementsLoading ? (
            <div className="flex space-x-4 overflow-x-auto pb-2">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="flex-shrink-0 w-24 h-32" />
              ))}
            </div>
          ) : recentAchievements.length > 0 ? (
            <div className="flex space-x-4 overflow-x-auto pb-2">
              {recentAchievements.map((achievement: any, index: number) => (
                <AchievementBadge key={achievement.id} achievement={achievement} testId={`achievement-${index}`} />
              ))}
            </div>
          ) : (
            <Card data-testid="card-no-achievements">
              <CardContent className="p-6 text-center">
                <Medal className="mx-auto mb-4 text-muted-foreground" size={48} />
                <h4 className="font-medium mb-2">No achievements yet</h4>
                <p className="text-sm text-muted-foreground">
                  Complete tests to unlock your first achievement
                </p>
              </CardContent>
            </Card>
          )}
        </section>
      </main>
    </div>
  );
}
