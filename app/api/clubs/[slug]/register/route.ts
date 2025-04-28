// app/api/clubs/[slug]/register/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/option';
import { db } from '@/db';
import { clubs, members } from '@/db/schema';
import { and, eq } from 'drizzle-orm';

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
    // Rest of the code remains the same
    const [club] = await db.select().from(clubs).where(eq(clubs.slug, slug)).limit(1);

    if (!club) {
      return NextResponse.json(
        { success: false, message: 'Club not found' },
        { status: 404 }
      );
    }

    const clubId = club.id;

    const existingMember = await db
      .select()
      .from(members)
      .where(and(eq(members.userId, userId), eq(members.clubId, clubId)))
      .limit(1);

    if (existingMember.length > 0) {
      return NextResponse.json(
        { success: false, message: 'Already a member' },
        { status: 409 }
      );
    }

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