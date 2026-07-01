import { z } from "zod";
import { createRouter, publicQuery } from './middleware.js';
import { getDb } from './queries/connection.js';
import { missions, seoTasks, clients } from "@/../db/schema";
import { eq, desc } from "drizzle-orm";

// ─── NLP Intent Parser ───
interface ParsedIntent {
  action: string;
  targetType: "client" | "all" | "platform";
  targetValue: string;
  scope: "full" | "specific";
  urls?: string[];
  keywords?: string[];
}

function parseQuery(query: string, allClients: any[]): ParsedIntent {
  const q = query.toLowerCase();

  let targetType: "client" | "all" | "platform" = "all";
  let targetValue = "all";

  for (const client of allClients) {
    if (q.includes(client.name.toLowerCase()) || q.includes(client.url.toLowerCase().replace(/https?:\/\//, ""))) {
      targetType = "client";
      targetValue = client.id.toString();
      break;
    }
  }

  if (q.includes("wordpress")) { targetType = "platform"; targetValue = "wordpress"; }
  else if (q.includes("shopify")) { targetType = "platform"; targetValue = "shopify"; }

  let action = "custom";
  if (q.includes("audit") || q.includes("analyse")) action = "audit";
  else if (q.includes("meta") || q.includes("titre") || q.includes("description")) action = "meta";
  else if (q.includes("sitemap")) action = "sitemap";
  else if (q.includes("schema.org") || q.includes("rich snippet")) action = "schema";
  else if (q.includes("content") || q.includes("article") || q.includes("blog")) action = "content";
  else if (q.includes("image")) action = "images";
  else if (q.includes("lien") || q.includes("link")) action = "links";
  else if (q.includes("performance") || q.includes("vitesse") || q.includes("core web")) action = "performance";
  else if (q.includes("keyword") || q.includes("mot-cle") || q.includes("position")) action = "keywords";
  else if (q.includes("robots")) action = "robots";
  else if (q.includes("redirect") || q.includes("redirection")) action = "redirect";

  const scope = (q.includes("complet") || q.includes("full") || q.includes("total")) ? "full" : "specific";
  const urlMatches = q.match(/(?:https?:\/\/[^\s]+|[/][^\s]+)/g);
  const urls = urlMatches || undefined;
  const kwMatches = q.match(/["']([^"']+)["']/g);
  const keywords = kwMatches ? kwMatches.map(k => k.replace(/["']/g, "")) : undefined;

  return { action, targetType, targetValue, scope, urls, keywords };
}

// ─── Task Generator ───
interface TaskPlan { type: string; label: string; payload: Record<string, any>; }

function generateTaskPlan(intent: ParsedIntent): TaskPlan[] {
  const plans: Record<string, TaskPlan[]> = {
    audit: [
      { type: "audit_performance", label: "Audit Core Web Vitals", payload: {} },
      { type: "check_broken_links", label: "Scan liens casses", payload: {} },
      { type: "analyze_keywords", label: "Analyse positions mots-cles", payload: {} },
      { type: "build_sitemap", label: "Generation sitemap", payload: {} },
    ],
    meta: [{ type: "update_meta", label: "Optimisation meta tags", payload: {} }],
    sitemap: [
      { type: "build_sitemap", label: "Generation sitemap XML", payload: {} },
      { type: "submit_sitemap", label: "Soumission Google/Bing", payload: {} },
    ],
    schema: [{ type: "update_schema_org", label: "Injection Schema.org", payload: { schemaType: "LocalBusiness" } }],
    content: [{ type: "generate_content", label: "Generation contenu IA", payload: { wordCount: 800 } }],
    images: [{ type: "optimize_images", label: "Compression images WebP", payload: {} }],
    links: [{ type: "check_broken_links", label: "Verification liens", payload: {} }],
    performance: [{ type: "audit_performance", label: "Audit performance complet", payload: {} }],
    keywords: [{ type: "analyze_keywords", label: "Analyse mots-cles", payload: {} }],
    robots: [{ type: "update_robots_txt", label: "Mise a jour robots.txt", payload: {} }],
    redirect: [{ type: "create_redirect", label: "Creation redirection 301", payload: { type: "301" } }],
  };

  if (intent.scope === "full" && intent.action === "audit") {
    return [...plans.audit, ...plans.meta, ...plans.sitemap, ...plans.schema, ...plans.images];
  }
  if (intent.scope === "full") return Object.values(plans).flat();
  return plans[intent.action] || [{ type: "custom", label: "Mission Custom", payload: {} }];
}

// ─── Execution Engine ───
const taskExecutors: Record<string, (client: any, payload: any) => Promise<any>> = {
  async update_meta(client: any, payload: any) {
    await new Promise(r => setTimeout(r, 1000));
    return { updated: true, page: payload?.page || "/", title: payload?.title, metaDescription: payload?.metaDescription };
  },
  async update_schema_org(client: any, payload: any) {
    await new Promise(r => setTimeout(r, 800));
    return { updated: true, schemaType: payload?.schemaType || "LocalBusiness", page: payload?.page || "/" };
  },
  async generate_content(client: any, payload: any) {
    await new Promise(r => setTimeout(r, 2500));
    return { generated: true, wordCount: payload?.wordCount || 800, topic: payload?.topic || "SEO" };
  },
  async optimize_images(client: any, payload: any) {
    await new Promise(r => setTimeout(r, 1500));
    return { optimized: true, imagesCount: payload?.imagesCount || 5, savingsPercent: 35 };
  },
  async build_sitemap(client: any) {
    await new Promise(r => setTimeout(r, 600));
    return { built: true, pagesCount: client?.pagesCount || 47, url: `${client?.url || ""}/sitemap.xml` };
  },
  async submit_sitemap(client: any) {
    await new Promise(r => setTimeout(r, 1200));
    return { submitted: true, engines: ["Google", "Bing"], url: `${client?.url || ""}/sitemap.xml` };
  },
  async check_broken_links(client: any) {
    await new Promise(r => setTimeout(r, 2000));
    return { checked: true, totalLinks: 342, brokenLinks: 3, fixed: 3 };
  },
  async update_robots_txt(client: any, payload: any) {
    await new Promise(r => setTimeout(r, 400));
    return { updated: true, rules: payload?.rules || ["User-agent: *", "Allow: /"] };
  },
  async create_redirect(client: any, payload: any) {
    await new Promise(r => setTimeout(r, 500));
    return { created: true, from: payload?.from, to: payload?.to, type: payload?.type || "301" };
  },
  async analyze_keywords(client: any, payload: any) {
    await new Promise(r => setTimeout(r, 1800));
    return {
      analyzed: true,
      keywords: [
        { keyword: payload?.keyword || "telesecretariat", position: 12, volume: 2400, difficulty: 45 },
        { keyword: "standard externalise", position: 8, volume: 1800, difficulty: 38 },
        { keyword: "centre appel tunisie", position: 3, volume: 3200, difficulty: 52 },
      ],
    };
  },
  async audit_performance(client: any) {
    await new Promise(r => setTimeout(r, 3000));
    return { audited: true, lcp: 2.1, fid: 45, cls: 0.08, score: 87, issues: [
      { severity: "high", issue: "Images non optimisees", fix: "Compresser WebP" },
      { severity: "medium", issue: "Render-blocking JS", fix: "Defer scripts" },
      { severity: "low", issue: "Cache manquant", fix: "Activer cache navigateur" },
    ]};
  },
  async custom(client: any, payload: any) {
    await new Promise(r => setTimeout(r, 1000));
    return { executed: true, command: payload?.command, output: payload?.output || "OK" };
  },
};

async function executeTask(taskId: number) {
  const db = getDb();
  const [task] = await db.select().from(seoTasks).where(eq(seoTasks.id, taskId));
  if (!task) return;

  await db.update(seoTasks).set({ status: "running", startedAt: new Date() }).where(eq(seoTasks.id, taskId));

  try {
    const [client] = await db.select().from(clients).where(eq(clients.id, task.clientId));
    if (!client) throw new Error("Client introuvable");

    const executor = taskExecutors[task.type] || taskExecutors.custom;
    const result = await executor(client, task.payload ? JSON.parse(task.payload as string) : {});

    await db.update(seoTasks).set({
      status: "completed", result: JSON.stringify(result), completedAt: new Date(),
    }).where(eq(seoTasks.id, taskId));

    if (task.missionId) {
      const missionTasks = await db.select().from(seoTasks).where(eq(seoTasks.missionId, task.missionId));
      const completed = missionTasks.filter(t => t.status === "completed").length;
      const failed = missionTasks.filter(t => t.status === "failed").length;
      const allDone = missionTasks.every(t => t.status === "completed" || t.status === "failed" || t.status === "cancelled");

      await db.update(missions).set({
        completedTasks: completed, failedTasks: failed,
        status: allDone ? (failed === 0 ? "completed" : "failed") : "running",
        completedAt: allDone ? new Date() : undefined,
      }).where(eq(missions.id, task.missionId));
    }
  } catch (error) {
    await db.update(seoTasks).set({
      status: "failed", errorMessage: (error as Error).message, completedAt: new Date(),
    }).where(eq(seoTasks.id, taskId));
  }
}

// ─── Router ───
export const missionRouter = createRouter({
  list: publicQuery.query(async () => {
    const db = getDb();
    return db.select().from(missions).orderBy(desc(missions.createdAt));
  }),

  getById: publicQuery.input(z.object({ id: z.number() })).query(async ({ input }) => {
    const db = getDb();
    const [mission] = await db.select().from(missions).where(eq(missions.id, input.id));
    if (!mission) return null;
    const tasks = await db.select().from(seoTasks).where(eq(seoTasks.missionId, input.id));
    return { ...mission, tasks };
  }),

  createFromQuery: publicQuery.input(z.object({
    query: z.string().min(3),
    priority: z.enum(["low", "medium", "high", "critical"]).default("medium"),
  })).mutation(async ({ input }) => {
    const db = getDb();
    const allClients = await db.select().from(clients);
    const intent = parseQuery(input.query, allClients);

    let targetClients: any[] = [];
    if (intent.targetType === "client") {
      const c = allClients.find(c => c.id.toString() === intent.targetValue);
      if (c) targetClients = [c];
    } else if (intent.targetType === "platform") {
      targetClients = allClients.filter(c => c.platform === intent.targetValue);
    } else {
      targetClients = allClients;
    }

    if (targetClients.length === 0) {
      return { success: false, message: "Aucun client trouve pour cette requete. Ajoutez d'abord un client dans CRM Connect." };
    }

    const taskPlan = generateTaskPlan(intent);
    const [mission] = await db.insert(missions).values({
      title: generateMissionTitle(intent, input.query),
      query: input.query,
      status: "queued", priority: input.priority,
      clientIds: JSON.stringify(targetClients.map(c => c.id)),
      plannedTasks: taskPlan.length * targetClients.length,
      completedTasks: 0, failedTasks: 0,
    }).$returningId();

    const createdTasks: number[] = [];
    for (const client of targetClients) {
      for (const plan of taskPlan) {
        const [task] = await db.insert(seoTasks).values({
          missionId: mission.id, clientId: client.id,
          type: plan.type as any, status: "queued", priority: input.priority,
          payload: JSON.stringify({ ...plan.payload, ...(intent.urls ? { urls: intent.urls } : {}), ...(intent.keywords ? { keywords: intent.keywords } : {}) }),
        }).$returningId();
        createdTasks.push(task.id);
      }
    }

    await db.update(missions).set({ plannedTasks: createdTasks.length, status: "running", startedAt: new Date() }).where(eq(missions.id, mission.id));

    for (const taskId of createdTasks) {
      setTimeout(() => executeTask(taskId), 100 + Math.random() * 500);
    }

    return {
      success: true, missionId: mission.id,
      title: generateMissionTitle(intent, input.query),
      clients: targetClients.map(c => c.name),
      plannedTasks: createdTasks.length,
      message: `Mission "${generateMissionTitle(intent, input.query)}" creee avec ${createdTasks.length} taches. Execution automatique en cours...`,
    };
  }),

  cancel: publicQuery.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
    const db = getDb();
    await db.update(missions).set({ status: "cancelled" }).where(eq(missions.id, input.id));
    await db.update(seoTasks).set({ status: "cancelled" }).where(eq(seoTasks.missionId, input.id));
    return { success: true };
  }),

  delete: publicQuery.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
    const db = getDb();
    await db.delete(seoTasks).where(eq(seoTasks.missionId, input.id));
    await db.delete(missions).where(eq(missions.id, input.id));
    return { success: true };
  }),

  getStats: publicQuery.query(async () => {
    const db = getDb();
    const allMissions = await db.select().from(missions);
    return {
      total: allMissions.length,
      running: allMissions.filter(m => m.status === "running").length,
      completed: allMissions.filter(m => m.status === "completed").length,
      failed: allMissions.filter(m => m.status === "failed").length,
      queued: allMissions.filter(m => m.status === "queued").length,
    };
  }),
});

function generateMissionTitle(intent: ParsedIntent, query: string): string {
  const actionLabels: Record<string, string> = {
    audit: "Audit SEO", meta: "Optimisation Meta", sitemap: "Gestion Sitemap",
    schema: "Schema.org", content: "Generation Contenu", images: "Optimisation Images",
    links: "Verification Liens", performance: "Audit Performance", keywords: "Analyse Keywords",
    robots: "Robots.txt", redirect: "Redirections", custom: "Mission Custom",
  };
  return `${actionLabels[intent.action] || "Mission"} ${intent.scope === "full" ? "Complet" : "Cible"}`;
}
