'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CameraCapture } from '@/components/camera/CameraCapture';
import { apiClient } from '@/lib/api';
import { Bot, Trophy, Timer, Target } from 'lucide-react';
import { io, Socket } from 'socket.io-client';

interface PushupSession {
  sessionId: string;
  startTime: number;
  isActive: boolean;
  pushupCount: number;
  validReps: number;
  feedback: string[];
  accuracy: number;
}

interface PoseAnalysis {
  pushupPhase: string;
  leftElbowAngle: number;
  rightElbowAngle: number;
  avgElbowAngle: number;
  bodyAlignment: any;
  feedback: string[];
  isValidPose: boolean;
  confidence: number;
}

export function PushupDetector() {
  const [session, setSession] = useState<PushupSession | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<PoseAnalysis | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [sessionResults, setSessionResults] = useState<any>(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  // Initialize WebSocket connection
  useEffect(() => {
    const socketConnection = io('http://localhost:3001');
    
    socketConnection.on('connect', () => {
      console.log('Connected to pose detection service');
      setSocket(socketConnection);
    });

    socketConnection.on('pose-detected', (data: any) => {
      setCurrentAnalysis(data);
      
      // Update session with latest data from backend
      if (session) {
        setSession(prev => prev ? {
          ...prev,
          pushupCount: data.pushupCount || 0,
          validReps: data.validReps || 0,
          feedback: data.feedback || prev.feedback
        } : null);
      }
    });

    socketConnection.on('session-ended', (results: any) => {
      setSessionResults(results);
      setIsRecording(false);
      setSession(null);
    });

    socketConnection.on('pose-error', (error: any) => {
      console.error('Pose detection error:', error);
    });

    return () => {
      socketConnection.disconnect();
    };
  }, [session]);

  // Timer for elapsed time
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (session && session.isActive) {
      interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - session.startTime) / 1000));
      }, 1000);
    }
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [session]);

  const startSession = useCallback(async () => {
    try {
      // First ensure we have a socket connection
      if (!socket) {
        console.error('No socket connection');
        return;
      }

      const sessionId = `session_${Date.now()}`;
      
      const newSession: PushupSession = {
        sessionId,
        startTime: Date.now(),
        isActive: true,
        pushupCount: 0,
        validReps: 0,
        feedback: [],
        accuracy: 0
      };

      setSession(newSession);
      setElapsedTime(0);
      setSessionResults(null);

      // Start pushup session via WebSocket (primary method)
      socket.emit('start-pushup-session', {
        sessionId,
        options: {
          minDepthAngle: 80,
          minExtensionAngle: 140
        }
      });

      // Also call REST API as backup for session tracking
      try {
        await apiClient.startPushupSession({
          sessionId,
          minDepthAngle: 80,
          minExtensionAngle: 140
        });
      } catch (apiError) {
        console.warn('REST API session start failed, but WebSocket is active:', apiError);
      }

      // Start recording after session is established
      setIsRecording(true);
    } catch (error) {
      console.error('Failed to start session:', error);
    }
  }, [socket]);

  const endSession = useCallback(async () => {
    if (!session || !socket) return;

    try {
      setIsRecording(false);
      
      // End session via WebSocket
      socket.emit('end-pushup-session');
      
      // Also call REST API as backup
      const response = await apiClient.endPushupSession(session.sessionId);
      
      if (response.success) {
        setSessionResults(response.data);
      }
      
      setSession(null);
    } catch (error) {
      console.error('Failed to end session:', error);
    }
  }, [session, socket]);

  const handleFrameCapture = useCallback((imageData: string) => {
    if (socket && session && session.isActive) {
      // Send frame to backend for pose analysis
      socket.emit('video-frame', {
        frame: imageData,
        sessionId: session.sessionId
      });
    }
  }, [socket, session]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Camera Section */}
      <CameraCapture
        onFrameCapture={handleFrameCapture}
        isRecording={isRecording}
        className="w-full"
      />

      {/* Session Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-6 w-6 text-primary" />
            Pushup Session
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!session ? (
            <Button onClick={startSession} size="lg" className="w-full">
              Start Pushup Test
            </Button>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Timer className="h-4 w-4" />
                  <span className="font-mono text-lg">{formatTime(elapsedTime)}</span>
                </div>
                <Button onClick={endSession} variant="destructive">
                  End Session
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{session.pushupCount}</div>
                  <div className="text-sm text-muted-foreground">Total Reps</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{session.validReps}</div>
                  <div className="text-sm text-muted-foreground">Valid Reps</div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Real-time Analysis */}
      {currentAnalysis && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-6 w-6 text-primary" />
              AI Pose Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant={currentAnalysis.isValidPose ? "default" : "secondary"}>
                {currentAnalysis.pushupPhase.toUpperCase()}
              </Badge>
              <span className="text-sm text-muted-foreground">
                Confidence: {Math.round(currentAnalysis.confidence * 100)}%
              </span>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Arm Angle:</span>
                <span className="font-mono">{currentAnalysis.avgElbowAngle}°</span>
              </div>
              <Progress value={currentAnalysis.avgElbowAngle} max={180} className="h-2" />
            </div>

            <div className="space-y-1">
              {currentAnalysis.feedback.map((feedback, index) => (
                <div key={index} className={`text-sm p-2 rounded ${
                  feedback.startsWith('✓') 
                    ? 'bg-green-100 text-green-700' 
                    : feedback.startsWith('!')
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-blue-100 text-blue-700'
                }`}>
                  {feedback}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Session Results */}
      {sessionResults && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-6 w-6 text-yellow-500" />
              Session Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">{sessionResults.totalReps}</div>
                <div className="text-sm text-muted-foreground">Total Reps</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{sessionResults.validReps}</div>
                <div className="text-sm text-muted-foreground">Valid Reps</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">{sessionResults.accuracy}%</div>
                <div className="text-sm text-muted-foreground">Accuracy</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {formatTime(Math.floor(sessionResults.duration / 1000))}
                </div>
                <div className="text-sm text-muted-foreground">Duration</div>
              </div>
            </div>
            
            <Button onClick={() => setSessionResults(null)} variant="outline" className="w-full">
              Start New Session
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}