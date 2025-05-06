// app/api/admin/members/route.ts
import { db } from "@/db";
import { clubs, members, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const data = await db
    .select({
      id: members.id,
      userId: members.userId,
      clubId: members.clubId,
      role: members.role,
      user: {
        firstname: users.firstname,
        lastname: users.lastname,
        email: users.email,
      },
      club: {
        name: clubs.name,
      },
    })
    .from(members)
    .innerJoin(users, eq(members.userId, users.id))
    .innerJoin(clubs, eq(members.clubId, clubs.id));

  return NextResponse.json(data);
}



export async function PATCH(req: NextRequest) {
    const { memberId, newRole } = await req.json();
  
    await db
      .update(members)
      .set({ role: newRole })
      .where(eq(members.id, memberId));
  
    return NextResponse.json({ success: true });
  }