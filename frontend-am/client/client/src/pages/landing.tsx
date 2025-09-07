import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Zap, Trophy, BarChart3, Target, Users, Smartphone } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <Zap className="text-white" size={20} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">AthletiQon</h1>
                <p className="text-sm text-muted-foreground">Elite Performance Tracking</p>
              </div>
            </div>
            <Button 
              data-testid="button-login"
              onClick={() => window.location.href = "/api/login"}
              className="bg-primary hover:bg-primary/90"
            >
              Sign In
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 chart-container">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Elevate Your Athletic Performance
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Track, analyze, and compete with comprehensive fitness testing and performance analytics. 
              Join thousands of athletes pushing their limits with AthletiQon.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                data-testid="button-get-started"
                size="lg" 
                className="bg-primary hover:bg-primary/90"
                onClick={() => window.location.href = "/api/login"}
              >
                Get Started Free
              </Button>
              <Button 
                data-testid="button-learn-more"
                size="lg" 
                variant="outline" 
                className="border-accent text-accent hover:bg-accent/10"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold mb-4">Comprehensive Fitness Tracking</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything you need to track, analyze, and improve your athletic performance
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card data-testid="card-feature-tests" className="bg-card border-border hover:border-primary/50 transition-colors">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                  <Target className="text-primary" size={24} />
                </div>
                <h4 className="text-xl font-semibold mb-2">Fitness Test Suite</h4>
                <p className="text-muted-foreground">
                  Comprehensive testing including vertical jump, 40-yard dash, push-ups, sit-ups, and more
                </p>
              </CardContent>
            </Card>

            <Card data-testid="card-feature-leaderboards" className="bg-card border-border hover:border-accent/50 transition-colors">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mb-4">
                  <Trophy className="text-accent" size={24} />
                </div>
                <h4 className="text-xl font-semibold mb-2">Smart Leaderboards</h4>
                <p className="text-muted-foreground">
                  State and national rankings with age group and sport filtering
                </p>
              </CardContent>
            </Card>

            <Card data-testid="card-feature-analytics" className="bg-card border-border hover:border-secondary/50 transition-colors">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-secondary/20 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="text-secondary" size={24} />
                </div>
                <h4 className="text-xl font-semibold mb-2">Performance Analytics</h4>
                <p className="text-muted-foreground">
                  Detailed progress tracking with visual charts and performance insights
                </p>
              </CardContent>
            </Card>

            <Card data-testid="card-feature-achievements" className="bg-card border-border hover:border-primary/50 transition-colors">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="text-primary" size={24} />
                </div>
                <h4 className="text-xl font-semibold mb-2">Achievement System</h4>
                <p className="text-muted-foreground">
                  Badges and milestones to motivate and track your athletic journey
                </p>
              </CardContent>
            </Card>

            <Card data-testid="card-feature-community" className="bg-card border-border hover:border-accent/50 transition-colors">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mb-4">
                  <Users className="text-accent" size={24} />
                </div>
                <h4 className="text-xl font-semibold mb-2">Athlete Community</h4>
                <p className="text-muted-foreground">
                  Connect with athletes nationwide and compete on global leaderboards
                </p>
              </CardContent>
            </Card>

            <Card data-testid="card-feature-mobile" className="bg-card border-border hover:border-secondary/50 transition-colors">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-secondary/20 rounded-lg flex items-center justify-center mb-4">
                  <Smartphone className="text-secondary" size={24} />
                </div>
                <h4 className="text-xl font-semibold mb-2">Mobile-First PWA</h4>
                <p className="text-muted-foreground">
                  Works like a native app with offline capabilities and instant loading
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 chart-container">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-3xl font-bold mb-4">Ready to Track Your Performance?</h3>
            <p className="text-muted-foreground mb-8">
              Join elite athletes using AthletiQon to reach their peak performance
            </p>
            <Button 
              data-testid="button-join-now"
              size="lg" 
              className="bg-accent hover:bg-accent/90"
              onClick={() => window.location.href = "/api/login"}
            >
              Join AthletiQon Today
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">
            © 2024 AthletiQon. Elite Performance Tracking Platform.
          </p>
        </div>
      </footer>
    </div>
  );
}
