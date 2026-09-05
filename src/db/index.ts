import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const url = process.env["DATABASE_URL"];
if (!url) {
  console.error("[db] DATABASE_URL is not set — database calls will fail at runtime");
}

export const db = url ? drizzle(neon(url), { schema }) : (null as never);
