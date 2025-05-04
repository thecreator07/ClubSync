import { v2 as cloudinary } from "cloudinary";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/option";
import { clubImages } from "@/db/schema/images";
import { db } from "@/db";
import { eq } from "drizzle-orm";

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

        console.log(file, 'file')
        console.log(slug, 'slug')
        if (!file) {
            return NextResponse.json({ success: false, message: "No file provided" }, { status: 400 });
        }
      
        const club = await db.query.clubs.findFirst({
            where: (clubs, { eq }) => eq(clubs.slug, slug!)
        });

        if (!club) {
            return NextResponse.json({ success: false, message: "Club not found" }, { status: 404 });
        }



        // 1. Check if the 5 images limit is reached
        const clunImagesCount = await db.$count(clubImages, eq(clubImages.clubId, club.id))
        if (clunImagesCount >= 5) {
            return NextResponse.json({ success: false, message: "Image limit reached" }, { status: 400 });
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
            clubId: club.id as number, // Ensure club.id is explicitly cast to the expected type
            public_id: result.public_id as string, // Ensure result.public_id is explicitly cast to string
            imageUrl: result.secure_url as string, // Ensure result.secure_url is explicitly cast to string
        }).returning();
        // {
        //     asset_id: '1c1ea1449b517dcff85fc06e25e46cf0',
        //     public_id: 'club/1/ldtuw4oycuzaxliw4olf',
        //     version: 1746297430,
        //     version_id: '5c8c1e2a9793d42e9c4248035520c7a8',
        //     signature: '974115f9e633bf90d73d5dd20fd154bb934e8558',
        //     width: 1097,
        //     height: 1226,
        //     format: 'jpg',
        //     resource_type: 'image',
        //     created_at: '2025-05-03T18:37:10Z',
        //     tags: [],
        //     bytes: 145527,
        //     type: 'upload',
        //     etag: '10fcc05ef6f1b9b07192c585c8aedc8a',
        //     placeholder: false,
        //     url: 'http://res.cloudinary.com/dpu0tndxq/image/upload/v1746297430/club/1/ldtuw4oycuzaxliw4olf.jpg',
        //     secure_url: 'https://res.cloudinary.com/dpu0tndxq/image/upload/v1746297430/club/1/ldtuw4oycuzaxliw4olf.jpg',
        //     folder: 'club/1',
        //     original_filename: 'file',
        //     api_key: '729538155284454'
        //   } result

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