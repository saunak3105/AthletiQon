import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { Award, Medal, Star, Shield, Zap, Target } from 'lucide-react';

const achievements = [
  { icon: Award, title: 'First Test', description: "Completed your first fitness test.", unlocked: true },
  { icon: Medal, title: 'Push-up Pro', description: "Scored 'Excellent' on a push-up test.", unlocked: true },
  { icon: Star, title: 'Streak Starter', description: "Completed tests on 3 consecutive days.", unlocked: false },
  { icon: Shield, title: 'Perfect Form', description: "Achieved 95%+ form accuracy.", unlocked: true },
  { icon: Zap, title: 'Quick Start', description: "Finished a test in under 60 seconds.", unlocked: false },
  { icon: Target, title: 'Goal Getter', description: "Reached a personal fitness goal.", unlocked: false },
  { icon: Award, title: 'Century Club', description: "Completed 100 tests.", unlocked: false },
  { icon: Medal, title: 'State Champion', description: "Ranked in the top 10% in your state.", unlocked: false },
  { icon: Star, title: 'Consistency King', description: "Completed tests on 7 consecutive days.", unlocked: false },
];

export default function AchievementsPage() {
  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const progress = (unlockedCount / achievements.length) * 100;
  
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Your Progress</CardTitle>
          <CardDescription>
            You've unlocked {unlockedCount} of {achievements.length} achievements. Keep going!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={progress} className="h-4" />
        </CardContent>
      </Card>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {achievements.map((achievement, index) => (
          <Card
            key={index}
            className={cn(
              'flex flex-col items-center justify-center p-6 text-center transition-all duration-300',
              achievement.unlocked ? 'border-primary/50 bg-primary/5 shadow-lg' : 'bg-muted/50'
            )}
          >
            <div className={cn('mb-4 rounded-full bg-background p-4', achievement.unlocked && 'bg-primary/10')}>
              <achievement.icon
                className={cn(
                  'h-12 w-12',
                  achievement.unlocked ? 'text-primary' : 'text-muted-foreground'
                )}
              />
            </div>
            <h3 className="font-semibold">{achievement.title}</h3>
            <p className={cn(
              'mt-1 text-sm',
              achievement.unlocked ? 'text-foreground' : 'text-muted-foreground'
            )}>
              {achievement.description}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}
