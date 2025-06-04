import { v2 as cloudinary } from "cloudinary";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/option";
import { clubImages } from "@/db/schema/images";
import { db } from "@/db";
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


export async function POST(req: NextRequest,) {

    if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
        return NextResponse.json({ success: false, message: "Cloudinary configuration is missing" }, { status: 500 });
    }

    const session = await getServerSession(authOptions)

    const sessionUser = session?.user
    if (!sessionUser) {
        return NextResponse.json("Unauthorized", { status: 401 });
    }



    try {

        const formData = await req.formData();
        const file = formData.get("file") as File | null;
        const slug = formData.get("slug") as string | null;
        const ImageType = formData.get("imageType") as string | null;
        console.log(file, 'file')
        console.log(slug, 'slug')
        console.log(ImageType, 'imageType')
        if (!file) {
            return NextResponse.json({ success: false, message: "No file provided" }, { status: 400 });
        }
      
        if (!file.type.startsWith("image/")) {
            return NextResponse.json({ success: false, message: "File must be an image" }, { status: 400 });
        }
        if (!slug) {
            return NextResponse.json({ success: false, message: "No slug provided" }, { status: 400 });
        }

        const club = await db.query.clubs.findFirst({
            where: (clubs, { eq }) => eq(clubs.slug, slug!)
        });

        if (!club) {
            return NextResponse.json({ success: false, message: "Club not found" }, { status: 404 });
        }



        // 1. Check if the 5 images limit is reached
        const clubImagetypeCount = await db.$count(clubImages, and(eq(clubImages.clubId, club.id), eq(clubImages.imageType, ImageType!)));
        if (!ImageType) {
            return NextResponse.json({ success: false, message: "Image type is missing" }, { status: 400 });
        }

        if (ImageType === 'thumbnail' && clubImagetypeCount >= 1) {
            return NextResponse.json({ success: false, message: `${ImageType} limit reached` }, { status: 400 });
        }

        if (ImageType === 'logo' && clubImagetypeCount >= 1) {
            return NextResponse.json({ success: false, message: `${ImageType} limit reached` }, { status: 400 });
        }
        if (ImageType === 'hero' && clubImagetypeCount >= 5) {
            return NextResponse.json({ success: false, message: `${ImageType} limit reached` }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // 2. Upload image to Cloudinary
        const result = await new Promise<CloudinaryUploadResponse>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                { folder: `club/${slug}`, resource_type: "auto" },
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

        console.log(result, 'result')

        if (!result) {
            return NextResponse.json({ success: false, message: "Failed to upload image" }, { status: 500 });
        }


        // 3. Insert image into club_images table
        const newclubImage = await db.insert(clubImages).values({
            clubId: club.id as number,
            public_id: result.public_id as string,
            imageUrl: result.secure_url as string,
            imageType: ImageType,
        }).returning();

        return NextResponse.json({ success: true, data: newclubImage[0], message: "Uploaded File Successfully", }, { status: 200 });



    } catch (error) {
        console.error("Error uploading file:", error);
        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });


    }
}


export async function DELETE(req: NextRequest) {
    const session = await getServerSession(authOptions)
    const sessionUser = session?.user
    if (!sessionUser) {
        return NextResponse.json("Unauthorized", { status: 401 });
    }

    if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
        return NextResponse.json({ success: false, message: "Cloudinary configuration is missing" }, { status: 500 });
    }

    try {
        const { public_id } = await req.json();
        console.log(public_id, 'public_id')
        if (!public_id) {
            return NextResponse.json({ success: false, message: "No public_id provided" }, { status: 400 });
        }

        // Delete image from Cloudinary
        const result = await cloudinary.uploader.destroy(public_id, { resource_type: "image" });

        if (result.result !== "ok") {
            return NextResponse.json({ success: false, message: "Failed to delete image from Cloudinary" }, { status: 500 });
        }

        // Delete image record from database
        await db.delete(clubImages).where(eq(clubImages.public_id, public_id));

        return NextResponse.json({ success: true, message: "Image deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting image:", error);
        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
}