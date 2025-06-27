import dns from "dns";
import 'dotenv/config';

dns.setServers(["8.8.8.8", "8.8.4.4"]);

import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle',
  schema: './config/schema.tsx',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
