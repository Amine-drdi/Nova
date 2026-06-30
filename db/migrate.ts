import "dotenv/config";
import { createConnection } from "mysql2/promise";

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL missing");

  const conn = await createConnection(url);

  const tables = [
    `CREATE TABLE IF NOT EXISTS nova_users (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      unionId VARCHAR(255) NOT NULL UNIQUE,
      name VARCHAR(255),
      email VARCHAR(320),
      avatar TEXT,
      role ENUM('user','admin') DEFAULT 'user' NOT NULL,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
      lastSignInAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS nova_clients (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      url VARCHAR(500) NOT NULL,
      platform ENUM('wordpress','shopify','generic','webflow','wix') NOT NULL,
      api_key VARCHAR(500),
      api_endpoint VARCHAR(500),
      status ENUM('active','disconnected','error','pending') DEFAULT 'pending' NOT NULL,
      last_sync_at TIMESTAMP,
      seo_score INT DEFAULT 0,
      pages_count INT DEFAULT 0,
      keywords_count INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS nova_missions (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      query TEXT NOT NULL,
      status ENUM('draft','queued','running','completed','failed','cancelled') DEFAULT 'draft' NOT NULL,
      priority ENUM('low','medium','high','critical') DEFAULT 'medium' NOT NULL,
      client_ids JSON,
      planned_tasks INT DEFAULT 0,
      completed_tasks INT DEFAULT 0,
      failed_tasks INT DEFAULT 0,
      result JSON,
      error_message TEXT,
      started_at TIMESTAMP,
      completed_at TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS nova_seo_tasks (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      mission_id BIGINT UNSIGNED,
      client_id BIGINT UNSIGNED NOT NULL,
      type ENUM('update_meta','update_schema_org','generate_content','optimize_images','build_sitemap','submit_sitemap','check_broken_links','update_robots_txt','create_redirect','analyze_keywords','audit_performance','custom') NOT NULL,
      status ENUM('pending','queued','running','completed','failed','cancelled') DEFAULT 'pending' NOT NULL,
      priority ENUM('low','medium','high','critical') DEFAULT 'medium' NOT NULL,
      target_url VARCHAR(500),
      payload JSON,
      result JSON,
      error_message TEXT,
      started_at TIMESTAMP,
      completed_at TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS nova_keyword_rankings (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      client_id BIGINT UNSIGNED NOT NULL,
      keyword VARCHAR(255) NOT NULL,
      url VARCHAR(500),
      position INT,
      previous_position INT,
      search_volume INT,
      cpc VARCHAR(20),
      difficulty INT,
      engine ENUM('google','bing','chatgpt','perplexity','gemini','claude') DEFAULT 'google' NOT NULL,
      checked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS nova_pages_seo (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      client_id BIGINT UNSIGNED NOT NULL,
      url VARCHAR(500) NOT NULL,
      title VARCHAR(255),
      meta_description TEXT,
      h1 VARCHAR(255),
      word_count INT,
      schema_type VARCHAR(100),
      schema_data JSON,
      score INT DEFAULT 0,
      status ENUM('optimized','needs_work','critical','pending') DEFAULT 'pending' NOT NULL,
      last_optimized_at TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS nova_backlinks (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      client_id BIGINT UNSIGNED NOT NULL,
      source_url VARCHAR(500) NOT NULL,
      target_url VARCHAR(500) NOT NULL,
      anchor_text VARCHAR(255),
      domain_authority INT,
      is_do_follow ENUM('yes','no') DEFAULT 'yes' NOT NULL,
      status ENUM('active','lost','pending') DEFAULT 'active' NOT NULL,
      discovered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
    )`,
  ];

  for (const sql of tables) {
    await conn.execute(sql);
  }

  console.log("All tables created successfully!");
  await conn.end();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
