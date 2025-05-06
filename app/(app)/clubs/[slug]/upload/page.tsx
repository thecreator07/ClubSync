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

interface ClubImage {
  public_id: string;
  imageUrl: string;
  imageType: string;
}

const ImageFormats = {
  logo: { width: 100, height: 100, aspectRatio: "1:1" },
  hero: { width: 1200, height: 675, aspectRatio: "16:9" },
  thumbnail: { width: 300, height: 300, aspectRatio: "1:1" },
};

type ImageFormat = keyof typeof ImageFormats;

export default function ClubGallery() {
  const [images, setImages] = useState<ClubImage[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<ImageFormat>("hero");
  const { slug } = useParams();

  const fetchImages = async () => {
    try {
      const res = await fetch(`/api/clubs/${slug}/images`);
      const data = await res.json();
      setImages(data);
    } catch (err) {
      console.error("Failed to load images", err);
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
      formData.append("slug", slug as string);
      formData.append("imageType", selectedFormat);
      const response = await fetch("/api/file-update/club", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
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
      {/* Upload Form */}
      <div className="flex flex-col md:flex-row justify-center items-center gap-4">
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="w-full md:max-w-sm"
        />

        <Select
          value={selectedFormat}
          onValueChange={(val) => setSelectedFormat(val as ImageFormat)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Format" />
          </SelectTrigger>
          <SelectContent>
            {Object.keys(ImageFormats).map((format) => (
              <SelectItem key={format} value={format}>
                {format}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          onClick={handleUpload}
          disabled={uploading || !file}
          className="w-full md:w-auto"
        >
          {uploading ? "Uploading..." : "Upload"}
        </Button>
      </div>

      {/* Image Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((img) => (
          <div
            key={img.public_id}
            className="relative group rounded-lg overflow-hidden shadow border"
          >
            <CldImage
              width={ImageFormats[selectedFormat].width}
              height={ImageFormats[selectedFormat].height}
              src={img.public_id}
              alt="Club image"
              crop="fill"
              gravity="auto"
              aspectRatio={ImageFormats[selectedFormat].aspectRatio}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition">
              <DeleteClubImageButton
                publicId={img.public_id}
                onDelete={fetchImages}
                type="club"
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
