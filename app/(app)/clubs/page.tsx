

// app/clubs/page.tsx or any other client component
"use client";

import { useClubs } from "@/hooks/useClubs";
import { useRouter } from "next/navigation";
export default function ClubsPage() {
  const { clubs, loading, error } = useClubs();
const router = useRouter();
  if (loading) return <p>Loading clubs...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;
// const format=keyof typeof clubs[0]
  return (
    <div className="max-w-xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Clubs</h1>
      <ul className="space-y-2">
        {clubs?.map((club) => (
          <li onClick={()=> router.push(`/clubs/${club.slug}`)}
            key={club.id}
            className="p-4 border rounded-md bg-white dark:bg-gray-800 shadow"
          >
            <h2 className="text-lg font-semibold">{club.name}</h2>
            {/* add more fields if needed */}
          </li>
        ))}
      </ul>
    </div>
  );
}
