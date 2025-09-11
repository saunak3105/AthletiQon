import express from 'express';
import multer from 'multer';
import { poseService } from '../server.js';

const router = express.Router();

// Configure multer for image uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image and video files are allowed'), false);
    }
  }
});

// Analyze single image for pose
router.post('/analyze', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const result = await poseService.detectPose(req.file.buffer);
    
    res.json({
      success: true,
      data: {
        poses: result.poses,
        analysis: {
          pushupPhase: result.pushupPhase,
          leftElbowAngle: result.leftElbowAngle,
          rightElbowAngle: result.rightElbowAngle,
          avgElbowAngle: result.avgElbowAngle,
          bodyAlignment: result.bodyAlignment,
          isValidPose: result.isValidPose
        },
        feedback: result.feedback,
        timestamp: result.timestamp
      }
    });
  } catch (error) {
    console.error('Pose analysis error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to analyze pose',
      message: error.message 
    });
  }
});

// Start a pushup session
router.post('/session/start', (req, res) => {
  try {
    const sessionId = req.body.sessionId || `session_${Date.now()}`;
    const options = req.body.options || {};
    
    const session = poseService.startPushupSession(sessionId, options);
    
    res.json({
      success: true,
      data: {
        sessionId: session.id,
        startTime: session.startTime,
        options: session.options
      }
    });
  } catch (error) {
    console.error('Session start error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to start session',
      message: error.message 
    });
  }
});

// End a pushup session
router.post('/session/end', async (req, res) => {
  try {
    const { sessionId } = req.body;
    
    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID is required' });
    }
    
    const results = await poseService.endPushupSession(sessionId);
    
    if (!results) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    res.json({
      success: true,
      data: results
    });
  } catch (error) {
    console.error('Session end error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to end session',
      message: error.message 
    });
  }
});

// Get session status
router.get('/session/:sessionId', (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = poseService.sessions.get(sessionId);
    
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    res.json({
      success: true,
      data: {
        sessionId: session.id,
        pushupCount: session.pushupCount,
        validReps: session.validReps,
        startTime: session.startTime,
        currentPhase: session.lastPhase,
        totalFrames: session.totalFrames,
        validFrames: session.validFrames,
        accuracy: session.totalFrames > 0 ? (session.validFrames / session.totalFrames) * 100 : 0
      }
    });
  } catch (error) {
    console.error('Session status error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to get session status',
      message: error.message 
    });
  }
});

export default router;