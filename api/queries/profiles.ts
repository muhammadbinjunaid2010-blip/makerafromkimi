import { eq } from "drizzle-orm";
import * as schema from "@db/schema";
import { getDb } from "./connection";

export async function findProfileByUserId(userId: number) {
  const rows = await getDb()
    .select()
    .from(schema.profiles)
    .where(eq(schema.profiles.userId, userId))
    .limit(1);
  return rows.at(0) ?? null;
}

export async function upsertProfile(
  userId: number,
  data: Partial<schema.InsertProfile>,
) {
  const existing = await findProfileByUserId(userId);
  if (existing) {
    await getDb()
      .update(schema.profiles)
      .set(data)
      .where(eq(schema.profiles.userId, userId));
    return findProfileByUserId(userId);
  }
  await getDb().insert(schema.profiles).values({
    userId,
    ...data,
  } as schema.InsertProfile);
  return findProfileByUserId(userId);
}

export async function findUserByEmail(email: string) {
  const rows = await getDb()
    .select()
    .from(schema.users)
    .where(eq(schema.users.email, email))
    .limit(1);
  return rows.at(0) ?? null;
}

export async function findUserById(id: number) {
  const rows = await getDb()
    .select()
    .from(schema.users)
    .where(eq(schema.users.id, id))
    .limit(1);
  return rows.at(0) ?? null;
}
