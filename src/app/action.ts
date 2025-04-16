// app/actions.ts
"use server";
import { neon } from "@neondatabase/serverless";

export async function getData() {
  const sql = neon(
    "postgresql://neondb_owner:npg_NkIG0ingP6Zf@ep-summer-scene-a5ejl2zg-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require"
  );
  const data = await sql`...`;
  return data;
}
