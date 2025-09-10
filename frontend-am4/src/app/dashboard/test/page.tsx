import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PoseSilhouette } from "@/components/icons/pose-silhouette";
import { PlayCircle, StopCircle, Bot, BarChart, Clock } from "lucide-react";

export default function FitnessTestPage() {
  return (
    <div className="grid h-full grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="flex flex-col gap-6 lg:col-span-2">
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>Push-up Test</CardTitle>
          </CardHeader>
          <CardContent className="h-full">
            <div className="relative flex h-[300px] items-center justify-center rounded-lg bg-slate-900/80 md:h-[500px]">
              <div className="absolute top-4 left-4 rounded-full bg-red-500 px-3 py-1 text-sm font-medium text-white">
                ● REC
              </div>
              <PoseSilhouette className="h-4/5 w-4/5 text-primary/30" />
              <p className="absolute bottom-4 text-sm text-white/50">
                Align your body with the silhouette
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Controls</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <Button size="lg" className="bg-green-600 hover:bg-green-700">
              <PlayCircle className="mr-2 h-5 w-5" /> Start Test
            </Button>
            <Button size="lg" variant="destructive">
              <StopCircle className="mr-2 h-5 w-5" /> End Test
            </Button>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-4">
            <Card className="text-center">
                <CardHeader>
                    <CardTitle className="flex items-center justify-center gap-2 text-base font-medium text-muted-foreground">
                        <BarChart className="h-5 w-5" /> Reps
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-5xl font-bold">12</p>
                </CardContent>
            </Card>
            <Card className="text-center">
                <CardHeader>
                    <CardTitle className="flex items-center justify-center gap-2 text-base font-medium text-muted-foreground">
                       <Clock className="h-5 w-5" /> Time
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-5xl font-bold">48s</p>
                </CardContent>
            </Card>
        </div>
        
        <Card className="bg-secondary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <Bot className="h-6 w-6 text-primary" />
                AI Pose Feedback
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm font-medium text-green-600">✓ Hips aligned</p>
            <p className="text-sm font-medium text-yellow-600">! Lower your chest further</p>
            <p className="text-sm font-medium text-green-600">✓ Full arm extension</p>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
