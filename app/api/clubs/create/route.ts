// app/api/clubs/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/option";
import { clubs, } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";


export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 });
  }
  // const userId = Number(session.user.id);
  console.log(session.user)
  try {
    const {
      name,
      slug,
      description,
      about,
      contactEmail,
      contactPhone,
      
    } = await req.json();

    // Validate required fields
    if (!name || !slug || !description || !about) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }

    // Ensure unique name & slug
    const [byName] = await db
      .select()
      .from(clubs)
      .where(and(eq(clubs.name, name), eq(clubs.slug, slug)))
      .limit(1);



    if (byName) {
      return NextResponse.json({ success: false, message: "Club name or Slug already exists" }, { status: 409 });
    }


    // Create club
    const [newClub] = await db
      .insert(clubs)
      .values({ name, slug, description, about, contactEmail, contactPhone })
      .returning();

    // Make creator the president
    // const memberdata = await db.insert(members).values({
    //   userId,
    //   clubId: newClub.id,
    //   role: "president"
    // });
    // console.log("memberdata", [memberdata])
    return NextResponse.json({ success: true, data: newClub }, { status: 201 });
  } catch (err) {
    console.error("POST /api/clubs error:", err);
    return NextResponse.json({ success: false, message: "Failed to create club" }, { status: 500 });
  }
}
