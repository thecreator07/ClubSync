import { db } from '@/db';
import { users } from '@/db/schema&relation';
import bcrypt from 'bcryptjs';
import { and, eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
export async function POST(req: NextRequest) {
    try {
        const { email, newPassword } = await req.json();

        const [existingVerifiedEmail] = await db
            .select()
            .from(users)
            .where(and(eq(users.email, email), eq(users.verified, 1)))
            .limit(1);

        if (!existingVerifiedEmail) {
            return NextResponse.json(
                { success: false, message: "Email is not verified" },
                { status: 400 }
            );
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const newpasswordUser = await db.update(users).set({
            password: hashedPassword
        }).where(eq(users.email, email))
        if (!newpasswordUser) {
            return NextResponse.json(
                { success: false, message: "password is not updated" },
                { status: 400 }
            );
        }
        return NextResponse.json(
            { success: true, message: 'Password reset successful. You can now sign in with your new password.' },
            { status: 200 }
        );
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { success: false, message: 'Invalid input', errors: error.errors },
                { status: 400 }
            );
        }
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
    }
}