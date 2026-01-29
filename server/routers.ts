import { z } from "zod";
import { COOKIE_NAME } from "../shared/const.js";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import * as db from "./db";

export const appRouter = router({
  // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Points routes
  points: router({
    // Get current user points
    get: protectedProcedure.query(async ({ ctx }) => {
      const points = await db.getUserPoints(ctx.user.id);
      if (!points) {
        // Initialize points if not exists
        await db.initializeUserPoints(ctx.user.id);
        return {
          points: 0,
          totalEarned: 0,
          totalWithdrawn: 0,
        };
      }
      return points;
    }),

    // Add points after watching ad
    add: protectedProcedure
      .input(z.object({
        points: z.number().min(1).max(10),
        adId: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        // Add points
        await db.addPoints(ctx.user.id, input.points);
        
        // Record ad view
        await db.recordAdView({
          userId: ctx.user.id,
          adId: input.adId || "unknown",
        });

        return { success: true };
      }),

    // Get ad views count
    adViews: protectedProcedure.query(async ({ ctx }) => {
      const total = await db.getUserAdViewsCount(ctx.user.id);
      const today = await db.getUserAdViewsToday(ctx.user.id);
      return { total, today };
    }),
  }),

  // Withdrawal routes
  withdrawal: router({
    // Create withdrawal request
    create: protectedProcedure
      .input(z.object({
        points: z.number().min(900),
        method: z.enum(["instapay", "vodafone_cash", "paypal"]),
        contactInfo: z.string().min(1),
      }))
      .mutation(async ({ ctx, input }) => {
        // Check if user is blocked or using VPN
        if (ctx.user.isBlocked) {
          throw new Error(`Account blocked: ${ctx.user.blockReason || "Suspicious activity detected"}`);
        }
        if (ctx.user.isVpnUser) {
          throw new Error("VPN usage detected. Withdrawals are not allowed while using VPN.");
        }

        // Check if user has enough points
        const userPoints = await db.getUserPoints(ctx.user.id);
        if (!userPoints || userPoints.points < input.points) {
          throw new Error("Insufficient points");
        }

        // Calculate USD amount (300 points = 1 USD)
        const amountUsd = (input.points / 300).toFixed(2);

        // Deduct points
        await db.deductPoints(ctx.user.id, input.points);

        // Create withdrawal request
        const requestId = await db.createWithdrawalRequest({
          userId: ctx.user.id,
          points: input.points,
          amountUsd,
          method: input.method,
          methodDetails: input.contactInfo,
          status: "pending",
        });

        return { success: true, requestId };
      }),

    // Get user withdrawal requests
    list: protectedProcedure.query(async ({ ctx }) => {
      return db.getUserWithdrawalRequests(ctx.user.id);
    }),
  }),

  // Admin routes
  admin: router({
    // Get all users with points
    users: protectedProcedure.query(async ({ ctx }) => {
      // Check if user is admin
      if (ctx.user.role !== "admin") {
        throw new Error("Unauthorized");
      }
      return db.getAllUsersWithPoints();
    }),

    // Get all withdrawal requests
    withdrawals: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new Error("Unauthorized");
      }
      return db.getAllWithdrawalRequests();
    }),

    // Update withdrawal status
    updateWithdrawal: protectedProcedure
      .input(z.object({
        requestId: z.number(),
        status: z.enum(["pending", "approved", "rejected"]),
      }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") {
          throw new Error("Unauthorized");
        }

        // If rejected, return points to user
        if (input.status === "rejected") {
          const request = await db.getWithdrawalRequestById(input.requestId);
          if (request && request.status === "pending") {
            await db.addPoints(request.userId, request.points);
          }
        }

        await db.updateWithdrawalStatus(input.requestId, input.status);
        return { success: true };
      }),

    // Update user points
    updateUserPoints: protectedProcedure
      .input(z.object({
        userId: z.number(),
        points: z.number().min(0),
      }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") {
          throw new Error("Unauthorized");
        }
        await db.updateUserPoints(input.userId, input.points);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
