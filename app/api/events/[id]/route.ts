import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { clubs, clubSelectSchema, eventRegistrations, events, eventSelectSchema } from "@/db/schema";
import { eventImages } from "@/db/schema/images";
import { z } from "zod";

export type CLubData = z.infer<typeof clubSelectSchema>
export type EventData = z.infer<typeof eventSelectSchema>
// This route fetches an event by slug
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {

    const [event] = await db.select().from(events).where(eq(events.id, Number(id))).limit(1)
    if (!event) {
      return NextResponse.json({ success: false, message: "Event not found" }, { status: 400 })
    }

    const [eventAssociatedClub, eventsImageList, eventRegisterList] = await Promise.all([

      db.select().from(clubs).where(eq(clubs.id, event.clubId)).limit(1),

      db.select().from(eventImages).where(eq(eventImages.eventId, event.id)),

      db.query.eventRegistrations.findMany({
        where: eq(eventRegistrations.eventId, Number(id)),
        with: {
          user: {
            columns: {
              id: true,
              firstname: true,
              avatar: true
            }
          }
        }
      })

    ])


    // const eventDetails = await db.query.events.findFirst({
    //   where: eq(events.id, Number(id)),
    //   with: {
    //     organizingClub: true,
    //     registrations: {
    //       with: {
    //         user: { // Fetch the user details for each registration
    //           columns: { // Specify which user columns to avoid over-fetching password etc.
    //             id: true,
    //             firstname: true,
    //             email: true
    //           }
    //         }
    //       }
    //     },
    //     eventImagesList: true
    //   }
    // });
    console.log(event, eventAssociatedClub[0], eventsImageList, eventRegisterList)











    return NextResponse.json({ success: true, event, eventAssociatedClub, eventsImageList, eventRegisterList }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Error fetching event" }, { status: 500 });
  }
}