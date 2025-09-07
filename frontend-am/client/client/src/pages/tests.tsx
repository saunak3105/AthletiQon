import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Target, Timer, Dumbbell, Zap, Activity, RotateCcw, Play, Save } from "lucide-react";
import TestCard from "@/components/ui/test-card";

const testIcons = {
  speed: Zap,
  strength: Dumbbell,
  agility: RotateCcw,
  endurance: Activity,
  power: Target,
  default: Timer,
};

export default function Tests() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const queryClient = useQueryClient();
  const [selectedTest, setSelectedTest] = useState<any>(null);
  const [testValue, setTestValue] = useState("");
  const [testNotes, setTestNotes] = useState("");
  const [isTestDialogOpen, setIsTestDialogOpen] = useState(false);

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

  const { data: testTypes = [], isLoading: testTypesLoading } = useQuery({
    queryKey: ["/api/test-types"],
    retry: false,
  });

  const { data: testResults = [], isLoading: resultsLoading } = useQuery({
    queryKey: ["/api/test-results"],
    retry: false,
  });

  const submitTestMutation = useMutation({
    mutationFn: async (data: { testTypeId: string; value: number; notes?: string }) => {
      return await apiRequest("POST", "/api/test-results", data);
    },
    onSuccess: () => {
      toast({
        title: "Test Submitted",
        description: "Your test result has been recorded successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/test-results"] });
      queryClient.invalidateQueries({ queryKey: ["/api/test-results/recent"] });
      queryClient.invalidateQueries({ queryKey: ["/api/analytics"] });
      setIsTestDialogOpen(false);
      setTestValue("");
      setTestNotes("");
      setSelectedTest(null);
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
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
      toast({
        title: "Error",
        description: "Failed to submit test result. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleTestSubmit = () => {
    if (!selectedTest || !testValue) {
      toast({
        title: "Invalid Input",
        description: "Please enter a valid test result.",
        variant: "destructive",
      });
      return;
    }

    const numericValue = parseFloat(testValue);
    if (isNaN(numericValue)) {
      toast({
        title: "Invalid Value",
        description: "Please enter a numeric value.",
        variant: "destructive",
      });
      return;
    }

    submitTestMutation.mutate({
      testTypeId: selectedTest.id,
      value: numericValue,
      notes: testNotes.trim() || undefined,
    });
  };

  const groupedTests = testTypes.reduce((acc: any, test: any) => {
    if (!acc[test.category]) {
      acc[test.category] = [];
    }
    acc[test.category].push(test);
    return acc;
  }, {});

  const getLastResult = (testTypeId: string) => {
    return testResults
      .filter((result: any) => result.testTypeId === testTypeId)
      .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
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
            <Target className="text-white" size={16} />
          </div>
          <div>
            <h1 data-testid="text-page-title" className="text-lg font-bold">Fitness Tests</h1>
            <p className="text-sm text-muted-foreground">Track your athletic performance</p>
          </div>
        </div>
      </header>

      <main className="p-4">
        {testTypesLoading ? (
          <div className="space-y-6">
            {["Speed", "Strength", "Agility"].map((category) => (
              <div key={category}>
                <Skeleton className="h-6 w-32 mb-4" />
                <div className="grid gap-4">
                  {[1, 2].map((i) => (
                    <Skeleton key={i} className="h-24 w-full" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedTests).map(([category, tests]: [string, any[]]) => {
              const IconComponent = testIcons[category as keyof typeof testIcons] || testIcons.default;
              
              return (
                <section key={category}>
                  <div className="flex items-center space-x-2 mb-4">
                    <IconComponent className="text-primary" size={20} />
                    <h2 data-testid={`text-category-${category}`} className="text-xl font-semibold capitalize">{category}</h2>
                  </div>
                  
                  <div className="grid gap-4">
                    {tests.map((test) => {
                      const lastResult = getLastResult(test.id);
                      return (
                        <TestCard
                          key={test.id}
                          test={test}
                          lastResult={lastResult}
                          onStartTest={() => {
                            setSelectedTest(test);
                            setIsTestDialogOpen(true);
                          }}
                          testId={`test-${test.id}`}
                        />
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>
        )}

        {/* Test Entry Dialog */}
        <Dialog open={isTestDialogOpen} onOpenChange={setIsTestDialogOpen}>
          <DialogContent data-testid="dialog-test-entry" className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <Play className="text-primary" size={20} />
                <span>Record Test Result</span>
              </DialogTitle>
            </DialogHeader>
            
            {selectedTest && (
              <div className="space-y-4">
                <div>
                  <h3 data-testid="text-selected-test" className="font-semibold text-lg">{selectedTest.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedTest.description}</p>
                  {selectedTest.instructions && (
                    <div className="mt-2 p-3 bg-muted/50 rounded-lg">
                      <p className="text-sm">{selectedTest.instructions}</p>
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="test-value">
                    Result ({selectedTest.unit})
                  </Label>
                  <Input
                    id="test-value"
                    data-testid="input-test-value"
                    type="number"
                    step="0.01"
                    placeholder={`Enter result in ${selectedTest.unit}`}
                    value={testValue}
                    onChange={(e) => setTestValue(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="test-notes">Notes (optional)</Label>
                  <Textarea
                    id="test-notes"
                    data-testid="textarea-test-notes"
                    placeholder="Add any notes about this test..."
                    value={testNotes}
                    onChange={(e) => setTestNotes(e.target.value)}
                    rows={3}
                  />
                </div>
                
                <div className="flex space-x-2">
                  <Button
                    data-testid="button-cancel-test"
                    variant="outline"
                    onClick={() => setIsTestDialogOpen(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    data-testid="button-submit-test"
                    onClick={handleTestSubmit}
                    disabled={submitTestMutation.isPending || !testValue}
                    className="flex-1"
                  >
                    {submitTestMutation.isPending ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        <span>Saving...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Save size={16} />
                        <span>Save Result</span>
                      </div>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
