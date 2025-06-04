"use client";

import { CldImage } from "next-cloudinary";
// import { useSession } from "next-auth/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

type Club = {
  clubId: number;
  clubrole: string;
  clubname: string;
  clubslug: string;
};
type Event = {
  eventId: number;
  eventName: string;
  eventDate: string;
};
type User = {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  avatar?: string;
  aoi?: string;
  role?: string;
  points?: number;
};

export default function ProfilePage() {
  const router = useRouter();
  const params = useParams();
  // const { data: session } = useSession();

  const [user, setUser] = useState<User | null>(null);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    async function fetchProfileData() {
      if (!params?.id) return;
      const res = await fetch(`/api/users/${params.id}`);
      const json = await res.json();
      if (json.success) {
        setUser(json.data.parsedUserData);
        setClubs(json.data.clubsdata || []);
        setEvents(json.data.eventsData || []);
      }
    }
    fetchProfileData();
  }, [params?.id]);

  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("avatar", file);

      const res = await fetch("/api/file-update/avatar", {
        method: "PUT",
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        // Refetch user data to update avatar
        const userRes = await fetch(`/api/users/${params.id}`);
        const userJson = await userRes.json();
        if (userJson.success) {
          setUser(userJson.data.parsedUserData);
        }
        setFile(null);
      } else {
        alert(data.message || "Failed to upload avatar");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert("Error uploading avatar");
      }
    } finally {
      setIsUploading(false);
    }
  };

  if (!user) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="bg-gray-50 dark:bg-black min-h-screen pb-20">
      {/* Banner */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative h-64 bg-gradient-to-r from-indigo-500 to-purple-600"
      >
        <div className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-sm" />
        <div className="relative z-10 h-full flex items-center justify-center">
          <h1 className="text-white text-4xl font-bold drop-shadow-lg">
            Welcome, {user.firstname}
          </h1>
        </div>
      </motion.div>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="max-w-6xl mx-auto px-4 -mt-24"
      >
        <div className="bg-white relative dark:bg-gray-900 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-center gap-6">
          {/* Avatar Upload */}
          <Dialog>
            <DialogTrigger asChild>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="cursor-pointer"
              >
                <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-white dark:ring-gray-800 shadow">
                  {user.avatar ? (
                    <CldImage
                      width={128}
                      height={128}
                      src={user.avatar}
                      alt="User Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-700">
                      Upload
                    </div>
                  )}
                </div>
              </motion.div>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Update Profile Picture</DialogTitle>
                <DialogDescription>
                  Choose a new image to upload.
                </DialogDescription>
              </DialogHeader>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
              <Button onClick={handleUpload} disabled={!file || isUploading}>
                {isUploading ? "Uploading..." : "Upload"}
              </Button>
            </DialogContent>
          </Dialog>

          {/* User Info */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {user.firstname} {user.lastname}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
            <Button
              className="mt-3"
              onClick={() => router.push(`/users/${user.id}/manage`)}
            >
              Edit Profile
            </Button>
          </div>
        </div>

        {/* Bio */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-8 bg-white dark:bg-gray-900 p-6 rounded-2xl shadow"
        >
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
            Bio
          </h3>
          <p className="mt-2 text-gray-700 dark:text-gray-300">
            {user.aoi || "No bio added yet."}
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.2 } },
          }}
          className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {[
            { title: "🔥 Points", value: user.points ?? 0 },
            { title: "🏆 Events Joined", value: events.length },
            { title: "🎯 Clubs Joined", value: clubs.length },
            { title: "🛡️ Role", value: user.role },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow text-center hover:shadow-lg transition-shadow"
            >
              <h4 className="text-md font-semibold text-gray-700 dark:text-gray-300">
                {item.title}
              </h4>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {item.value}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Clubs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-10 bg-white dark:bg-gray-900 p-6 rounded-2xl shadow"
        >
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
            Joined Clubs
          </h3>
          <div className="flex flex-wrap gap-2 mt-4">
            {clubs.length ? (
              clubs.map((club, i) => (
                <motion.span
                  key={i}
                  whileHover={{ scale: 1.05 }}
                  className="bg-indigo-100 dark:bg-indigo-700 text-indigo-800 dark:text-white px-3 py-1 rounded-full cursor-pointer"
                  onClick={() => router.push(`/clubs/${club.clubslug}`)}
                >
                  {club.clubname}
                </motion.span>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400">
                No clubs joined.
              </p>
            )}
          </div>
        </motion.div>

        {/* Events */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-10 bg-white dark:bg-gray-900 p-6 rounded-2xl shadow"
        >
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
            Past Events
          </h3>
          <ul className="mt-4 space-y-2">
            {events.length ? (
              events.map((event, i) => (
                <motion.li
                  key={i}
                  whileHover={{ scale: 1.01 }}
                  className="cursor-pointer hover:underline text-gray-800 dark:text-white"
                  onClick={() => router.push(`/events/${event.eventId}`)}
                >
                  <span className="font-medium">{event.eventName}</span> &mdash;
                  <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">
                    {event.eventDate}
                  </span>
                </motion.li>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400">
                No events participated yet.
              </p>
            )}
          </ul>
        </motion.div>

        {/* Manage Profile */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="mt-10 bg-white dark:bg-gray-900 p-6 rounded-2xl shadow text-center"
        >
          <Button
            variant="outline"
            onClick={() => router.push(`/users/${user.id}/manage`)}
          >
            Manage Profile Settings
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
