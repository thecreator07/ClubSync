"use client";

// import { clubWithImageArray } from "@/app/api/clubs/route";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useGetClubsQuery } from "@/services/api/clubs";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { z } from "zod";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { clubWithImageArray } from "@/lib/validation/ClubSchema";
type ClubWIthImages = z.infer<typeof clubWithImageArray>;
// type ClubImage = z.infer<typeof clubImageSelectSchema>;

export default function ClubsPage() {
  const [clubs, setclubs] = useState<ClubWIthImages | null>(null);
  const [search, setSearch] = useState<string>("");
  const { data: session } = useSession();
  const router = useRouter();
  const { data, isLoading, refetch } = useGetClubsQuery(undefined);

  useEffect(() => {
    if (data) {
      setclubs(data.clubs);
    } else {
      refetch();
    }
  }, [data, refetch]);

  if (isLoading) return <p>Loading clubs...</p>;
 
  console.log(clubs);
  const filteredClubs = clubs?.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase())
  );

  // Handle club deletion
  async function handleDelete(clubId: number) {
    try {
      const res = await fetch("/api/clubs", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: clubId }),
      });
      const result = await res.json();
      if (result.success) {
        setclubs((prev) => prev?.filter((c) => c.id !== clubId) ?? null);
      } else {
        toast.error(result.message || "Failed to delete club.", {
          duration: 3000,
        });
      }
    } catch (err) {
      toast.error("An error occurred while deleting the club.", {
        duration: 3000,
      });
      console.error(err);
    }
  }
  return (
    <div className="p-6">
      {/* Header / Hero */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white p-8 rounded-2xl mb-8 shadow-md">
        <h1 className="text-4xl font-bold">Explore College Clubs</h1>
        <p className="text-md mt-2">
          Discover your passions, attend events, and earn rewards!
        </p>
      </div>

      {/* Search & Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <Input
          placeholder="Search clubs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="sm:max-w-sm"
        />
        {session?.user?.role === "admin" && (
          <Button
            variant="outline"
            onClick={() => router.push("/clubs/create")}
          >
            ➕ Add New Club
          </Button>
        )}
      </div>

      {/* Clubs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClubs && filteredClubs.length > 0 ? (
          filteredClubs.map((club) => {
            // const thumbnail: ClubImage | undefined = club?.clubImagelist;
            // console.log(club?.clubImagelist);

          return (
            <Card
              key={club.id}
              className="h-full flex flex-col justify-between shadow-lg hover:shadow-xl transition-shadow"
            >
              <CardHeader className="pb-2">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    {club.clubImagelist ? (
                      <AvatarImage
                        src={club.clubImagelist.imageUrl}
                        alt={`${club.name} thumbnail`}
                      />
                    ) : (
                      <AvatarFallback>{club.name.charAt(0)}</AvatarFallback>
                    )}
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg font-semibold">
                      {club.name}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {club.createdAt}
                    </p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="flex flex-col justify-between flex-1">
                <div>
                  <p className="mb-2 text-sm text-muted-foreground line-clamp-3">
                    {club.description}
                  </p>
                  <Badge variant="secondary">
                    {club.slug.replace("-", " ")}
                  </Badge>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <Button
                    className="cursor-pointer"
                    size="sm"
                    onClick={() => router.push(`clubs/${club.slug}`)}
                  >
                    View
                  </Button>
                  {session?.user?.role === "admin" ? (
                    <AlertDialog>
                      <AlertDialogTrigger className="h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5 ">
                        Delete
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you absolutely sure?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete {club.name} club and remove all the related
                            Images and connected students.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(club.id)}
                          >
                            Continue
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  ) : (
                    <p>Members: {club.memberCount}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })) : (<p>No clubs found</p>)}
      </div>
    </div>
  );
}
