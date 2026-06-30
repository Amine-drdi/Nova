import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { keywordRankings } from "@/../db/schema";
import { eq, desc } from "drizzle-orm";

export const keywordRouter = createRouter({
  list: publicQuery.input(z.object({ clientId: z.number().optional() }).optional()).query(async ({ input }) => {
    const db = getDb();
    const all = await db.select().from(keywordRankings).orderBy(desc(keywordRankings.checkedAt));
    if (!input?.clientId) return all;
    return all.filter(k => k.clientId === input.clientId);
  }),

  getById: publicQuery.input(z.object({ id: z.number() })).query(async ({ input }) => {
    const db = getDb();
    const [kw] = await db.select().from(keywordRankings).where(eq(keywordRankings.id, input.id));
    return kw || null;
  }),

  create: publicQuery.input(z.object({
    clientId: z.number(), keyword: z.string(), url: z.string().optional(),
    position: z.number().optional(), searchVolume: z.number().optional(),
    cpc: z.string().optional(), difficulty: z.number().optional(),
    engine: z.enum(["google", "bing", "chatgpt", "perplexity", "gemini", "claude"]).default("google"),
  })).mutation(async ({ input }) => {
    const db = getDb();
    const [kw] = await db.insert(keywordRankings).values(input).$returningId();
    return { id: kw.id, success: true };
  }),

  updatePosition: publicQuery.input(z.object({
    id: z.number(), position: z.number(), previousPosition: z.number().optional(),
  })).mutation(async ({ input }) => {
    const db = getDb();
    const { id, ...data } = input;
    await db.update(keywordRankings).set({ ...data, checkedAt: new Date() }).where(eq(keywordRankings.id, id));
    return { success: true };
  }),

  update: publicQuery.input(z.object({
    id: z.number(), keyword: z.string().optional(), url: z.string().optional(),
    position: z.number().optional(), searchVolume: z.number().optional(),
    difficulty: z.number().optional(),
  })).mutation(async ({ input }) => {
    const db = getDb();
    const { id, ...data } = input;
    await db.update(keywordRankings).set(data).where(eq(keywordRankings.id, id));
    return { success: true };
  }),

  delete: publicQuery.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
    const db = getDb();
    await db.delete(keywordRankings).where(eq(keywordRankings.id, input.id));
    return { success: true };
  }),

  countByClient: publicQuery.input(z.object({ clientId: z.number() })).query(async ({ input }) => {
    const db = getDb();
    const all = await db.select().from(keywordRankings);
    const filtered = all.filter(k => k.clientId === input.clientId);
    return { total: filtered.length, top10: filtered.filter(k => (k.position || 999) <= 10).length };
  }),
});
