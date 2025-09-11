import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import poseRoutes from './routes/pose.js';
import fitnessRoutes from './routes/fitness.js';
import { PoseDetectionService } from './services/PoseDetectionService.js';

// Load environment variables
dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5000",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5000",
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Initialize pose detection service
const poseService = new PoseDetectionService();

// Routes
app.use('/api/pose', poseRoutes);
app.use('/api/fitness', fitnessRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'AthletiQon Backend', timestamp: new Date().toISOString() });
});

// Real-time pose detection via WebSocket
const socketSessionMap = new Map(); // Map socket.id to sessionId

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('video-frame', async (data) => {
    try {
      const sessionId = socketSessionMap.get(socket.id);
      if (!sessionId) {
        socket.emit('pose-error', { error: 'No active session' });
        return;
      }

      const result = await poseService.detectPose(data.frame);
      
      // Update pushup count based on pose analysis
      const updatedSession = poseService.updatePushupCount(sessionId, result);
      
      socket.emit('pose-detected', {
        poses: result.poses,
        pushupCount: updatedSession ? updatedSession.pushupCount : 0,
        validReps: updatedSession ? updatedSession.validReps : 0,
        feedback: result.feedback,
        pushupPhase: result.pushupPhase,
        isValidPose: result.isValidPose,
        timestamp: Date.now()
      });
    } catch (error) {
      console.error('Pose detection error:', error);
      socket.emit('pose-error', { error: error.message });
    }
  });

  socket.on('start-pushup-session', (data) => {
    const sessionId = data.sessionId || `session_${Date.now()}_${socket.id}`;
    socketSessionMap.set(socket.id, sessionId);
    poseService.startPushupSession(sessionId, data);
    socket.emit('session-started', { sessionId });
  });

  socket.on('end-pushup-session', async () => {
    const sessionId = socketSessionMap.get(socket.id);
    if (sessionId) {
      const sessionResults = await poseService.endPushupSession(sessionId);
      socketSessionMap.delete(socket.id);
      socket.emit('session-ended', sessionResults);
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    const sessionId = socketSessionMap.get(socket.id);
    if (sessionId) {
      poseService.cleanupSession(sessionId);
      socketSessionMap.delete(socket.id);
    }
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).json({ 
    error: 'Internal server error',
    message: error.message 
  });
});

// Start server
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 AthletiQon Backend running on port ${PORT}`);
  console.log(`📱 Frontend URL: ${process.env.FRONTEND_URL || "http://localhost:5000"}`);
});

export { io, poseService };