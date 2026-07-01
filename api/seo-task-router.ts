import { publicQuery } from './middleware.js';
import { getDb } from './queries/connection.js';
import { seoTasks } from '../db/schema.js';
import { z } from 'zod';
import { eq, desc } from 'drizzle-orm';

export const seoTaskRouter = {
  // Créer une tâche SEO
  create: publicQuery.input(z.object({
    name: z.string(),
    targetUrl: z.string().optional(),
    payload: z.string().optional(),
  })).mutation(async ({ input }) => {
    const db = getDb();
    
    const result = await db.insert(seoTasks)
      .values({
        ...input,
        status: "queued",
      })
      .$returningId();
    
    const id = result[0]?.id;
    if (!id) {
      throw new Error('Failed to create task');
    }
    
    return { id, success: true };
  }),

  // Mettre à jour le statut
  updateStatus: publicQuery.input(z.object({
    id: z.number(),
    status: z.enum(["pending", "queued", "running", "completed", "failed", "cancelled"]),
  })).mutation(async ({ input }) => {
    const db = getDb();
    
    await db.update(seoTasks)
      .set({ status: input.status })
      .where(eq(seoTasks.id, input.id));
    
    return { success: true };
  }),

  // Récupérer les tâches d'un utilisateur
  getByUser: publicQuery.input(z.object({
    userId: z.string(),
  })).query(async ({ input }) => {
    const db = getDb();
    
    const tasks = await db.select()
      .from(seoTasks)
      .where(eq(seoTasks.userId, input.userId))
      .orderBy(desc(seoTasks.createdAt));
    
    return tasks;
  }),
};