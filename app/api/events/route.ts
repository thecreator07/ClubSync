import { db } from "@/db";
import { events, eventSelectSchema } from "@/db/schema";
import { NextResponse } from "next/server";
import { z } from "zod";


export const eventselectArraySchema = z.array(eventSelectSchema)
export async function GET() {
    try {
        const allEvents = await db.select().from(events);
        const EventData = eventselectArraySchema.parse(allEvents)
        console.log(EventData)
        return NextResponse.json({ success: true, data: EventData });
    } catch (err) {
        console.error("GET /api/events error:", err);
        return NextResponse.json({ success: false, message: "Failed to fetch events" }, { status: 500 });
    }
}