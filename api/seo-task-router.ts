import { publicQuery } from './middleware.js';
import { getDb } from './queries/connection.js';
import { seoTasks, type InsertSeoTask } from '../db/schema.js';
import { z } from 'zod';
import { eq, desc } from 'drizzle-orm';

export const seoTaskRouter = {
  // Créer une tâche SEO
  create: publicQuery
    .input(
      z.object({
        name: z.string(),
        targetUrl: z.string().optional(),
        payload: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();

      const insertData: Omit<InsertSeoTask, 'id' | 'createdAt' | 'updatedAt'> = {
        name: input.name,
        status: "queued",
        type: "custom",
        priority: "medium",
        targetUrl: input.targetUrl || null,
        payload: input.payload || null,
        clientId: null,
        missionId: null,
        userId: null,
        result: null,
        errorMessage: null,
        startedAt: null,
        completedAt: null,
      };

      const result = await db
        .insert(seoTasks)
        .values(insertData)
        .$returningId();

      const id = result[0]?.id;
      if (!id) {
        throw new Error('Failed to create task');
      }

      return { id, success: true };
    }),

  // Mettre à jour le statut d'une tâche
  updateStatus: publicQuery
    .input(
      z.object({
        id: z.number(),
        status: z.enum(["pending", "queued", "running", "completed", "failed", "cancelled"]),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();

      await db
        .update(seoTasks)
        .set({ status: input.status })
        .where(eq(seoTasks.id, input.id));

      return { success: true };
    }),

  // Récupérer toutes les tâches
  getAll: publicQuery.query(async () => {
    const db = getDb();

    const tasks = await db
      .select()
      .from(seoTasks)
      .orderBy(desc(seoTasks.createdAt));

    return tasks;
  }),

  // Récupérer une tâche par son ID
  getById: publicQuery
    .input(
      z.object({
        id: z.number(),
      })
    )
    .query(async ({ input }) => {
      const db = getDb();

      const task = await db
        .select()
        .from(seoTasks)
        .where(eq(seoTasks.id, input.id))
        .limit(1);

      return task[0] || null;
    }),

  // Supprimer une tâche
  delete: publicQuery
    .input(
      z.object({
        id: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();

      await db
        .delete(seoTasks)
        .where(eq(seoTasks.id, input.id));

      return { success: true };
    }),
};

export default seoTaskRouter;