import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { 
  insertAthleteProfileSchema, 
  insertTestResultSchema, 
  insertTestTypeSchema 
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get("/api/auth/user", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      const athleteProfile = await storage.getAthleteProfile(userId);
      
      res.json({
        ...user,
        athleteProfile,
      });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Athlete profile routes
  app.post("/api/athlete-profile", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const profileData = insertAthleteProfileSchema.parse({
        ...req.body,
        userId,
      });
      
      const profile = await storage.createOrUpdateAthleteProfile(profileData);
      res.json(profile);
    } catch (error) {
      console.error("Error creating/updating athlete profile:", error);
      res.status(400).json({ message: "Invalid profile data" });
    }
  });

  app.get("/api/athlete-profile", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const profile = await storage.getAthleteProfile(userId);
      res.json(profile);
    } catch (error) {
      console.error("Error fetching athlete profile:", error);
      res.status(500).json({ message: "Failed to fetch profile" });
    }
  });

  // Test type routes
  app.get("/api/test-types", async (req, res) => {
    try {
      const testTypes = await storage.getAllTestTypes();
      res.json(testTypes);
    } catch (error) {
      console.error("Error fetching test types:", error);
      res.status(500).json({ message: "Failed to fetch test types" });
    }
  });

  app.post("/api/test-types", isAuthenticated, async (req, res) => {
    try {
      const testTypeData = insertTestTypeSchema.parse(req.body);
      const testType = await storage.createTestType(testTypeData);
      res.json(testType);
    } catch (error) {
      console.error("Error creating test type:", error);
      res.status(400).json({ message: "Invalid test type data" });
    }
  });

  // Test result routes
  app.post("/api/test-results", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const athleteProfile = await storage.getAthleteProfile(userId);
      
      if (!athleteProfile) {
        return res.status(400).json({ message: "Athlete profile required" });
      }

      const resultData = insertTestResultSchema.parse({
        ...req.body,
        athleteId: athleteProfile.id,
      });
      
      const result = await storage.createTestResult(resultData);
      res.json(result);
    } catch (error) {
      console.error("Error creating test result:", error);
      res.status(400).json({ message: "Invalid test result data" });
    }
  });

  app.get("/api/test-results", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const athleteProfile = await storage.getAthleteProfile(userId);
      
      if (!athleteProfile) {
        return res.json([]);
      }

      const results = await storage.getTestResultsByAthlete(athleteProfile.id);
      res.json(results);
    } catch (error) {
      console.error("Error fetching test results:", error);
      res.status(500).json({ message: "Failed to fetch test results" });
    }
  });

  app.get("/api/test-results/recent", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const athleteProfile = await storage.getAthleteProfile(userId);
      
      if (!athleteProfile) {
        return res.json([]);
      }

      const limit = parseInt(req.query.limit as string) || 5;
      const results = await storage.getRecentTestResults(athleteProfile.id, limit);
      res.json(results);
    } catch (error) {
      console.error("Error fetching recent test results:", error);
      res.status(500).json({ message: "Failed to fetch recent test results" });
    }
  });

  // Leaderboard routes
  app.get("/api/leaderboards/state/:state", async (req, res) => {
    try {
      const { state } = req.params;
      const limit = parseInt(req.query.limit as string) || 50;
      const leaderboard = await storage.getStateLeaderboard(state, limit);
      res.json(leaderboard);
    } catch (error) {
      console.error("Error fetching state leaderboard:", error);
      res.status(500).json({ message: "Failed to fetch state leaderboard" });
    }
  });

  app.get("/api/leaderboards/national", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 100;
      const leaderboard = await storage.getNationalLeaderboard(limit);
      res.json(leaderboard);
    } catch (error) {
      console.error("Error fetching national leaderboard:", error);
      res.status(500).json({ message: "Failed to fetch national leaderboard" });
    }
  });

  // Achievement routes
  app.get("/api/achievements", async (req, res) => {
    try {
      const achievements = await storage.getAllAchievements();
      res.json(achievements);
    } catch (error) {
      console.error("Error fetching achievements:", error);
      res.status(500).json({ message: "Failed to fetch achievements" });
    }
  });

  app.get("/api/achievements/user", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const athleteProfile = await storage.getAthleteProfile(userId);
      
      if (!athleteProfile) {
        return res.json([]);
      }

      const userAchievements = await storage.getUserAchievements(athleteProfile.id);
      res.json(userAchievements);
    } catch (error) {
      console.error("Error fetching user achievements:", error);
      res.status(500).json({ message: "Failed to fetch user achievements" });
    }
  });

  // Analytics routes
  app.get("/api/analytics", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const athleteProfile = await storage.getAthleteProfile(userId);
      
      if (!athleteProfile) {
        return res.json({ totalTests: 0, performanceByCategory: {}, recentActivity: [] });
      }

      const analytics = await storage.getPerformanceAnalytics(athleteProfile.id);
      res.json(analytics);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      res.status(500).json({ message: "Failed to fetch analytics" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
