import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, 
  users, 
  userPoints, 
  InsertUserPoints, 
  withdrawalRequests, 
  InsertWithdrawalRequest,
  adViews,
  InsertAdView
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ============ User Points Functions ============

/**
 * Get user points by user ID
 */
export async function getUserPoints(userId: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(userPoints).where(eq(userPoints.userId, userId)).limit(1);
  return result.length > 0 ? result[0] : null;
}

/**
 * Initialize user points (called after user registration)
 */
export async function initializeUserPoints(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(userPoints).values({
    userId,
    points: 0,
    totalEarned: 0,
    totalWithdrawn: 0,
  });
}

/**
 * Add points to user (after watching ad)
 */
export async function addPoints(userId: number, points: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const current = await getUserPoints(userId);
  if (!current) {
    // Initialize if not exists
    await initializeUserPoints(userId);
    await db.update(userPoints)
      .set({
        points: points,
        totalEarned: points,
      })
      .where(eq(userPoints.userId, userId));
  } else {
    await db.update(userPoints)
      .set({
        points: current.points + points,
        totalEarned: current.totalEarned + points,
      })
      .where(eq(userPoints.userId, userId));
  }
}

/**
 * Deduct points from user (for withdrawal)
 */
export async function deductPoints(userId: number, points: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const current = await getUserPoints(userId);
  if (!current || current.points < points) {
    throw new Error("Insufficient points");
  }

  await db.update(userPoints)
    .set({
      points: current.points - points,
      totalWithdrawn: current.totalWithdrawn + points,
    })
    .where(eq(userPoints.userId, userId));
}

/**
 * Update user points (admin function)
 */
export async function updateUserPoints(userId: number, points: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(userPoints)
    .set({ points })
    .where(eq(userPoints.userId, userId));
}

// ============ Withdrawal Functions ============

/**
 * Create withdrawal request
 */
export async function createWithdrawalRequest(data: InsertWithdrawalRequest) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(withdrawalRequests).values(data);
  return Number(result[0].insertId);
}

/**
 * Get withdrawal requests by user ID
 */
export async function getUserWithdrawalRequests(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(withdrawalRequests).where(eq(withdrawalRequests.userId, userId));
}

/**
 * Get all withdrawal requests (admin)
 */
export async function getAllWithdrawalRequests() {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(withdrawalRequests);
}

/**
 * Update withdrawal request status
 */
export async function updateWithdrawalStatus(
  requestId: number, 
  status: "pending" | "approved" | "rejected"
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(withdrawalRequests)
    .set({ 
      status,
      processedAt: new Date(),
    })
    .where(eq(withdrawalRequests.id, requestId));
}

/**
 * Get withdrawal request by ID
 */
export async function getWithdrawalRequestById(requestId: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(withdrawalRequests).where(eq(withdrawalRequests.id, requestId)).limit(1);
  return result.length > 0 ? result[0] : null;
}

// ============ Ad Views Functions ============

/**
 * Record ad view
 */
export async function recordAdView(data: InsertAdView) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(adViews).values(data);
  return Number(result[0].insertId);
}

/**
 * Get user ad views count
 */
export async function getUserAdViewsCount(userId: number) {
  const db = await getDb();
  if (!db) return 0;

  const result = await db.select().from(adViews).where(eq(adViews.userId, userId));
  return result.length;
}

/**
 * Get user ad views today
 */
export async function getUserAdViewsToday(userId: number) {
  const db = await getDb();
  if (!db) return 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const result = await db.select().from(adViews).where(eq(adViews.userId, userId));
  const todayViews = result.filter(view => {
    const viewDate = new Date(view.viewedAt);
    return viewDate >= today;
  });

  return todayViews.length;
}

// ============ Admin Functions ============

/**
 * Get all users with their points
 */
export async function getAllUsersWithPoints() {
  const db = await getDb();
  if (!db) return [];

  // Get all users
  const allUsers = await db.select().from(users);
  
  // Get points for each user
  const usersWithPoints = await Promise.all(
    allUsers.map(async (user) => {
      const points = await getUserPoints(user.id);
      const adViewsCount = await getUserAdViewsCount(user.id);
      return {
        ...user,
        points: points?.points || 0,
        totalEarned: points?.totalEarned || 0,
        totalWithdrawn: points?.totalWithdrawn || 0,
        adViewsCount,
      };
    })
  );

  return usersWithPoints;
}
