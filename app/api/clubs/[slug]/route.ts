// app/api/clubs/[slug]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
// import { clubs, members, users, events, clubSelectSchema, eventSelectSchema, userSelectSchema, memberSelectSchema } from '@/db/schema';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/option';
import { eq } from 'drizzle-orm';
import { clubImages } from '@/db/schema/images';
import { z } from 'zod';
import { clubs, clubSelectSchema, events, eventSelectSchema, members,users } from '@/db/schema&relation';


export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    
    const [club] = await db.select().from(clubs).where(eq(clubs.slug, slug)).limit(1);

    if (!club) {
      return NextResponse.json(
        { success: false, message: 'Club not found' },
        { status: 404 }
      );
    }

    const clubId = club.id;
    const now = new Date();

   
    const [membersList, eventsList, imagesList] = await Promise.all([
      db
        .select({
          id: users.id,
          email: users.email,
          firstname: users.firstname,
          lastname: users.lastname,
          avatar: users.avatar,
          role: members.role,
        })
        .from(members)
        .innerJoin(users, eq(members.userId, users.id))
        .where(eq(members.clubId, clubId)),

      db
        .select({
          id: events.id,
          name: events.name,
          description: events.description,
          eventDate: events.eventDate,
          location: events.location
        })
        .from(events)
        .where(eq(events.clubId, clubId))
        .orderBy(events.eventDate),

      db.select({ public_id: clubImages.public_id, imageType: clubImages.imageType, imageUrl: clubImages.imageUrl }).from(clubImages).where(eq(clubImages.clubId, clubId)),
    ])

    const parsedclubData = clubSelectSchema.parse(club)

    const parsedeventsArray = z.array(eventSelectSchema)
    const parsedEventData = parsedeventsArray.parse(eventsList)
    // Split upcoming and past events
    const upcomingEvents = parsedEventData.filter(e => new Date(e.eventDate) >= now);
    const pastEvents = parsedEventData.filter(e => new Date(e.eventDate) < now);

    // Find president
    const president = membersList.find(m => m.role === 'president');

    //split images as hero, logo,thumbnail
    const heroImages = imagesList.filter((image) => image.imageType === 'hero');
    const logoImages = imagesList.filter((image) => image.imageType === 'logo');
    // 2. Check if user is a member
    const session = await getServerSession(authOptions);
    const user = session?.user;
    let isMember = false;

    if (user) {
      isMember = membersList.some(m => m.id === Number(user.id));
    }

    // console.log({ parsedclubData, president, membersCount: membersList.length, upcomingEvents, pastEvents, isMember, logoImages, heroImages,membersField });

    return NextResponse.json(
      {
        success: true,
        parsedclubData,
        president,
        totalMembers: membersList.length,
        upcomingEvents,
        pastEvents,
        members: membersList,
        heroImages: heroImages,
        logoImages: logoImages[0],
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



