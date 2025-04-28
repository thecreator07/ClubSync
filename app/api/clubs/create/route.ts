// app/api/clubs/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/option";
import { clubs, members,  } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";

export async function GET() {
  try {
    const allClubs = await db.select().from(clubs);
    return NextResponse.json({ success: true, data: allClubs });
  } catch (err) {
    console.error("GET /api/clubs error:", err);
    return NextResponse.json({ success: false, message: "Failed to fetch clubs" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 });
  }
  const userId = Number(session.user.id);

  try {
    const {
      name,
      slug,
      description,
      about,
      contactEmail,
      contactPhone,
      coverImage,
      logoImage
    } = await req.json();

    // Validate required fields
    if (!name || !slug || !description || !about) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }

    // Ensure unique name & slug
    const [byName] = await db
      .select()
      .from(clubs)
      .where(and(eq(clubs.name, name), eq(clubs.slug,slug)))
      .limit(1);

      

    if (byName) {
      return NextResponse.json({ success: false, message: "Club name or Slug already exists" }, { status: 409 });
    }    


    // Create club
    const [newClub] = await db
      .insert(clubs)
      .values({ name, slug, description, about, contactEmail, contactPhone, coverImage, logoImage })
      .returning();

    // Make creator the president
    await db.insert(members).values({
      userId,
      clubId: newClub.id,
      role: "president"
    });

    return NextResponse.json({ success: true, data: newClub }, { status: 201 });
  } catch (err) {
    console.error("POST /api/clubs error:", err);
    return NextResponse.json({ success: false, message: "Failed to create club" }, { status: 500 });
  }
}
