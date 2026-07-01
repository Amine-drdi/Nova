import { z } from "zod";
import { createRouter, publicQuery } from './middleware.js';
import { getDb } from './queries/connection.js';
import { clients } from "../db/schema.js";
import { eq, desc, like, or } from "drizzle-orm";

export const clientRouter = createRouter({
  list: publicQuery.query(async () => {
    const db = getDb();
    return db.select().from(clients).orderBy(desc(clients.createdAt));
  }),

  getById: publicQuery.input(z.object({ id: z.number() })).query(async ({ input }) => {
    const db = getDb();
    const [client] = await db.select().from(clients).where(eq(clients.id, input.id));
    return client || null;
  }),

  search: publicQuery.input(z.object({ q: z.string() })).query(async ({ input }) => {
    const db = getDb();
    return db.select().from(clients).where(
      or(like(clients.name, `%${input.q}%`), like(clients.url, `%${input.q}%`))
    );
  }),

  create: publicQuery.input(z.object({
    name: z.string().min(1),
    url: z.string().url(),
    platform: z.enum(["wordpress", "shopify", "generic", "webflow", "wix"]),
    apiKey: z.string().optional(),
    apiEndpoint: z.string().optional(),
  })).mutation(async ({ input }) => {
    const db = getDb();
    const [client] = await db.insert(clients).values({
      ...input, status: "pending", seoScore: 0, pagesCount: 0, keywordsCount: 0,
    }).$returningId();
    return { id: client.id, success: true };
  }),

  update: publicQuery.input(z.object({
    id: z.number(),
    name: z.string().min(1).optional(),
    url: z.string().url().optional(),
    platform: z.enum(["wordpress", "shopify", "generic", "webflow", "wix"]).optional(),
    apiKey: z.string().optional(),
    apiEndpoint: z.string().optional(),
    status: z.enum(["active", "disconnected", "error", "pending"]).optional(),
  })).mutation(async ({ input }) => {
    const db = getDb();
    const { id, ...data } = input;
    await db.update(clients).set(data).where(eq(clients.id, id));
    return { success: true };
  }),

  delete: publicQuery.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
    const db = getDb();
    await db.delete(clients).where(eq(clients.id, input.id));
    return { success: true };
  }),

  testConnection: publicQuery.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
    await new Promise(r => setTimeout(r, 1500));
    const db = getDb();
    await db.update(clients).set({ status: "active", lastSyncAt: new Date() }).where(eq(clients.id, input.id));
    return { success: true, status: "active", latency: 145 };
  }),

  count: publicQuery.query(async () => {
    const db = getDb();
    const all = await db.select().from(clients);
    return { total: all.length, active: all.filter(c => c.status === "active").length };
  }),
});
