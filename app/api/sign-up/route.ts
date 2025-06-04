// app/api/sign-up/route.ts
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
// import { db } from "@/db/client";
import { users } from "@/db/schema/users";
import { eq} from "drizzle-orm";
import { db } from "@/db";
import { createInsertSchema } from 'drizzle-zod'
// POST /api/sign-up
export async function POST(req: Request) {
    try {
        const { email, password, firstname, lastname } = await req.json();

        // 1) check if username is already taken by a verified user
        const [taken] = await db
            .select()
            .from(users)
            .where(
                eq(users.email, email),
            )
            .limit(1);

        if (taken) {
            return NextResponse.json(
                { success: false, message: "This Email is already Exist" },
                { status: 400 }
            );
        }

        const hashed = await bcrypt.hash(password, 10);
        const userInsertschema = createInsertSchema(users)
        const parsedData: { email: string, password: string } = userInsertschema.parse({ email, password: hashed,firstname, lastname })
        const res = await db.insert(users).values(parsedData).returning();

        return NextResponse.json(
            {
                success: true,
                message: "User registered successfully",
                data: res[0]
            },
            { status: 201 }
        );

    } catch (err) {
        console.error("Sign-up error:", err);
        return NextResponse.json(
            { success: false, message: "Error registering user" },
            { status: 500 }
        );
    }
}
