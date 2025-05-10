import { db } from "@/db";
import { clubs, clubSelectSchema } from "@/db/schema";
import { clubImageSelectSchema } from "@/db/schema/images";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function GET() {
  try {
    const allClubs = await db.select().from(clubs);
    const clubsArraySchema = z.array(clubSelectSchema);
    const parsedData = clubsArraySchema.parse(allClubs)
    console.log(parsedData)
    return NextResponse.json({ success: true, data: parsedData });
  } catch (err) {
    console.error("GET /api/clubs error:", err);
    return NextResponse.json({ success: false, message: "Failed to fetch clubs" }, { status: 500 });
  }
}
