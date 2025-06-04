"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { CldImage } from "next-cloudinary";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import DeleteClubImageButton from "@/components/DeleteImageButton";
import { FileUpload } from "@/components/ui/file-upload";
import { useGetEventImagesQuery } from "@/services/api/events";
// import { useGetEventImagesQuery } from "@/lib/eventsApi";

interface EventImage {
  public_id: string;
  imageUrl: string;
  imageType: string;
}

const ImageTypes = {
  banner: { width: 1200, height: 675, aspectRatio: "16:9" },
  thumbnail: { width: 300, height: 300, aspectRatio: "1:1" },
  gallery: { width: 800, height: 600, aspectRatio: "4:3" },
} as const;

type ImageType = keyof typeof ImageTypes;

const imageTypes = Object.keys(ImageTypes) as ImageType[];

export default function EventGallery() {
  const { id } = useParams();
  console.log(id);
  const [images, setImages] = useState<EventImage[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [imageType, setImageType] =
    useState<(typeof imageTypes)[number]>("banner");

  const { data, refetch } = useGetEventImagesQuery(id as string, {});
  // console.log(data, "data from event images query");
  
  useEffect(() => {
    if (data) {
      setImages(data);
    } else {
      refetch();
    }
  }, [data, refetch, images]);

  // const fetchImages = refetch;

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("imageType", imageType);
      formData.append("id", id as string);

      const res = await fetch("/api/file-update/event", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error("Upload failed", { description: data?.message });
        return;
      }

      toast.success("Image uploaded", { description: data?.message });
      setFile(null);
      refetch();
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Something went wrong";
      toast.error("Unexpected error", {
        description: errorMessage,
      });
    } finally {
      setUploading(false);
    }
  };
  const handleFileUpload = (files: File[]) => {
    setFile(files[0]);
    console.log(files);
  };
  return (
    <div className="space-y-8 max-w-5xl mx-auto p-4">
      <div className="flex flex-col justify-center items-center gap-4">
        <FileUpload onChange={handleFileUpload} />
        <div className="flex justify-between w-full">
          <Select
            value={imageType}
            onValueChange={(v) =>
              setImageType(v as (typeof imageTypes)[number])
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Type" />
            </SelectTrigger>
            <SelectContent>
              {imageTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleUpload} disabled={uploading || !file}>
            {uploading ? "Uploading..." : "Upload"}
          </Button>
        </div>
      </div>
      <div className="columns-2 md:columns-3 gap-4 space-y-4">
        {images.map((img) => (
          <div
            key={img.public_id}
            className="break-inside-avoid relative group"
          >
            <CldImage
              width={ImageTypes[img.imageType as ImageType].width}
              height={ImageTypes[img.imageType as ImageType].height}
              src={img.public_id}
              alt={`${img.imageType} image`}
              crop="fill"
              gravity="auto"
              className="w-full h-auto rounded shadow object-cover"
            />
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition">
              <DeleteClubImageButton
                publicId={img.public_id}
                onDelete={refetch}
                type="event"
              />
            </div>
            <div className="absolute bottom-2 left-2 text-white text-xs bg-black/50 px-2 py-0.5 rounded">
              {img.imageType}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
