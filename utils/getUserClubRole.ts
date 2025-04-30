import { db } from "@/db";
import { members } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getUserClubRole(userId: number) {
  const [member] = await db
    .select()
    .from(members)
    .where(eq(members.userId, userId))
    .limit(1);

  return member?.role;
}
