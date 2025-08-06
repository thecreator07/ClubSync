// app/api/profile/[userId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db"; 
import { users } from "@/db/schema/users"; 
import { eq } from "drizzle-orm"; 
import { userSelectSchema, userUpdateSchema } from "@/db/schema/users"; // Importing the Zod schemas for validation

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/option";
import { clubs, eventRegistrations, events, members } from "@/db/schema&relation";

export async function GET(req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
       const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json(
                { success: false, message: "User not authenticated" },
                { status: 401 }
            );
        }

          if (session.user.id !== id && session.user.role !== "admin") {
            return NextResponse.json(
                { success: false, message: "Unauthorized access" },
                { status: 403 }
            );
        }

        const [user] = await db
            .select()
            .from(users)
            .where(eq(users.id, Number(id)))
            .limit(1);
        const clubsdata = await db.select({ clubId: clubs.id, clubrole: members.role, clubname: clubs.name, clubslug: clubs.slug }).from(members).innerJoin(clubs, eq(members.clubId, clubs.id)).where(eq(members.userId, user.id))
        console.log(clubsdata, "useclubsjoined")
        if (!user) {
            return NextResponse.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }

        const eventsData = await db.select({ eventId: events.id, eventName: events.name, eventDate: events.eventDate }).from(eventRegistrations).innerJoin(events, eq(eventRegistrations.eventId, events.id)).where(eq(eventRegistrations.userId, Number(id)))
        console.log(eventsData, "eventsData")
        const parsedUserData = userSelectSchema.parse(user);
        const alldata = {
            parsedUserData, clubsdata, eventsData
        }
        return NextResponse.json({ success: true, data: alldata }, { status: 200 });
    } catch (err) {
        console.error("Error fetching profile:", err);
        return NextResponse.json(
            { success: false, message: "Error fetching user profile" },
            { status: 500 }
        );
    }
}

// Update user profile data based on dynamic userId
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params; 
        console.log(id, "userid")
        const session = await getServerSession(authOptions)
        console.log(session?.user?.id, "session")
        if (!session?.user?.id) {
            return NextResponse.json(
                { success: false, message: "User not authenticated" },
                { status: 401 }
            );
        }

         if (session.user.id !== id) {
            return NextResponse.json(
                { success: false, message: "Unauthorized access" },
                { status: 403 }
            );
        }

         const { firstname, lastname, phone, department, year, semester,aoi } = await req.json();
        console.log(firstname, lastname, phone, department, year, semester)
         const profileUpdateData = {
            firstname,
            lastname,
            phone,
            aoi,
            department,
            year: Number(year),
            semester: Number(semester),
            role: session.user.role
        };

          const parsedData = userUpdateSchema.parse(profileUpdateData);

           const updatedUser = await db
            .update(users)
            .set(parsedData)
            .where(eq(users.id, Number(id)))
            .returning();

        if (!updatedUser) {
            return NextResponse.json(
                { success: false, message: "Error updating user profile" },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { success: true, message: "Profile updated successfully", data: updatedUser[0] },
            { status: 200 }
        );
    } catch (err) {
        console.error("Error updating profile:", err);
        return NextResponse.json(
            { success: false, message: "Error updating user profile" },
            { status: 500 }
        );
    }
}
