import { v2 as cloudinary } from "cloudinary";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/option";
import { db } from "@/db";
import { users } from "@/db/schema";
import { and, eq } from "drizzle-orm";
// Cloudinary configuration
cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});


interface CloudinaryUploadResponse {
    public_id: string;
    [key: string]: unknown;
}


export async function PUT(req: NextRequest,) {

    if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
        return NextResponse.json({ success: false, message: "Cloudinary configuration is missing" }, { status: 500 });
    }

    const session = await getServerSession(authOptions)

    const sessionUser = session?.user
    if (!sessionUser) {
        return NextResponse.json("Unauthorized", { status: 401 });
    }

    try {
        const formData = await req.formData()
        const file = formData.get('avatar') as File | null

        if (!file) {
            return NextResponse.json({ success: false, message: "No File Provided" }, { status: 400 })
        }

        const user = await db.query.users.findFirst({
            where: (users, { eq }) => (eq(users.id, session?.user?.id))
        })

        if (!user) {
            return NextResponse.json({ success: false, message: "User Not Found" }, { status: 404 })
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const userAvatar = user?.avatar

        if (userAvatar) {

            const result = await cloudinary.uploader.destroy(userAvatar, { resource_type: 'image' })

            if (result.result !== "ok") {
                return NextResponse.json({ success: false, message: "Failed to delete image" }, { status: 500 });
            }


            if (result.result === "ok") {
                const result = await new Promise<CloudinaryUploadResponse>((resolve, reject) => {
                    const uploadStream = cloudinary.uploader.upload_stream(
                        { folder: `Avatar/${session?.user?.id}`, resource_type: "auto" },
                        (error, result) => {
                            if (error) {
                                reject(error);
                            } else {
                                resolve(result as CloudinaryUploadResponse);
                            }
                        }
                    )

                    uploadStream.end(buffer);
                }
                )

                if (!result) {
                    return NextResponse.json({ success: false, message: "Failed to upload image" }, { status: 500 });
                }

                const updatedUser = await db.update(users)
                    .set({ avatar: result.public_id as string })
                    .where(eq(users.id, Number(session?.user?.id)))
                    .returning();

                if (updatedUser) {
                    return NextResponse.json({ success: true, message: "image uploaded successfully" })
                }

            }

        }

        const result = await new Promise<CloudinaryUploadResponse>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                { folder: `Avatar/${session?.user?.id}`, resource_type: "auto" },
                (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result as CloudinaryUploadResponse);
                    }
                }
            )

            uploadStream.end(buffer);
        }
        )

        if (!result) {
            return NextResponse.json({ success: false, message: "Failed to upload image" }, { status: 500 });
        }

        const newAvatar = await db.update(users)
            .set({ avatar: result.public_id })
            .where(eq(users.id, Number(session?.user?.id)))
            .returning();

        if (!newAvatar) {
            return NextResponse.json({ success: false, message: "Image updation Failed" }, { status: 400 })
        }

        return NextResponse.json({ success: true, message: "image uploaded successfully" }, { status: 200 })


    } catch (error: unknown) {
        console.error(error);
        return NextResponse.json(
            { success: false, message: (error as Error).message || 'Unknown error' },
            { status: 500 }
        );
    }

}