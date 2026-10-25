// db/db.ts
// One shared connection to the database, used by every backend file.
// DATABASE_URL comes from .env.local — Next.js injects env vars into
// backend code automatically; they are never sent to the browser.

import { neon } from "@neondatabase/serverless";

export const sql = neon(process.env.DATABASE_URL!);
