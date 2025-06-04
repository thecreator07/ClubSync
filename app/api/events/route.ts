import { db } from "@/db";
import { eventImages, eventRegistrations, events,  } from "@/db/schema&relation";
import { eventselectArraySchema } from "@/lib/validation/EventSchema";
import { eq } from "drizzle-orm";
// import { events, eventSelectSchema } from "@/db/schema";
import { NextResponse } from "next/server";


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
export async function DELETE(request: Request) {
    try {
        const { id } = await request.json();
        if (!id) {
            return NextResponse.json({ success: false, message: "Event ID is required" }, { status: 400 });
        }
        await db.delete(eventRegistrations).where(eq(eventRegistrations.eventId, Number(id)));
        await db.delete(eventImages).where(eq(eventImages.eventId, Number(id)));
        const deleted = await db
            .delete(events)
            .where(eq(events.id, Number(id)))
            .returning();
        if (deleted.length === 0) {
            return NextResponse.json({ success: false, message: "Event not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Event deleted successfully" });
    } catch (err) {
        console.error("DELETE /api/events error:", err);
        return NextResponse.json({ success: false, message: "Failed to delete event" }, { status: 500 });
    }
}
