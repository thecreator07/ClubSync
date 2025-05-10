// app/api/profile/[userId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db"; // Import the database client
import { users } from "@/db/schema/users"; // Importing the users schema
import { eq } from "drizzle-orm"; // For query filtering
// Importing your NextAuth auth options
// import { getSession } from "next-auth/react"; // For session management
import { userSelectSchema, userUpdateSchema } from "@/db/schema/users"; // Importing the Zod schemas for validation
// import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/option";
import { z } from "zod";
import { clubs, eventRegistrations, events, members } from "@/db/schema";

// Fetch user profile data based on dynamic userId
export async function GET(req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        // Extract the userId from the dynamic route params

        // Get the session data from NextAuth (checks if the user is authenticated)
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json(
                { success: false, message: "User not authenticated" },
                { status: 401 }
            );
        }

        // Check if the userId from params matches the session userId or if the user is an admin
        if (session.user.id !== id && session.user.role !== "admin") {
            return NextResponse.json(
                { success: false, message: "Unauthorized access" },
                { status: 403 }
            );
        }

        // Fetch the user profile data from the database using userId from the dynamic route
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
        // Validate the user data using Zod schema
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
        const { id } = await params; // Extract the userId from the dynamic route params
        console.log(id, "userid")
        // Get the session data from NextAuth (checks if the user is authenticated)
        const session = await getServerSession(authOptions)
        console.log(session?.user?.id, "session")
        if (!session?.user?.id) {
            return NextResponse.json(
                { success: false, message: "User not authenticated" },
                { status: 401 }
            );
        }

        // Check if the userId from params matches the session userId or if the user is an admin
        if (session.user.id !== id) {
            return NextResponse.json(
                { success: false, message: "Unauthorized access" },
                { status: 403 }
            );
        }

        // Parse the request body for updated user data (bio, clubs, etc.)
        const { firstname, lastname, phone, department, year, semester,aoi } = await req.json();
        console.log(firstname, lastname, phone, department, year, semester)
        // Validate the incoming data using Zod schema for updates
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

        // Validate and parse the data using the userUpdateSchema
        const parsedData = userUpdateSchema.parse(profileUpdateData);

        // Update user profile in the database
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
