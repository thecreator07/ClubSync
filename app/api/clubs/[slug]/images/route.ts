// app/api/club/[slug]/images/route.ts
import { db } from "@/db";
import { clubs } from "@/db/schema";
import { clubImages } from "@/db/schema/images";
import { eq } from "drizzle-orm";
// import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    const data = await db
        .select({
            imageUrl: clubImages.imageUrl,
            public_id: clubImages.public_id,
            imageType: clubImages.imageType,
        })
        .from(clubImages)
        .innerJoin(clubs, eq(clubs.id, clubImages.clubId))
        .where(eq(clubs.slug, slug));

    return NextResponse.json(data);
}
