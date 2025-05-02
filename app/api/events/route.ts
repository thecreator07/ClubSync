import { db } from "@/db";
import { events } from "@/db/schema";
import { NextResponse } from "next/server";



export async function GET() {
    try {
        const allEvents = await db.select().from(events);
        return NextResponse.json({ success: true, data: allEvents });
    } catch (err) {
        console.error("GET /api/events error:", err);
        return NextResponse.json({ success: false, message: "Failed to fetch events" }, { status: 500 });
    }
}