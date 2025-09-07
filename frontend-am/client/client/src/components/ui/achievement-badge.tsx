import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Medal, Star, Zap, Target, Crown, Award, Flame } from "lucide-react";

interface AchievementBadgeProps {
  achievement: {
    id: string;
    name: string;
    description: string;
    icon: string;
    category: string;
    points?: number;
    unlockedAt?: string;
  };
  showDate?: boolean;
  testId?: string;
}

export default function AchievementBadge({ achievement, showDate = false, testId }: AchievementBadgeProps) {
  const getIcon = (iconName: string) => {
    const iconMap: Record<string, any> = {
      trophy: Trophy,
      medal: Medal,
      star: Star,
      zap: Zap,
      target: Target,
      crown: Crown,
      award: Award,
      flame: Flame,
    };
    
    return iconMap[iconName.toLowerCase()] || Trophy;
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'speed':
        return 'from-primary to-accent';
      case 'strength':
        return 'from-secondary to-primary';
      case 'consistency':
        return 'from-accent to-secondary';
      case 'milestone':
        return 'from-chart-4 to-primary';
      case 'ranking':
        return 'from-primary to-secondary';
      default:
        return 'from-accent to-primary';
    }
  };

  const IconComponent = getIcon(achievement.icon);
  const gradientColor = getCategoryColor(achievement.category);

  return (
    <Card 
      data-testid={testId || `achievement-badge-${achievement.id}`}
      className="flex-shrink-0 bg-card border border-border rounded-xl overflow-hidden achievement-glow hover:scale-105 transition-transform duration-200"
    >
      <CardContent className="p-4 text-center w-24">
        <div className={`w-12 h-12 bg-gradient-to-br ${gradientColor} rounded-full flex items-center justify-center mx-auto mb-2`}>
          <IconComponent className="text-white" size={20} />
        </div>
        
        <div className="space-y-1">
          <div data-testid={`achievement-name-${achievement.id}`} className="text-xs font-medium leading-tight">
            {achievement.name}
          </div>
          
          {achievement.points && (
            <Badge variant="secondary" className="text-xs px-1 py-0">
              {achievement.points}pts
            </Badge>
          )}
          
          {showDate && achievement.unlockedAt && (
            <div className="text-xs text-muted-foreground mt-1">
              {new Date(achievement.unlockedAt).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric' 
              })}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
