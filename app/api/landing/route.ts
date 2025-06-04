import { db } from '@/db';
import { clubs, events } from '@/db/schema&relation';
// import { clubs, events } from '@/db/schema';
import { clubImages, eventImages } from '@/db/schema/images';
import { eq } from 'drizzle-orm';
// import { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';
// import { db } from '@/lib/db'; // Adjust based on your Drizzle or DB setup

export async function GET() {
    try {
        const clubData = await db.select().from(clubs).innerJoin(clubImages, eq(clubs.id, clubImages.clubId)).where(eq(clubImages.imageType, 'thumbnail')).limit(10);
        const eventsData = await db.select().from(events).innerJoin(eventImages, eq(events.id, eventImages.eventId)).where(eq(eventImages.imageType, 'thumbnail')).limit(10);

        console.log(clubData, 'clubData')
        console.log(eventsData, 'eventsData')


        return NextResponse.json({ clubData, eventsData, message: "clubs and events are Fetched", success: true }, { status: 200 });
    } catch (error: unknown) {
        console.error('[landing-data]', error);
        return NextResponse.json({ error: 'Failed to fetch landing data', success: false }, { status: 500 });
    }
}
