import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/option';
import { db } from '@/db';
import { eventInsertSchema, events, members } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

interface EventRequestBody {
    clubId: string;
    name: string;
    description: string;
    eventDate: string | Date;
    startTime: string | Date;
    endTime: string | Date;
    eventImage: string;
    location: string;
    registrationLink: string;
}

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    const user = session?.user;
console.log(user)
    if (!session || !user) {
        return NextResponse.json(
            { success: false, message: 'Not authenticated' },
            { status: 401 }
        );
    }

    try {
        const body: EventRequestBody = await req.json();

        // Destructure the body
        const {
            clubId,
            name,
            description,
            eventDate,
            startTime,
            endTime,
            location,
            registrationLink,
        } = body;

        const userId = Number(user.id);
        const clubIdNum = Number(clubId);

        //  Check if user is an president of the club
        const [membership] = await db
            .select()
            .from(members)
            .where(
                and(
                    eq(members.userId, userId),
                    eq(members.clubId, clubIdNum),
                    eq(members.role, 'president')
                )
            )
            .limit(1);
// console.log(object)
        if (!membership||user.clubRole!=='president') {
            return NextResponse.json(
                { success: false, message: 'Only president can create events' },
                { status: 403 }
            );
        }

        // Convert startTime and endTime to strings if they are Date objects
        const parsedBody = {
            clubId: clubIdNum,
            name,
            description,
            eventDate: typeof eventDate === 'string' ? eventDate : eventDate?.toISOString(),
            startTime: typeof startTime === 'string' ? new Date(startTime) : startTime,
            endTime: typeof endTime === 'string' ? new Date(endTime) : endTime,
          
            location,
            registrationLink
        };

        // Validate the event data using Zod
        const parsedData = eventInsertSchema.parse(parsedBody);

        // ✅ User is admin, create event
        const newEvent = await db.insert(events).values(parsedData).returning();
        console.log("Event created successfully:", newEvent);

        return NextResponse.json(
            { success: true, message: 'Event created successfully', data: newEvent[0] },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error creating event:', error);

        // Enhance error handling with more detailed responses if needed
        if (error instanceof Error) {
            return NextResponse.json(
                { success: false, message: `Failed to create event: ${error.message}` },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { success: false, message: 'Failed to create event' },
            { status: 500 }
        );
    }
}
