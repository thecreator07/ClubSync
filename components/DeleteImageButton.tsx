"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";

interface DeleteClubImageButtonProps {
  publicId: string;
  onDelete?: () => void; // optional callback to update UI
  type?: "club" | "event"; // 
}

export default function DeleteClubImageButton({ publicId, onDelete,type }: DeleteClubImageButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    const confirmed = confirm("Are you sure you want to delete this image?");
    if (!confirmed) return;

    setLoading(true);
    setError("");

    try {
      console.log(type, 'type')
      const res = await fetch(`/api/file-update/${type}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ public_id: publicId }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to delete image");
      } else {
        onDelete?.();
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleDelete}
        disabled={loading}
        className="p-1.5 rounded-lg bg-red-500 hover:bg-red-600 text-white transition disabled:opacity-50"
      >
        <Trash2 className="w-4 h-4" />
      </button>
      {error && <span className="text-red-500 text-sm">{error}</span>}
    </div>
  );
}
