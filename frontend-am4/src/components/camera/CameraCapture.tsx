'use client';

import React, { useRef, useCallback, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Camera, Square, Play, Pause } from 'lucide-react';

interface CameraCaptureProps {
  onFrameCapture?: (imageData: string) => void;
  onVideoStart?: () => void;
  onVideoStop?: () => void;
  isRecording?: boolean;
  className?: string;
}

export function CameraCapture({
  onFrameCapture,
  onVideoStart,
  onVideoStop,
  isRecording = false,
  className = ''
}: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [error, setError] = useState<string>('');
  const [frameInterval, setFrameInterval] = useState<NodeJS.Timeout | null>(null);

  const startCamera = useCallback(async () => {
    try {
      setError('');
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        },
        audio: false
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        streamRef.current = stream;
        setIsCameraActive(true);
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Failed to access camera. Please ensure camera permissions are granted.');
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    if (frameInterval) {
      clearInterval(frameInterval);
      setFrameInterval(null);
    }
    
    setIsCameraActive(false);
  }, [frameInterval]);

  const captureFrame = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx || video.videoWidth === 0) return;

    // Set canvas size to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw current video frame to canvas
    ctx.drawImage(video, 0, 0);

    // Convert to base64 image data
    const imageData = canvas.toDataURL('image/jpeg', 0.8);
    
    if (onFrameCapture) {
      onFrameCapture(imageData);
    }
  }, [onFrameCapture]);

  const startRecording = useCallback(() => {
    if (!isCameraActive) return;

    // Capture frames every 100ms (10 FPS)
    const interval = setInterval(captureFrame, 100);
    setFrameInterval(interval);
    
    if (onVideoStart) {
      onVideoStart();
    }
  }, [isCameraActive, captureFrame, onVideoStart]);

  const stopRecording = useCallback(() => {
    if (frameInterval) {
      clearInterval(frameInterval);
      setFrameInterval(null);
    }
    
    if (onVideoStop) {
      onVideoStop();
    }
  }, [frameInterval, onVideoStop]);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  useEffect(() => {
    if (isRecording && !frameInterval) {
      startRecording();
    } else if (!isRecording && frameInterval) {
      stopRecording();
    }
  }, [isRecording, frameInterval, startRecording, stopRecording]);

  return (
    <Card className={className}>
      <CardContent className="p-4">
        <div className="relative">
          {/* Video element */}
          <video
            ref={videoRef}
            className="w-full h-auto rounded-lg bg-black"
            style={{ maxHeight: '400px' }}
            muted
            playsInline
          />
          
          {/* Hidden canvas for frame capture */}
          <canvas
            ref={canvasRef}
            className="hidden"
          />
          
          {/* Recording indicator */}
          {isRecording && (
            <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              REC
            </div>
          )}
          
          {/* Camera not active overlay */}
          {!isCameraActive && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900 rounded-lg">
              <div className="text-center text-white">
                <Camera className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm opacity-75">Camera not active</p>
              </div>
            </div>
          )}
        </div>

        {/* Error message */}
        {error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Controls */}
        <div className="flex gap-2 mt-4">
          {!isCameraActive ? (
            <Button onClick={startCamera} className="flex items-center gap-2">
              <Camera className="w-4 h-4" />
              Start Camera
            </Button>
          ) : (
            <>
              <Button onClick={stopCamera} variant="outline" className="flex items-center gap-2">
                <Square className="w-4 h-4" />
                Stop Camera
              </Button>
              
              {!isRecording ? (
                <Button onClick={startRecording} className="flex items-center gap-2">
                  <Play className="w-4 h-4" />
                  Start Recording
                </Button>
              ) : (
                <Button onClick={stopRecording} variant="destructive" className="flex items-center gap-2">
                  <Pause className="w-4 h-4" />
                  Stop Recording
                </Button>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}