// app/api/events/[id]/images/route.ts
import { db } from "@/db";
import { events } from "@/db/schema&relation";
// import { events } from "@/db/schema";
import { eventImages } from "@/db/schema/images";
import { eq } from "drizzle-orm";
// import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    console.log(id, 'id')
    const data = await db
        .select({
            imageUrl: eventImages.imageUrl,
            public_id: eventImages.public_id,
            imageType: eventImages.imageType,
        })
        .from(eventImages)
        .innerJoin(events, eq(events.id, eventImages.eventId))
        .where(eq(events.id, Number(id)));

    return NextResponse.json(data);
}
