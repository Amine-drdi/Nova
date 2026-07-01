import {
  mysqlTable,
  mysqlEnum,
  serial,
  varchar,
  text,
  timestamp,
  int,
  json,
  bigint,
} from "drizzle-orm/mysql-core";

// ─── Users (auth) ───
export const users = mysqlTable("nova_users", {
  id: serial("id").primaryKey(),
  unionId: varchar("unionId", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 320 }),
  avatar: text("avatar"),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
  lastSignInAt: timestamp("lastSignInAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ─── Clients (sites web gérés) ───
export const clients = mysqlTable("nova_clients", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  url: varchar("url", { length: 500 }).notNull(),
  platform: mysqlEnum("platform", ["wordpress", "shopify", "generic", "webflow", "wix"]).notNull(),
  apiKey: varchar("api_key", { length: 500 }),
  apiEndpoint: varchar("api_endpoint", { length: 500 }),
  status: mysqlEnum("status", ["active", "disconnected", "error", "pending"]).default("pending").notNull(),
  lastSyncAt: timestamp("last_sync_at"),
  seoScore: int("seo_score").default(0),
  pagesCount: int("pages_count").default(0),
  keywordsCount: int("keywords_count").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull().$onUpdate(() => new Date()),
});

export type Client = typeof clients.$inferSelect;
export type InsertClient = typeof clients.$inferInsert;

// ─── Missions ───
export const missions = mysqlTable("nova_missions", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  query: text("query").notNull(),
  status: mysqlEnum("status", ["draft", "queued", "running", "completed", "failed", "cancelled"]).default("draft").notNull(),
  priority: mysqlEnum("priority", ["low", "medium", "high", "critical"]).default("medium").notNull(),
  clientIds: json("client_ids"),
  plannedTasks: int("planned_tasks").default(0),
  completedTasks: int("completed_tasks").default(0),
  failedTasks: int("failed_tasks").default(0),
  result: json("result"),
  errorMessage: text("error_message"),
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Mission = typeof missions.$inferSelect;
export type InsertMission = typeof missions.$inferInsert;

// ─── SEO Tasks ───
export const seoTasks = mysqlTable("nova_seo_tasks", {
  id: serial("id").primaryKey(),
  missionId: bigint("mission_id", { mode: "number", unsigned: true }),
  clientId: bigint("client_id", { mode: "number", unsigned: true }).notNull(),
  type: mysqlEnum("type", [
    "update_meta", "update_schema_org", "generate_content", "optimize_images",
    "build_sitemap", "submit_sitemap", "check_broken_links", "update_robots_txt",
    "create_redirect", "analyze_keywords", "audit_performance", "custom",
  ]).notNull(),
  status: mysqlEnum("status", ["pending", "queued", "running", "completed", "failed", "cancelled"]).default("pending").notNull(),
  priority: mysqlEnum("priority", ["low", "medium", "high", "critical"]).default("medium").notNull(),
  targetUrl: varchar("target_url", { length: 500 }),
  payload: json("payload"),
  result: json("result"),
  errorMessage: text("error_message"),
  startedAt: timestamp("started_at"),
  userId: varchar('user_id', { length: 36 }).notNull(),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type SeoTask = typeof seoTasks.$inferSelect;
export type InsertSeoTask = typeof seoTasks.$inferInsert;

// ─── Keyword Rankings ───
export const keywordRankings = mysqlTable("nova_keyword_rankings", {
  id: serial("id").primaryKey(),
  clientId: bigint("client_id", { mode: "number", unsigned: true }).notNull(),
  keyword: varchar("keyword", { length: 255 }).notNull(),
  url: varchar("url", { length: 500 }),
  position: int("position"),
  previousPosition: int("previous_position"),
  searchVolume: int("search_volume"),
  cpc: varchar("cpc", { length: 20 }),
  difficulty: int("difficulty"),
  engine: mysqlEnum("engine", ["google", "bing", "chatgpt", "perplexity", "gemini", "claude"]).default("google").notNull(),
  checkedAt: timestamp("checked_at").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type KeywordRanking = typeof keywordRankings.$inferSelect;
export type InsertKeywordRanking = typeof keywordRankings.$inferInsert;

// ─── Pages SEO ───
export const pagesSeo = mysqlTable("nova_pages_seo", {
  id: serial("id").primaryKey(),
  clientId: bigint("client_id", { mode: "number", unsigned: true }).notNull(),
  url: varchar("url", { length: 500 }).notNull(),
  title: varchar("title", { length: 255 }),
  metaDescription: text("meta_description"),
  h1: varchar("h1", { length: 255 }),
  wordCount: int("word_count"),
  schemaType: varchar("schema_type", { length: 100 }),
  schemaData: json("schema_data"),
  score: int("score").default(0),
  status: mysqlEnum("status", ["optimized", "needs_work", "critical", "pending"]).default("pending").notNull(),
  lastOptimizedAt: timestamp("last_optimized_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull().$onUpdate(() => new Date()),
});

export type PageSeo = typeof pagesSeo.$inferSelect;
export type InsertPageSeo = typeof pagesSeo.$inferInsert;

// ─── Backlinks ───
export const backlinks = mysqlTable("nova_backlinks", {
  id: serial("id").primaryKey(),
  clientId: bigint("client_id", { mode: "number", unsigned: true }).notNull(),
  sourceUrl: varchar("source_url", { length: 500 }).notNull(),
  targetUrl: varchar("target_url", { length: 500 }).notNull(),
  anchorText: varchar("anchor_text", { length: 255 }),
  domainAuthority: int("domain_authority"),
  isDoFollow: mysqlEnum("is_do_follow", ["yes", "no"]).default("yes").notNull(),
  status: mysqlEnum("status", ["active", "lost", "pending"]).default("active").notNull(),
  discoveredAt: timestamp("discovered_at").defaultNow().notNull(),
});

export type Backlink = typeof backlinks.$inferSelect;
export type InsertBacklink = typeof backlinks.$inferInsert;
