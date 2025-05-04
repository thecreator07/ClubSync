"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { CldImage } from "next-cloudinary";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import DeleteClubImageButton from "@/components/DeleteImageButton";

interface EventImage {
  public_id: string;
  imageUrl: string;
  imageType: string;
}

const imageTypes = ["banner", "thumbnail", "gallery"] as const;

export default function EventGallery() {
  const { id } = useParams();
  console.log(id);
  const [images, setImages] = useState<EventImage[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [imageType, setImageType] =
    useState<(typeof imageTypes)[number]>("banner");

  const fetchImages = async () => {
    try {
      const res = await fetch(`/api/events/${id}/images`);
      const data = await res.json();
      setImages(data);
    } catch (err) {
      console.error("Failed to fetch images", err);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

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
      fetchImages();
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

  return (
    <div className="space-y-8 max-w-5xl mx-auto p-4">
      <div className="flex flex-col md:flex-row items-center gap-4">
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="w-full md:max-w-sm"
        />
        <Select
          value={imageType}
          onValueChange={(v) => setImageType(v as (typeof imageTypes)[number])}
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

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((img) => (
          <div
            key={img.public_id}
            className="relative group rounded-lg overflow-hidden shadow border"
          >
            <CldImage
              width={1200}
              height={675}
              src={img.public_id}
              alt={`${img.imageType} image`}
              crop="fill"
              gravity="auto"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition">
              <DeleteClubImageButton
                publicId={img.public_id}
                onDelete={fetchImages}
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
