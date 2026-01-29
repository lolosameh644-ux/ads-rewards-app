import { boolean, int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  // VPN Detection fields
  isVpnUser: boolean("isVpnUser").default(false).notNull(),
  fraudScore: int("fraudScore").default(0).notNull(),
  lastIpAddress: varchar("lastIpAddress", { length: 45 }),
  isBlocked: boolean("isBlocked").default(false).notNull(),
  blockReason: varchar("blockReason", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * User points table - tracks points balance for each user
 */
export const userPoints = mysqlTable("user_points", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  points: int("points").default(0).notNull(),
  totalEarned: int("totalEarned").default(0).notNull(),
  totalWithdrawn: int("totalWithdrawn").default(0).notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type UserPoints = typeof userPoints.$inferSelect;
export type InsertUserPoints = typeof userPoints.$inferInsert;

/**
 * Withdrawal requests table - stores withdrawal requests from users
 */
export const withdrawalRequests = mysqlTable("withdrawal_requests", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  points: int("points").notNull(),
  amountUsd: varchar("amountUsd", { length: 20 }).notNull(),
  method: mysqlEnum("method", ["instapay", "vodafone_cash", "paypal"]).notNull(),
  methodDetails: varchar("methodDetails", { length: 255 }).notNull(),
  status: mysqlEnum("status", ["pending", "approved", "rejected"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type WithdrawalRequest = typeof withdrawalRequests.$inferSelect;
export type InsertWithdrawalRequest = typeof withdrawalRequests.$inferInsert;

/**
 * Ad views table - tracks ad views for each user
 */
export const adViews = mysqlTable("ad_views", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  adId: varchar("adId", { length: 255 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AdView = typeof adViews.$inferSelect;
export type InsertAdView = typeof adViews.$inferInsert;

/**
 * Ads table - stores advertisement data
 */
export const ads = mysqlTable("ads", {
  id: varchar("id", { length: 255 }).primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  imageUrl: varchar("imageUrl", { length: 500 }),
  videoUrl: varchar("videoUrl", { length: 500 }),
  advertiserName: varchar("advertiserName", { length: 255 }).notNull(),
  advertiserLogo: varchar("advertiserLogo", { length: 500 }),
  rewardPoints: int("rewardPoints").default(1).notNull(),
  duration: int("duration").default(30).notNull(), // duration in seconds
  isActive: boolean("isActive").default(true).notNull(),
  targetCountry: varchar("targetCountry", { length: 10 }).default("EG").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Ad = typeof ads.$inferSelect;
export type InsertAd = typeof ads.$inferInsert;
