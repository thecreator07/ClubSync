"use client";

import { Club } from "@/db/schema";
// import { useClubs } from "@/hooks/useClubs";
import { useGetClubsQuery } from "@/Redux/api";
// import { useGetClubsQuery } from "@/Redux/api/ClubApiSlice";
import { useRouter } from "next/navigation";
export default function ClubsPage() {
  // const { parsedData, loading, error } = useClubs();
  const router = useRouter();
  const {
    data: clubs,
    isLoading,
    isError,
  } = useGetClubsQuery() as {
    data: Club[] | undefined;
    isLoading: boolean;
    isError: boolean;
  };
  console.log(clubs);
  if (isLoading) return <p>Loading clubs…</p>;
  if (isError) return <p className="text-red-500">Failed to load clubs</p>;
  return (
    <div className="max-w-xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Clubs</h1>
      <ul className="space-y-2">
        {clubs?.map((club: Club) => (
          <li
            onClick={() => router.push(`/clubs/${club.slug}`)}
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
