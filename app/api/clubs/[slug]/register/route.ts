import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/option';
import { db } from '@/db';
import { clubs, members } from '@/db/schema';
import { and, eq, or } from 'drizzle-orm';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!session || !user) {
    return NextResponse.json(
      { success: false, message: 'Not authenticated' },
      { status: 401 }
    );
  }

  const userId = Number(user.id);

  try {
    const [club] = await db.select().from(clubs).where(eq(clubs.slug, slug)).limit(1);

    if (!club) {
      return NextResponse.json(
        { success: false, message: 'Club not found' },
        { status: 404 }
      );
    }

    const clubId = club.id;


    const [ispresident] = await db.select({ clubrole: members.role, clubname: clubs.name }).from(members).innerJoin(clubs, eq(members.clubId, clubs.id)).where(and(eq(members.userId, userId), or(eq(members.role, 'president'), eq(members.role, 'secretary'), eq(members.role, 'treasurer')))).limit(1)

    if (ispresident) {
      return NextResponse.json(
        { success: false, message: `You are already a president of ${ispresident.clubname}` },
        { status: 409 }
      );
    }


    const [existingMember] = await db
      .select()
      .from(members)
      .where(and(eq(members.userId, userId), eq(members.clubId, clubId)))
      .limit(1);

    if (existingMember) {
      return NextResponse.json(
        { success: false, message: 'Already a member' },
        { status: 409 }
      );

    }


    // Counting total clubs that user has joined
    const currentClubs = await db
      .select()
      .from(members)
      .where(eq(members.userId, userId));

    if (currentClubs.length >= 3) {
      return NextResponse.json(
        { success: false, message: 'You can only join up to 3 clubs' },
        { status: 403 }
      );
    }

    // Insert new membership
    await db.insert(members).values({
      userId,
      clubId,
      role: 'member',
    });

    return NextResponse.json(
      { success: true, message: 'Successfully joined the club' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error joining club:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to join club' },
      { status: 500 }
    );
  }
}
