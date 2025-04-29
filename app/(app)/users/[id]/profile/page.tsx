"use client";

import Navbar from "@/components/NavBar";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
// import Navbar from "@/components/Navbar";
// import Footer from "@/components/Footer";

const ProfilePage = () => {
  const { data: session } = useSession(); // Get user session
  // const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
const router = useRouter()
  useEffect(() => {
    if (session) {
      const fetchUserProfile = async () => {
        try {
          // Replace the API call below with the correct backend endpoint
          const response = await fetch(`/api/users/${session.user.id}`);
          const data = await response.json();
          if (data.success) {
            // setUserData(data.data);
            console.log("get data",data.data);
          } else {
            console.error("Failed to fetch user profile");
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchUserProfile();
    }
  }, [session]);

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
          <h1 className="text-white text-3xl font-bold">{session?.user.name}</h1>
        </div>
      </div>

      {/* Profile Section */}
      <div className="container mx-auto p-6">
        {/* Avatar, Name, Email, Edit Profile */}
        <div className="flex items-center space-x-6 bg-white p-6 rounded-lg shadow-md">
          <div className="w-24 h-24 bg-gray-300 rounded-full"></div>{" "}
          {/* Avatar placeholder */}
          <div className="flex flex-col">
            <h2 className="text-2xl font-semibold">{session?.user?.name&&""}</h2>
            <p className="text-gray-500">{session?.user?.email}</p>
            <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md" onClick={()=>router.push(`/users/${session?.user?.id}/manage`)}>
              Edit Profile
            </button>
          </div>
        </div>

        {/* Bio Section */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold">Bio</h3>
          <p className="mt-2 text-gray-700">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque sit
            amet accumsan arcu.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h4 className="text-xl font-semibold">🔥 Points</h4>
            <p className="mt-2 text-gray-700">1500</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h4 className="text-xl font-semibold">🏆 Events Joined</h4>
            <p className="mt-2 text-gray-700">5</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h4 className="text-xl font-semibold">🎯 Clubs Joined</h4>
            <p className="mt-2 text-gray-700">3</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h4 className="text-xl font-semibold">🛡️ Role</h4>
            <p className="mt-2 text-gray-700">{session?.user?.role}</p>
          </div>
        </div>

        {/* Joined Clubs Section */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold">Joined Clubs</h3>
          <ul className="mt-4 space-y-2">
            <li className="text-gray-700">Tech Society</li>
            <li className="text-gray-700">Drama Club</li>
            <li className="text-gray-700">Photography Club</li>
          </ul>
        </div>

        {/* Past Events Participated */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold">Past Events Participated</h3>
          <ul className="mt-4 space-y-2">
            <li className="text-gray-700">Hackathon 2025</li>
            <li className="text-gray-700">Annual Drama Fest</li>
            <li className="text-gray-700">Photography Exhibition</li>
          </ul>
        </div>

        {/* Settings / Manage Profile */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <button onClick={()=>router.push(`/users/${session?.user?.id}/manage`)} className="w-full text-blue-600 font-semibold py-2 border border-blue-600 rounded-md">
            Manage Profile Settings
          </button>
        </div>
      </div>

      {/* <Footer /> */}
    </div>
  );
};

export default ProfilePage;
