import { z } from "zod";
import { createRouter, publicQuery } from './middleware.js';
import { getDb } from './queries/connection.js';
import { backlinks } from "@/../db/schema";
import { eq, desc } from "drizzle-orm";

export const backlinkRouter = createRouter({
  list: publicQuery.input(z.object({ clientId: z.number().optional() }).optional()).query(async ({ input }) => {
    const db = getDb();
    const all = await db.select().from(backlinks).orderBy(desc(backlinks.discoveredAt));
    if (!input?.clientId) return all;
    return all.filter(b => b.clientId === input.clientId);
  }),

  getById: publicQuery.input(z.object({ id: z.number() })).query(async ({ input }) => {
    const db = getDb();
    const [bl] = await db.select().from(backlinks).where(eq(backlinks.id, input.id));
    return bl || null;
  }),

  create: publicQuery.input(z.object({
    clientId: z.number(), sourceUrl: z.string(), targetUrl: z.string(),
    anchorText: z.string().optional(), domainAuthority: z.number().optional(),
    isDoFollow: z.enum(["yes", "no"]).default("yes"),
  })).mutation(async ({ input }) => {
    const db = getDb();
    const [bl] = await db.insert(backlinks).values({ ...input, status: "active" }).$returningId();
    return { id: bl.id, success: true };
  }),

  update: publicQuery.input(z.object({
    id: z.number(), anchorText: z.string().optional(),
    domainAuthority: z.number().optional(), isDoFollow: z.enum(["yes", "no"]).optional(),
    status: z.enum(["active", "lost", "pending"]).optional(),
  })).mutation(async ({ input }) => {
    const db = getDb();
    const { id, ...data } = input;
    await db.update(backlinks).set(data).where(eq(backlinks.id, id));
    return { success: true };
  }),

  delete: publicQuery.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
    const db = getDb();
    await db.delete(backlinks).where(eq(backlinks.id, input.id));
    return { success: true };
  }),

  statsByClient: publicQuery.input(z.object({ clientId: z.number() })).query(async ({ input }) => {
    const db = getDb();
    const all = await db.select().from(backlinks);
    const filtered = all.filter(b => b.clientId === input.clientId);
    return {
      total: filtered.length,
      active: filtered.filter(b => b.status === "active").length,
      lost: filtered.filter(b => b.status === "lost").length,
      avgDA: filtered.length > 0 ? Math.round(filtered.reduce((s, b) => s + (b.domainAuthority || 0), 0) / filtered.length) : 0,
    };
  }),
});
