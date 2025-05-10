"use client";

import Navbar from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { userSelectSchema } from "@/db/schema";
import {
  userprofileclubSchema,
  userprofileEventSchema,
} from "@/types/UserProfileSchema";
import { Dialog } from "@radix-ui/react-dialog";
import { useSession } from "next-auth/react";
import { CldImage } from "next-cloudinary";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { z } from "zod";

// import Navbar from "@/components/Navbar";
// import Footer from "@/components/Footer";
type UserprofileSchema = z.infer<typeof userSelectSchema>;
type UserClubsSchema = z.infer<typeof userprofileclubSchema>;
type userEventsSchema = z.infer<typeof userprofileEventSchema>;
const ProfilePage = () => {
  const { data: session } = useSession(); // Get user session
  // const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [user, setuser] = useState<UserprofileSchema | null>(null);
  const [clubs, setclubs] = useState<UserClubsSchema[] | null>([]);
  const [events, setevents] = useState<userEventsSchema[] | null>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [file, setfile] = useState<File | null>(null);
  const router = useRouter();

  const fetchUserProfile = async () => {
    try {
      // Replace the API call below with the correct backend endpoint
      const response = await fetch(`/api/users/${session?.user.id}`);
      const data = await response.json();
      if (data.success) {
        // setUserData(data.data);
        console.log("get data", data.data);
        setuser(data?.data.parsedUserData);
        setclubs(data?.data?.clubsdata);
        setevents(data?.data?.eventsData);
        // console.log(session)
      } else {
        console.error("Failed to fetch user profile");
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      fetchUserProfile();
    }
  }, [session]);
  console.log(file);
  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);
    try {
      const formdata = new FormData();

      formdata.append("avatar", file);
      const result = await fetch("/api/file-update/avatar", {
        method: "PUT",
        body: formdata,
      });

      const data = await result.json();
      console.log(data);
      if (!result.ok) {
        toast.error("Upload failed", { description: data?.message });
        return;
      }

      toast.success("Image uploaded", { description: data?.message });
      setfile(null);
      fetchUserProfile();
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Something went wrong";
      toast.error("Unexpected error", {
        description: errorMessage,
      });
    } finally {
      setIsUploading(false);
    }
  };
  if (loading) {
    return <div>Loading...</div>; // Show loading state until the data is fetched
  }

  // if (!userData) {
  //     return <div>No user data found</div>; // In case no data is found
  // }

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <Navbar />

      {/* Big Cover Banner */}
      <div className="relative w-full h-60 bg-blue-600">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="absolute inset-0 flex justify-center items-center">
          <h1 className="text-white text-3xl font-bold">
            {session?.user.name}
          </h1>
        </div>
      </div>

      {/* Profile Section */}
      <div className="container mx-auto p-6">
        {/* Avatar, Name, Email, Edit Profile */}
        <div className="flex items-center space-x-6 bg-white p-6 rounded-lg shadow-md">
          <Dialog >
            <DialogTrigger asChild>
              <div
                className="w-24 h-24 bg-gray-300 rounded-full cursor-pointer overflow-hidden"
                title="Click to change avatar"
              >
                {user?.avatar ? (
                  <CldImage
                    width={96}
                    height={96}
                    src={user.avatar}
                    alt={`${user.firstname || "User"} avatar`}
                    crop="fill"
                    gravity="auto"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500">
                    Upload
                  </div>
                )}
              </div>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Change Avatar</DialogTitle>
                <DialogDescription>
                  Choose a new profile picture and click “Upload”.
                </DialogDescription>
              </DialogHeader>

              <div className="mt-4 space-y-4">
                

                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setfile(e.target.files?.[0] || null)}
                  className="w-full md:max-w-sm"
                />

                <Button
                  onClick={handleUpload}
                  disabled={!file || isUploading}
                  className="w-full"
                >
                  {isUploading ? "Uploading..." : "Upload Avatar"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          {/* Avatar placeholder */}
          <div className="flex flex-col">
            <h2 className="text-2xl font-semibold">
              {session?.user?.name && ""}
            </h2>
            <p className="text-gray-500">{session?.user?.email}</p>
            <button
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md"
              onClick={() => router.push(`/users/${session?.user?.id}/manage`)}
            >
              Edit Profile
            </button>
          </div>
        </div>

        {/* Bio Section */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl text-slate-950 font-semibold">Bio</h3>
          <div className="mt-2 text-gray-700">
            {/* Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque sit
            amet accumsan arcu. */}
            {user ? (
              <p className="text-slate-900">{user.aoi}</p>
            ) : (
              <p className="text-slate-950">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque
                sit amet accumsan arcu.
              </p>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h4 className=" font-semibold">🔥 Points</h4>
            <p className="mt-2 text-gray-700">1500</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h4 className=" text-slate-950 font-semibold">🏆 Events Joined</h4>
            <p className="mt-2 text-gray-700">{events && events.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h4 className=" font-semibold text-slate-950">🎯 Clubs Joined</h4>
            <p className="mt-2 text-gray-700">{clubs && clubs.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h4 className="text-slate-950 font-semibold">🛡️ Role</h4>
            <p className="mt-2 text-gray-700">{session?.user?.role}</p>
          </div>
        </div>

        {/* Joined Clubs Section */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-slate-900 font-semibold">Joined Clubs</h3>
          <ul className="mt-4 space-y-2">
            {clubs &&
              clubs.map((club, i) => {
                return (
                  <li
                    key={i}
                    onClick={() => router.push(`/clubs/${club.clubslug}`)}
                    className="text-gray-700"
                  >
                    {club.clubname}
                  </li>
                );
              })}
          </ul>
        </div>

        {/* Past Events Participated */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-slate-900 font-semibold">
            Past Events Participated
          </h3>
          {events &&
            events.map((event, i) => {
              return (
                <div
                  className="text-slate-900 flex items-center"
                  key={i}
                  onClick={() => router.push(`events/${event.eventsId}`)}
                >
                  <h1 className="">{event.eventName}</h1>&nbsp;-&nbsp;
                  <p className="text-sm">{event.eventDate}</p>
                </div>
              );
            })}
        </div>

        {/* Settings / Manage Profile */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <button
            onClick={() => router.push(`/users/${session?.user?.id}/manage`)}
            className="w-full text-blue-600 font-semibold py-2 border border-blue-600 rounded-md"
          >
            Manage Profile Settings
          </button>
        </div>
      </div>

      {/* <Footer /> */}
    </div>
  );
};

export default ProfilePage;
