// app/api/verify-code/route.ts
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema/users";

export async function POST(request: Request) {
  try {
    const { userId, code } = await request.json();

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, Number(userId)))
      .limit(1);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User Not Found",
        },
        { status: 404 }
      );
    }

    const isCodeValid = user.verifyCode === code;
    const isCodeNotExpired =
      user.verifyCodeExpiry && new Date(user.verifyCodeExpiry) > new Date();

    if (isCodeValid && isCodeNotExpired) {
      await db
        .update(users)
        .set({
          verified: 1,
          verifyCode: "", 
        })
        .where(eq(users.id, user.id));

      return NextResponse.json(
        {
          success: true,
          message: "Account Verified successfully",
        },
        { status: 200 }
      );
    } else if (!isCodeNotExpired) {
      return NextResponse.json(
        {
          success: false,
          message: "Verification Code Expired! Signup again",
        },
        { status: 400 }
      );
    } else {
      return NextResponse.json(
        {
          success: false,
          message: "Incorrect Verification Code",
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error Verifying user:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error Verifying user",
      },
      { status: 500 }
    );
  }
}
