import { authRouter } from './auth-router.js';
import { createRouter, publicQuery } from './middleware.js';
import { clientRouter } from './client-router.js';
import seoTaskRouter from './seo-task-router.js';
import { keywordRouter } from './keyword-router.js';
import { pageSeoRouter } from './page-seo-router.js';
import { backlinkRouter } from './backlink-router.js';
import { missionRouter } from './mission-router.js';

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  client: clientRouter,
  seoTask: seoTaskRouter,
  keyword: keywordRouter,
  pageSeo: pageSeoRouter,
  backlink: backlinkRouter,
  mission: missionRouter,
});

export type AppRouter = typeof appRouter;
