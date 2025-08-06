// app/api/sign-up/route.ts
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { eq, and } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema/users";
import { createInsertSchema } from "drizzle-zod";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import { headers } from "next/headers";

export async function POST(req: Request) {
    try {
        const { firstname, lastname, email, password } = await req.json();
        const host = (await headers()).get('host'); // e.g. "example.com"
        const proto = (await headers()).get('x-forwarded-proto') || 'https';
        const origin = `${proto}://${host}`;
        // Check if verified email already exists
        const [existingVerifiedEmail] = await db
            .select()
            .from(users)
            .where(and(eq(users.email, email), eq(users.verified, 1)))
            .limit(1);

        if (existingVerifiedEmail) {
            return NextResponse.json(
                { success: false, message: "Email is already taken" },
                { status: 400 }
            );
        }

        const [existingUserByEmail] = await db
            .select()
            .from(users)
            .where(eq(users.email, email))
            .limit(1);

        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
        const verifyExpiry = new Date(Date.now() + 3600000); // 1 hour expiry
        const hashedPassword = await bcrypt.hash(password, 10);

        if (existingUserByEmail) {
            if (existingUserByEmail.verified === 1) {
                return NextResponse.json(
                    { success: false, message: "User already exists with this email" },
                    { status: 400 }
                );
            } else {
                // Update unverified user
                await db
                    .update(users)
                    .set({
                        password: hashedPassword,
                        verifyCode: verifyCode,
                        verifyCodeExpiry: verifyExpiry,
                        firstname: firstname || existingUserByEmail.firstname,
                        lastname: lastname || existingUserByEmail.lastname,
                    })
                    .where(eq(users.email, email));
                console.log(verifyCode, "existingUserByEmail");
                const emailResponse = await sendVerificationEmail(email, firstname, verifyCode,origin);
                if (!emailResponse.success) {
                    return NextResponse.json(
                        {
                            success: false,
                            message: emailResponse.message,
                        },
                        { status: 500 }
                    );
                }

                return NextResponse.json(
                    {
                        success: true,
                        message: "User updated. Please verify your account.",
                        data: existingUserByEmail
                    },
                    { status: 200 }
                );

            }
        } else {
            // Insert new unverified user
            const userInsertSchema = createInsertSchema(users);
            const parsedUser = userInsertSchema.parse({
                email,
                password: hashedPassword,
                firstname: firstname || "",
                lastname: lastname || "",
                role: "student",
                verified: 0,
                verifyCode,
                verifyCodeExpiry: verifyExpiry
            });

            console.log(verifyCode)
            const emailResponse = await sendVerificationEmail(email, firstname, verifyCode,origin);
            if (!emailResponse.success) {
                return NextResponse.json(
                    {
                        success: false,
                        message: emailResponse.message,
                    },
                    { status: 500 }
                );
            }
            const [newUser] = await db.insert(users).values(parsedUser).returning();

            return NextResponse.json(
                {
                    success: true,
                    message: "User registered successfully. Please verify your account.",
                    data: newUser,
                },
                { status: 201 }
            );


        }
    } catch (err) {
        console.error("Error registering user:", err);
        return NextResponse.json(
            { success: false, message: "Error registering user" },
            { status: 500 }
        );
    }
}
