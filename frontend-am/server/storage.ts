import {
  users,
  athleteProfiles,
  testTypes,
  testResults,
  achievements,
  userAchievements,
  type User,
  type UpsertUser,
  type AthleteProfile,
  type InsertAthleteProfile,
  type TestType,
  type InsertTestType,
  type TestResult,
  type InsertTestResult,
  type Achievement,
  type UserAchievement,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, sql, and, avg } from "drizzle-orm";

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Athlete profile operations
  getAthleteProfile(userId: string): Promise<AthleteProfile | undefined>;
  createOrUpdateAthleteProfile(profile: InsertAthleteProfile): Promise<AthleteProfile>;
  
  // Test type operations
  getAllTestTypes(): Promise<TestType[]>;
  getTestType(id: string): Promise<TestType | undefined>;
  createTestType(testType: InsertTestType): Promise<TestType>;
  
  // Test result operations
  createTestResult(result: InsertTestResult): Promise<TestResult>;
  getTestResultsByAthlete(athleteId: string): Promise<TestResult[]>;
  getRecentTestResults(athleteId: string, limit?: number): Promise<any[]>;
  
  // Leaderboard operations
  getStateLeaderboard(state: string, limit?: number): Promise<any[]>;
  getNationalLeaderboard(limit?: number): Promise<any[]>;
  
  // Achievement operations
  getAllAchievements(): Promise<Achievement[]>;
  getUserAchievements(athleteId: string): Promise<any[]>;
  unlockAchievement(athleteId: string, achievementId: string): Promise<UserAchievement>;
  
  // Analytics operations
  getPerformanceAnalytics(athleteId: string): Promise<any>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Athlete profile operations
  async getAthleteProfile(userId: string): Promise<AthleteProfile | undefined> {
    const [profile] = await db
      .select()
      .from(athleteProfiles)
      .where(eq(athleteProfiles.userId, userId));
    return profile;
  }

  async createOrUpdateAthleteProfile(profile: InsertAthleteProfile): Promise<AthleteProfile> {
    const [existingProfile] = await db
      .select()
      .from(athleteProfiles)
      .where(eq(athleteProfiles.userId, profile.userId));

    if (existingProfile) {
      const [updatedProfile] = await db
        .update(athleteProfiles)
        .set({ ...profile, updatedAt: new Date() })
        .where(eq(athleteProfiles.id, existingProfile.id))
        .returning();
      return updatedProfile;
    } else {
      const [newProfile] = await db
        .insert(athleteProfiles)
        .values(profile)
        .returning();
      return newProfile;
    }
  }

  // Test type operations
  async getAllTestTypes(): Promise<TestType[]> {
    return await db
      .select()
      .from(testTypes)
      .where(eq(testTypes.isActive, true))
      .orderBy(testTypes.category, testTypes.name);
  }

  async getTestType(id: string): Promise<TestType | undefined> {
    const [testType] = await db
      .select()
      .from(testTypes)
      .where(eq(testTypes.id, id));
    return testType;
  }

  async createTestType(testType: InsertTestType): Promise<TestType> {
    const [newTestType] = await db
      .insert(testTypes)
      .values(testType)
      .returning();
    return newTestType;
  }

  // Test result operations
  async createTestResult(result: InsertTestResult): Promise<TestResult> {
    const [newResult] = await db
      .insert(testResults)
      .values(result)
      .returning();
    
    // Update athlete's overall score
    await this.updateAthleteOverallScore(result.athleteId);
    
    return newResult;
  }

  async getTestResultsByAthlete(athleteId: string): Promise<TestResult[]> {
    return await db
      .select()
      .from(testResults)
      .where(eq(testResults.athleteId, athleteId))
      .orderBy(desc(testResults.createdAt));
  }

  async getRecentTestResults(athleteId: string, limit: number = 5): Promise<any[]> {
    return await db
      .select({
        id: testResults.id,
        value: testResults.value,
        createdAt: testResults.createdAt,
        testName: testTypes.name,
        testUnit: testTypes.unit,
        testCategory: testTypes.category,
      })
      .from(testResults)
      .innerJoin(testTypes, eq(testResults.testTypeId, testTypes.id))
      .where(eq(testResults.athleteId, athleteId))
      .orderBy(desc(testResults.createdAt))
      .limit(limit);
  }

  // Leaderboard operations
  async getStateLeaderboard(state: string, limit: number = 50): Promise<any[]> {
    return await db
      .select({
        rank: sql<number>`ROW_NUMBER() OVER (ORDER BY ${athleteProfiles.overallScore} DESC)`,
        athleteId: athleteProfiles.id,
        firstName: users.firstName,
        lastName: users.lastName,
        score: athleteProfiles.overallScore,
        sport: athleteProfiles.sport,
        city: athleteProfiles.city,
      })
      .from(athleteProfiles)
      .innerJoin(users, eq(athleteProfiles.userId, users.id))
      .where(eq(athleteProfiles.state, state))
      .orderBy(desc(athleteProfiles.overallScore))
      .limit(limit);
  }

  async getNationalLeaderboard(limit: number = 100): Promise<any[]> {
    return await db
      .select({
        rank: sql<number>`ROW_NUMBER() OVER (ORDER BY ${athleteProfiles.overallScore} DESC)`,
        athleteId: athleteProfiles.id,
        firstName: users.firstName,
        lastName: users.lastName,
        score: athleteProfiles.overallScore,
        sport: athleteProfiles.sport,
        state: athleteProfiles.state,
        city: athleteProfiles.city,
      })
      .from(athleteProfiles)
      .innerJoin(users, eq(athleteProfiles.userId, users.id))
      .orderBy(desc(athleteProfiles.overallScore))
      .limit(limit);
  }

  // Achievement operations
  async getAllAchievements(): Promise<Achievement[]> {
    return await db
      .select()
      .from(achievements)
      .where(eq(achievements.isActive, true))
      .orderBy(achievements.category, achievements.name);
  }

  async getUserAchievements(athleteId: string): Promise<any[]> {
    return await db
      .select({
        id: userAchievements.id,
        unlockedAt: userAchievements.unlockedAt,
        name: achievements.name,
        description: achievements.description,
        icon: achievements.icon,
        category: achievements.category,
        points: achievements.points,
      })
      .from(userAchievements)
      .innerJoin(achievements, eq(userAchievements.achievementId, achievements.id))
      .where(eq(userAchievements.athleteId, athleteId))
      .orderBy(desc(userAchievements.unlockedAt));
  }

  async unlockAchievement(athleteId: string, achievementId: string): Promise<UserAchievement> {
    const [newUserAchievement] = await db
      .insert(userAchievements)
      .values({ athleteId, achievementId })
      .returning();
    return newUserAchievement;
  }

  // Analytics operations
  async getPerformanceAnalytics(athleteId: string): Promise<any> {
    const testResultsData = await db
      .select({
        testName: testTypes.name,
        testCategory: testTypes.category,
        value: testResults.value,
        createdAt: testResults.createdAt,
      })
      .from(testResults)
      .innerJoin(testTypes, eq(testResults.testTypeId, testTypes.id))
      .where(eq(testResults.athleteId, athleteId))
      .orderBy(testResults.createdAt);

    // Calculate performance trends
    const performanceByCategory = testResultsData.reduce((acc, result) => {
      if (!acc[result.testCategory]) {
        acc[result.testCategory] = [];
      }
      acc[result.testCategory].push({
        value: parseFloat(result.value),
        date: result.createdAt,
      });
      return acc;
    }, {} as Record<string, Array<{ value: number; date: Date }>>);

    return {
      totalTests: testResultsData.length,
      performanceByCategory,
      recentActivity: testResultsData.slice(-10),
    };
  }

  // Helper method to update athlete's overall score
  private async updateAthleteOverallScore(athleteId: string): Promise<void> {
    const avgScore = await db
      .select({
        avgScore: avg(testResults.value),
      })
      .from(testResults)
      .where(eq(testResults.athleteId, athleteId));

    if (avgScore[0]?.avgScore) {
      await db
        .update(athleteProfiles)
        .set({
          overallScore: avgScore[0].avgScore,
          updatedAt: new Date(),
        })
        .where(eq(athleteProfiles.id, athleteId));
    }
  }
}

export const storage = new DatabaseStorage();
