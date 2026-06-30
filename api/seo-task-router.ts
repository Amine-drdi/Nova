import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { seoTasks } from "@/../db/schema";
import { eq, desc } from "drizzle-orm";

export const seoTaskRouter = createRouter({
  list: publicQuery.input(z.object({
    missionId: z.number().optional(),
    clientId: z.number().optional(),
    status: z.string().optional(),
  }).optional()).query(async ({ input }) => {
    const db = getDb();
    let query = db.select().from(seoTasks).orderBy(desc(seoTasks.createdAt));
    const all = await query;
    if (!input) return all;
    return all.filter(t => {
      if (input.missionId && t.missionId !== input.missionId) return false;
      if (input.clientId && t.clientId !== input.clientId) return false;
      if (input.status && t.status !== input.status) return false;
      return true;
    });
  }),

  getById: publicQuery.input(z.object({ id: z.number() })).query(async ({ input }) => {
    const db = getDb();
    const [task] = await db.select().from(seoTasks).where(eq(seoTasks.id, input.id));
    return task || null;
  }),

  create: publicQuery.input(z.object({
    missionId: z.number().optional(),
    clientId: z.number(),
    type: z.string(),
    priority: z.enum(["low", "medium", "high", "critical"]).default("medium"),
    targetUrl: z.string().optional(),
    payload: z.string().optional(),
  })).mutation(async ({ input }) => {
    const db = getDb();
    const [task] = await db.insert(seoTasks).values({
      ...input, status: "queued",
    }).$returningId();
    return { id: task.id, success: true };
  }),

  updateStatus: publicQuery.input(z.object({
    id: z.number(),
    status: z.enum(["pending", "queued", "running", "completed", "failed", "cancelled"]),
  })).mutation(async ({ input }) => {
    const db = getDb();
    await db.update(seoTasks).set({ status: input.status }).where(eq(seoTasks.id, input.id));
    return { success: true };
  }),

  bulkUpdateStatus: publicQuery.input(z.object({
    ids: z.array(z.number()),
    status: z.enum(["pending", "queued", "running", "completed", "failed", "cancelled"]),
  })).mutation(async ({ input }) => {
    const db = getDb();
    for (const id of input.ids) {
      await db.update(seoTasks).set({ status: input.status }).where(eq(seoTasks.id, id));
    }
    return { success: true };
  }),

  delete: publicQuery.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
    const db = getDb();
    await db.delete(seoTasks).where(eq(seoTasks.id, input.id));
    return { success: true };
  }),

  bulkDelete: publicQuery.input(z.object({
    ids: z.array(z.number()),
  })).mutation(async ({ input }) => {
    const db = getDb();
    for (const id of input.ids) {
      await db.delete(seoTasks).where(eq(seoTasks.id, id));
    }
    return { success: true };
  }),

  stats: publicQuery.query(async () => {
    const db = getDb();
    const all = await db.select().from(seoTasks);
    return {
      total: all.length,
      pending: all.filter(t => t.status === "pending").length,
      running: all.filter(t => t.status === "running").length,
      completed: all.filter(t => t.status === "completed").length,
      failed: all.filter(t => t.status === "failed").length,
    };
  }),
});
