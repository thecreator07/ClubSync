// app/api/clubs/[slug]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { clubs, members, users, events } from '@/db/schema';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/option';
import {  eq } from 'drizzle-orm';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params;

  try {
    // 1. Fetch club + members + users + events in 2-3 queries

    // Fetch club
    const [club] = await db.select().from(clubs).where(eq(clubs.slug, slug)).limit(1);

    if (!club) {
      return NextResponse.json(
        { success: false, message: 'Club not found' },
        { status: 404 }
      );
    }

    const clubId = club.id;
    const now = new Date();

    // Fetch members (with user data) and events (upcoming + past)
    const [membersList, eventsList] = await Promise.all([
      db
        .select({
          id: users.id,
          email: users.email,
          firstname: users.firstname,
          lastname: users.lastname,
          profilePic: users.avatar,
          role: members.role,
        })
        .from(members)
        .innerJoin(users, eq(members.userId, users.id))
        .where(eq(members.clubId, clubId)),

      db
        .select()
        .from(events)
        .where(eq(events.clubId, clubId))
        .orderBy(events.eventDate)
    ]);

    // Split upcoming and past events
    const upcomingEvents = eventsList.filter(e => new Date(e.eventDate) >= now);
    const pastEvents = eventsList.filter(e => new Date(e.eventDate) < now);

    // Find president
    const president = membersList.find(m => m.role === 'president');

    // 2. Check if user is a member
    const session = await getServerSession(authOptions);
    const user = session?.user;
    let isMember = false;

    if (user) {
      isMember = membersList.some(m => m.id === Number(user.id));
    }

    console.log({ club, president, membersCount: membersList.length, upcomingEvents, pastEvents, isMember });

    return NextResponse.json(
      {
        success: true,
        club,
        president,
        totalMembers: membersList.length,
        upcomingEvents,
        pastEvents,
        members: membersList,
        isMember,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching club details:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch club details' },
      { status: 500 }
    );
  }
}
