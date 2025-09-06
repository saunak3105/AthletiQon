import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Crown, Medal, Star, Globe, MapPin } from "lucide-react";

export default function Leaderboards() {
  const { toast } = useToast();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [selectedState, setSelectedState] = useState("CA"); // Default to California

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

  const { data: stateLeaderboard = [], isLoading: stateLoading } = useQuery({
    queryKey: ["/api/leaderboards/state", selectedState],
    retry: false,
  });

  const { data: nationalLeaderboard = [], isLoading: nationalLoading } = useQuery({
    queryKey: ["/api/leaderboards/national"],
    retry: false,
  });

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="text-yellow-500" size={20} />;
      case 2:
        return <Medal className="text-gray-400" size={20} />;
      case 3:
        return <Medal className="text-amber-600" size={20} />;
      default:
        return <Star className="text-muted-foreground" size={16} />;
    }
  };

  const getRankStyle = (rank: number, isCurrentUser: boolean = false) => {
    if (isCurrentUser) {
      return "bg-accent/10 border border-accent/20";
    }
    
    switch (rank) {
      case 1:
        return "bg-yellow-500/10 border border-yellow-500/20";
      case 2:
        return "bg-gray-400/10 border border-gray-400/20";
      case 3:
        return "bg-amber-600/10 border border-amber-600/20";
      default:
        return "bg-muted/50";
    }
  };

  const LeaderboardList = ({ data, loading, type }: { data: any[], loading: boolean, type: 'state' | 'national' }) => {
    if (loading) {
      return (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      );
    }

    if (data.length === 0) {
      return (
        <Card data-testid={`card-no-${type}-data`}>
          <CardContent className="p-6 text-center">
            <Trophy className="mx-auto mb-4 text-muted-foreground" size={48} />
            <h4 className="font-medium mb-2">No leaderboard data yet</h4>
            <p className="text-sm text-muted-foreground">
              Be the first to complete tests and climb the rankings!
            </p>
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="space-y-3">
        {data.map((entry: any, index: number) => {
          const isCurrentUser = user?.athleteProfile?.id === entry.athleteId;
          
          return (
            <Card
              key={entry.athleteId}
              data-testid={`card-leaderboard-entry-${index}`}
              className={getRankStyle(entry.rank, isCurrentUser)}
            >
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    {getRankIcon(entry.rank)}
                    <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-sm font-bold text-white">
                      {entry.rank}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium flex items-center space-x-2">
                      <span data-testid={`text-athlete-name-${index}`}>
                        {entry.firstName} {entry.lastName}
                      </span>
                      {isCurrentUser && (
                        <Badge variant="secondary" className="text-xs">You</Badge>
                      )}
                    </h4>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      {entry.sport && (
                        <Badge variant="outline" className="text-xs">
                          {entry.sport}
                        </Badge>
                      )}
                      {type === 'national' && entry.state && (
                        <span className="flex items-center space-x-1">
                          <MapPin size={12} />
                          <span>{entry.state}</span>
                        </span>
                      )}
                      {entry.city && (
                        <span>{entry.city}</span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div data-testid={`text-score-${index}`} className="text-lg font-bold text-accent">
                    {parseFloat(entry.score).toFixed(1)}
                  </div>
                  <div className="text-xs text-muted-foreground">Overall Score</div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-4">
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-[100] bg-card border-b border-border px-4 py-4 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
            <Trophy className="text-white" size={16} />
          </div>
          <div>
            <h1 data-testid="text-page-title" className="text-lg font-bold">Leaderboards</h1>
            <p className="text-sm text-muted-foreground">See how you rank against other athletes</p>
          </div>
        </div>
      </header>

      <main className="p-4">
        <Tabs defaultValue="state" className="space-y-6">
          <TabsList data-testid="tabs-leaderboard" className="grid w-full grid-cols-2">
            <TabsTrigger value="state" className="flex items-center space-x-2">
              <MapPin size={16} />
              <span>State Rankings</span>
            </TabsTrigger>
            <TabsTrigger value="national" className="flex items-center space-x-2">
              <Globe size={16} />
              <span>National Rankings</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="state" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center space-x-2">
                    <MapPin className="text-primary" size={20} />
                    <span>California Rankings</span>
                  </span>
                  <Badge variant="outline">{stateLeaderboard.length} Athletes</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <LeaderboardList data={stateLeaderboard} loading={stateLoading} type="state" />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="national" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center space-x-2">
                    <Globe className="text-accent" size={20} />
                    <span>National Rankings</span>
                  </span>
                  <Badge variant="outline">{nationalLeaderboard.length} Athletes</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <LeaderboardList data={nationalLeaderboard} loading={nationalLoading} type="national" />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Performance Tips */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Star className="text-accent" size={20} />
              <span>Climb the Rankings</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                <div>
                  <h4 className="font-medium">Consistency is Key</h4>
                  <p className="text-sm text-muted-foreground">
                    Regular testing and improvement across all categories boosts your overall score
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-accent rounded-full mt-2"></div>
                <div>
                  <h4 className="font-medium">Focus on Weaknesses</h4>
                  <p className="text-sm text-muted-foreground">
                    Identify your lowest-performing test categories and target improvement
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-secondary rounded-full mt-2"></div>
                <div>
                  <h4 className="font-medium">Track Progress</h4>
                  <p className="text-sm text-muted-foreground">
                    Use the analytics page to monitor your improvement trends over time
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
