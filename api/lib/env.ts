import "dotenv/config";

function required(name: string): string {
  const value = process.env[name];
  if (!value && process.env.NODE_ENV === "production") {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value ?? "";
}

export const env = {
  appId: process.env.APP_ID || '',
  appSecret: process.env.APP_SECRET || '',
  isProduction: process.env.NODE_ENV === 'production',
  databaseUrl: process.env.DATABASE_URL || '',
  
  // Ajoutez ces propriétés manquantes
  kimiAuthUrl: process.env.KIMI_AUTH_URL || 'https://api.kimi.com/auth',
  kimiOpenUrl: process.env.KIMI_OPEN_URL || 'https://api.kimi.com/open',
  ownerUnionId: process.env.OWNER_UNION_ID || '',
};
