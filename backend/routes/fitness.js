import express from 'express';

const router = express.Router();

// Get fitness test types
router.get('/test-types', (req, res) => {
  res.json({
    success: true,
    data: [
      {
        id: 'pushup',
        name: 'Push-up Test',
        description: 'Test your upper body strength with AI-guided push-ups',
        duration: 60, // seconds
        equipment: 'None',
        difficulty: 'Beginner to Advanced'
      },
      {
        id: 'squat',
        name: 'Squat Test',
        description: 'Test your lower body strength and form',
        duration: 60,
        equipment: 'None',
        difficulty: 'Beginner to Advanced'
      },
      {
        id: 'plank',
        name: 'Plank Test',
        description: 'Test your core strength and stability',
        duration: 120,
        equipment: 'None',
        difficulty: 'Intermediate'
      }
    ]
  });
});

// Save test results
router.post('/results', (req, res) => {
  try {
    const {
      testType,
      sessionId,
      results,
      userProfile
    } = req.body;

    // In a real app, you'd save this to a database
    const testResult = {
      id: `result_${Date.now()}`,
      testType,
      sessionId,
      results,
      userProfile,
      timestamp: new Date().toISOString(),
      score: calculateScore(testType, results)
    };

    res.json({
      success: true,
      data: testResult
    });
  } catch (error) {
    console.error('Save results error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to save results',
      message: error.message 
    });
  }
});

// Get user's test history
router.get('/history/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    
    // Mock data - in a real app, fetch from database
    const history = [
      {
        id: 'result_1',
        testType: 'pushup',
        date: '2025-09-10T10:00:00Z',
        score: 85,
        reps: 25,
        accuracy: 92
      },
      {
        id: 'result_2',
        testType: 'pushup',
        date: '2025-09-08T09:30:00Z',
        score: 78,
        reps: 22,
        accuracy: 88
      }
    ];

    res.json({
      success: true,
      data: history
    });
  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to get history',
      message: error.message 
    });
  }
});

// Get leaderboard
router.get('/leaderboard/:testType', (req, res) => {
  try {
    const { testType } = req.params;
    
    // Mock leaderboard data
    const leaderboard = [
      { rank: 1, username: 'FitnessKing', score: 95, reps: 45 },
      { rank: 2, username: 'PushupPro', score: 92, reps: 42 },
      { rank: 3, username: 'StrengthMaster', score: 89, reps: 38 },
      { rank: 4, username: 'FitWarrior', score: 86, reps: 35 },
      { rank: 5, username: 'ActiveAthlete', score: 83, reps: 32 }
    ];

    res.json({
      success: true,
      data: leaderboard
    });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to get leaderboard',
      message: error.message 
    });
  }
});

// Calculate fitness score based on test type and results
function calculateScore(testType, results) {
  switch (testType) {
    case 'pushup':
      const { totalReps, validReps, accuracy, duration } = results;
      const repScore = Math.min(validReps * 2, 60); // Max 30 reps = 60 points
      const accuracyScore = accuracy * 0.3; // Max 30 points
      const timeBonus = duration < 60000 ? 10 : 0; // Bonus for completing under 1 min
      return Math.round(repScore + accuracyScore + timeBonus);
    
    case 'squat':
      // Similar scoring logic for squats
      return Math.round(results.validReps * 1.5 + results.accuracy * 0.4);
    
    case 'plank':
      // Time-based scoring for plank
      return Math.round((results.duration / 1000) * 0.8 + results.accuracy * 0.2);
    
    default:
      return 0;
  }
}

export default router;