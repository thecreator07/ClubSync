import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/option';
import { db } from '@/db';
import { eventRegistrations } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export async function POST(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const session = await getServerSession(authOptions);
    const user = session?.user;

    if (!session || !user) {
        return NextResponse.json(
            { success: false, message: 'Not authenticated' },
            { status: 401 }
        );
    }

    const userId = Number(user.id);
    const id = Number(params.id);

    if (isNaN(id)) {
        return NextResponse.json(
            { success: false, message: 'Invalid event ID' },
            { status: 400 }
        );
    }

    try {
        // Check if already registered
        const existing = await db
            .select()
            .from(eventRegistrations)
            .where(
                and(
                    eq(eventRegistrations.userId, userId),
                    eq(eventRegistrations.eventId, id)
                )
            )
            .limit(1);

        if (existing.length > 0) {
            return NextResponse.json(
                { success: false, message: 'Already registered for this event' },
                { status: 409 }
            );
        }

        // Insert new registration
        await db.insert(eventRegistrations).values({
            userId,
            eventId: id,
        });

        return NextResponse.json(
            { success: true, message: 'Successfully registered for the event' },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error registering for event:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to register for the event' },
            { status: 500 }
        );
    }
}
