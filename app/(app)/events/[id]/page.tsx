"use client";

import { useState, useEffect } from "react";
import { useParams} from "next/navigation";
import { toast } from "sonner";
import { Link } from "lucide-react";
import Image from "next/image";

type Event = {
  id: number;
  name: string;
  description: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  eventImage: string;
  location: string;
  registrationLink: string;
  club: {
    name: string;
    logoUrl: string;
    description: string;
  };
};

export default function EventPage() {
  // const router = useRouter();
 const { id } = useParams(); // Assuming slug is available via router query
  const [event, setEvent] = useState<Event | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchEvent = async () => {
      try {
        const res = await fetch(`/api/events/${id}`);
        const data = await res.json();

        if (!res.ok) {
          toast.error(data.message || "Event not found");
          return;
        }

        setEvent(data.data);
      } catch (error) {
        toast.error("Failed to fetch event details");
        console.error(error);
      }
    };

    fetchEvent();
  }, [id]);

  if (!event) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-6">
      {/* Navbar */}
      <nav className="flex justify-between items-center p-4 bg-gray-900 text-white">
        <div>Logo</div>
        <div>
            <Link href="/clubs" className="mr-4">Clubs</Link>
            <Link href="/events" className="mr-4">Events</Link>
            <Link href="/sign-in" className="mr-4">Login</Link>
            <Link href="/dashboard">Dashboard</Link>
        </div>
      </nav>

      {/* Hero Banner Image */}
      <div className="w-full h-[300px] bg-cover bg-center" style={{ backgroundImage: `url(${event.eventImage})` }}></div>

      {/* Event Info Section */}
      <div className="mt-8">
        <h1 className="text-3xl font-bold">{event.name}</h1>
        <div className="flex space-x-4">
          <p>{new Date(event.eventDate).toLocaleDateString()}</p>
          <p>{`${new Date(event.startTime).toLocaleTimeString()} - ${new Date(event.endTime).toLocaleTimeString()}`}</p>
          <p>{event.location}</p>
          <p>{event.registrationLink && <a href={event.registrationLink} target="_blank" className="text-blue-500">Register Now</a>}</p>
        </div>
      </div>

      {/* About the Event */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold">About the Event</h2>
        <p>{event.description}</p>
      </div>

      {/* Organized By */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold">Organized By:</h2>
        <div className="flex items-center space-x-4">
          <Image src={event.club.logoUrl} alt="Club Logo" className="w-16 h-16 object-cover rounded-full" />
          <div>
            <h3 className="text-xl font-semibold">{event.club.name}</h3>
            <p>{event.club.description}</p>
            <Link href={`/clubs/${event.club.name}`} className="text-blue-500">View Club Page</Link>
          </div>
        </div>
      </div>

      {/* Event Gallery */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold">Event Gallery</h2>
        <div className="flex space-x-4 overflow-x-auto">
          {/* Placeholder for gallery images */}
          <Image src={event.eventImage} alt="Event Image" className="w-64 h-40 object-cover rounded-md" />
          {/* More images can be added here */}
        </div>
      </div>

      {/* Participants */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold">Participants</h2>
        <div className="flex space-x-2">
          {/* Placeholder for participants */}
          <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
          <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
          {/* Add more avatars here */}
          <span>+50 more</span>
        </div>
      </div>

      {/* Past Events */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold">Past Events by {event.club.name}</h2>
        <div className="flex space-x-4 overflow-x-auto">
          {/* Example of past events */}
          <div className="w-60 h-40 bg-gray-200 p-4 rounded-md">Event 1</div>
          <div className="w-60 h-40 bg-gray-200 p-4 rounded-md">Event 2</div>
          <div className="w-60 h-40 bg-gray-200 p-4 rounded-md">Event 3</div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="mt-8 text-center">
        <h2 className="text-xl font-bold">Final Call to Action</h2>
        <p>Dont miss your chance to be part of innovation!</p>
        <Link href={event.registrationLink} target="_blank" className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700">Register Now</Link>
      </div>

      {/* Footer */}
      <footer className="mt-12 text-center">
        <p>&copy; 2025 Your Organization. All Rights Reserved.</p>
        <div>
            <Link href="/about" className="mr-4">About</Link>
            <Link href="/contact" className="mr-4">Contact</Link>
            <Link href="/privacy" className="mr-4">Privacy</Link>
        </div>
      </footer>
    </div>
  );
}
