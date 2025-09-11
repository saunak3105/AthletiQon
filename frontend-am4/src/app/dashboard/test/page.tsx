import { PushupDetector } from "@/components/pushup/PushupDetector";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function FitnessTestPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">AI-Powered Push-up Test</h1>
        <p className="text-muted-foreground">
          Use your camera to perform push-ups with real-time AI form analysis and rep counting
        </p>
      </div>
      
      <PushupDetector />
    </div>
  );
}
