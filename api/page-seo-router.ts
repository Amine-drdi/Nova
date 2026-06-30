import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { pagesSeo } from "@/../db/schema";
import { eq, desc } from "drizzle-orm";

export const pageSeoRouter = createRouter({
  list: publicQuery.input(z.object({ clientId: z.number().optional() }).optional()).query(async ({ input }) => {
    const db = getDb();
    const all = await db.select().from(pagesSeo).orderBy(desc(pagesSeo.updatedAt));
    if (!input?.clientId) return all;
    return all.filter(p => p.clientId === input.clientId);
  }),

  getById: publicQuery.input(z.object({ id: z.number() })).query(async ({ input }) => {
    const db = getDb();
    const [page] = await db.select().from(pagesSeo).where(eq(pagesSeo.id, input.id));
    return page || null;
  }),

  create: publicQuery.input(z.object({
    clientId: z.number(), url: z.string(), title: z.string().optional(),
    metaDescription: z.string().optional(), h1: z.string().optional(),
    wordCount: z.number().optional(), schemaType: z.string().optional(),
    score: z.number().default(0), status: z.enum(["optimized", "needs_work", "critical", "pending"]).default("pending"),
  })).mutation(async ({ input }) => {
    const db = getDb();
    const [page] = await db.insert(pagesSeo).values(input).$returningId();
    return { id: page.id, success: true };
  }),

  update: publicQuery.input(z.object({
    id: z.number(), title: z.string().optional(), metaDescription: z.string().optional(),
    h1: z.string().optional(), wordCount: z.number().optional(),
    schemaType: z.string().optional(), schemaData: z.string().optional(),
    score: z.number().optional(), status: z.enum(["optimized", "needs_work", "critical", "pending"]).optional(),
  })).mutation(async ({ input }) => {
    const db = getDb();
    const { id, ...data } = input;
    await db.update(pagesSeo).set({ ...data, lastOptimizedAt: new Date() }).where(eq(pagesSeo.id, id));
    return { success: true };
  }),

  delete: publicQuery.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
    const db = getDb();
    await db.delete(pagesSeo).where(eq(pagesSeo.id, input.id));
    return { success: true };
  }),

  statsByClient: publicQuery.input(z.object({ clientId: z.number() })).query(async ({ input }) => {
    const db = getDb();
    const all = await db.select().from(pagesSeo);
    const filtered = all.filter(p => p.clientId === input.clientId);
    return {
      total: filtered.length,
      optimized: filtered.filter(p => p.status === "optimized").length,
      needsWork: filtered.filter(p => p.status === "needs_work").length,
      critical: filtered.filter(p => p.status === "critical").length,
      avgScore: filtered.length > 0 ? Math.round(filtered.reduce((s, p) => s + (p.score || 0), 0) / filtered.length) : 0,
    };
  }),
});
