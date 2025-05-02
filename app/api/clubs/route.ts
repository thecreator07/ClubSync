import { db } from "@/db";
import { clubs } from "@/db/schema";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const allClubs = await db.select().from(clubs);
    return NextResponse.json({ success: true, data: allClubs });
  } catch (err) {
    console.error("GET /api/clubs error:", err);
    return NextResponse.json({ success: false, message: "Failed to fetch clubs" }, { status: 500 });
  }
}
