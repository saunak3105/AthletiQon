import { Link, useLocation } from "wouter";
import { Home, Target, Trophy, BarChart3, User } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  {
    path: "/",
    icon: Home,
    label: "Home",
    testId: "nav-home",
  },
  {
    path: "/tests",
    icon: Target,
    label: "Tests",
    testId: "nav-tests",
  },
  {
    path: "/leaderboards",
    icon: Trophy,
    label: "Rankings",
    testId: "nav-rankings",
  },
  {
    path: "/analytics",
    icon: BarChart3,
    label: "Analytics",
    testId: "nav-analytics",
  },
  {
    path: "/profile",
    icon: User,
    label: "Profile",
    testId: "nav-profile",
  },
];

export default function MobileNav() {
  const [location] = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border px-4 py-2 z-50">
      <div className="flex justify-around">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = location === item.path;
          
          return (
            <Link key={item.path} href={item.path}>
              <button
                data-testid={item.testId}
                className={cn(
                  "mobile-nav-item flex flex-col items-center py-2 px-3 transition-colors",
                  isActive 
                    ? "text-primary" 
                    : "text-muted-foreground hover:text-accent"
                )}
              >
                <IconComponent size={18} className="mb-1" />
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
