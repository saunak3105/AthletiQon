import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Camera, Trophy, Award } from 'lucide-react';

const dashboardCards = [
  {
    title: 'Start a New Test',
    description: "Ready to challenge yourself? Begin a new fitness test to track your performance.",
    link: '/dashboard/test',
    icon: Camera,
    cta: 'Start Test',
  },
  {
    title: 'View Leaderboard',
    description: "See where you stand among your peers. Check out the local, state, and national rankings.",
    link: '/dashboard/leaderboard',
    icon: Trophy,
    cta: 'View Rankings',
  },
  {
    title: 'My Achievements',
    description: "Explore the badges you've earned and see what challenges await you next.",
    link: '/dashboard/achievements',
    icon: Award,
    cta: 'See Badges',
  },
];

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome back, User!</h1>
        <p className="text-muted-foreground">Here's a snapshot of your fitness journey.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {dashboardCards.map((item) => (
          <Card key={item.title} className="flex flex-col">
            <CardHeader className="flex flex-row items-center gap-4">
              <item.icon className="h-10 w-10 text-primary" />
              <div>
                <CardTitle>{item.title}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="mt-auto">
              <Button asChild className="w-full">
                <Link href={item.link}>
                  {item.cta}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
