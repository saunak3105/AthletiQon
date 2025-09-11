'use client';

import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Dynamic import to prevent SSR issues with camera/socket components
const PushupDetector = dynamic(
  () => import("@/components/pushup/PushupDetector"),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading camera interface...</p>
        </div>
      </div>
    )
  }
);

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
