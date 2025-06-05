import { db } from "@/db";
import { clubs, } from "@/db/schema&relation";
import { clubImageSelectSchema } from "@/db/schema/images";
import { and, eq, sql } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/option";
import { sendClubCreationEmail } from "@/helpers/sendClubCreationEmail";


export async function GET() {
  try {
    const rawClubs = await db.execute(sql`
      SELECT
        c.id,
        c.name,
        c.slug,
        c.description,
        c.about,
        c.contact_email,
        c.contact_phone,
        c.created_at,
        (SELECT COUNT(*) FROM memberships m WHERE m.club_id = c.id) AS memberCount,
        COALESCE(
          (
            SELECT
              json_agg(
                json_build_object(
                  'id', ci.id,
                  'clubId', ci.club_id,
                  'public_id', ci.public_id,
                  'imageType', ci.image_type,
                  'imageUrl', ci.image_url,
                  'updatedAt', ci.updated_at
                )
              )
            FROM
              club_images ci
            WHERE
              ci.club_id = c.id AND ci.image_type = 'thumbnail'
          ),
          '[]'::json
        ) AS clubImagelist
      FROM
        clubs c;
    `);


    const parsedclubData = rawClubs.rows.map((row) => ({
      id: row.id,
      name: row.name,
      slug: row.slug,
      description: row.description,
      about: row.about,
      contact_email: row.contact_email,
      contact_phone: row.contact_phone,
      created_at: row.created_at,
      memberCount: Number(row.membercount),
      clubImagelist: (row.clubimagelist as Array<typeof clubImageSelectSchema>)[0]
    }));

    console.log(parsedclubData)
    if (!rawClubs.rows || rawClubs.rows.length === 0) {

      return NextResponse.json({ success: false, message: "No clubs found" }, { status: 404 });
    }

    // console.log("Fetched clubs via raw SQL:", rawClubs.rows);
    return NextResponse.json({ success: true, clubs: parsedclubData }, { status: 200 });
  } catch (err) {
    console.error("GET /api/clubs (raw SQL) error:", err);
    return NextResponse.json({ success: false, message: "Failed to fetch clubs via raw SQL" }, { status: 500 });
  }
}



export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 });
  }

  try {
    const {
      name,
      slug,
      description,
      about,
      contactEmail,
      contactPhone,
    } = await req.json();

    if (!name || !slug || !description || !about) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }

    const [byName] = await db
      .select()
      .from(clubs)
      .where(and(eq(clubs.name, name), eq(clubs.slug, slug)))
      .limit(1);

    if (byName) {
      return NextResponse.json({ success: false, message: "Club name or Slug already exists" }, { status: 409 });
    }

    const [newClub] = await db
      .insert(clubs)
      .values({ name, slug, description, about, contactEmail, contactPhone })
      .returning();

    // ✅ Notify Admin via email
    await sendClubCreationEmail(
      session.user.email,
      session.user.name ||'admin',
      name,
      slug
    );

    return NextResponse.json({ success: true, data: newClub }, { status: 201 });

  } catch (err) {
    console.error("POST /api/clubs error:", err);
    return NextResponse.json({ success: false, message: "Failed to create club" }, { status: 500 });
  }
}