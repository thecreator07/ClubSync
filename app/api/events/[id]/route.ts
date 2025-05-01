import { NextResponse } from "next/server";
// import { events } from "../../../db/schema"; // Assuming you have your schema here
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { clubs, events } from "@/db/schema";

// This route fetches an event by slug
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const event = await db
      .select().from(events)
      .where(eq(events.id, Number(id))) // Fetch event by id (converted to number)
      .limit(1)
      .execute();
    // console.log(event)
    const associatedClubs = await db.select().from(clubs).where(eq(clubs.id, event[0].clubId)).execute();
    if (!event.length) {
      return NextResponse.json({ succes: false, message: "Event not found" }, { status: 404 });
    }

    const eventDetails = event[0]; // Assuming event data is in the first index
    const clubDetails = associatedClubs[0];
    const club = {
      name: clubDetails.name,
      logoUrl: clubDetails.logoImage,
      description: clubDetails.description,
    };
    const eventWithClub = {
      ...eventDetails,
      club,
    };
    return NextResponse.json({ success: true, data: eventWithClub }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Error fetching event" }, { status: 500 });
  }
}