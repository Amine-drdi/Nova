import { authRouter } from "./auth-router";
import { createRouter, publicQuery } from "./middleware";
import { clientRouter } from "./client-router";
import { seoTaskRouter } from "./seo-task-router";
import { keywordRouter } from "./keyword-router";
import { pageSeoRouter } from "./page-seo-router";
import { backlinkRouter } from "./backlink-router";
import { missionRouter } from "./mission-router";

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
