// components/Navbar.tsx
"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "./ui/button";

const Navbar = () => {
  const { data: session } = useSession(); // Using NextAuth's session hook
  const pathname = usePathname();
  const router = useRouter();
  console.log(session);
  const handleLogout = () => {
    signOut({ callbackUrl: "/sign-in" }); // Redirect after logout
  };
  console.log("pathname", pathname);
  return (
    <nav className="bg-blue-600 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-white text-2xl font-bold">
          ClubSync
        </Link>

        <div className="flex space-x-6">
          <Link href="/" className="text-white">
            Home
          </Link>
          <Link href="/clubs/clubsera" className="text-white">
            Clubs
          </Link>
          <Link href="/events/1" className="text-white">
            Events
          </Link>

          {session ? (
            <>
              <Button
                onClick={() =>
                  router.push(`/users/${session?.user.id}/profile`)
                }
              >
                {session.user.name}
              </Button>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/sign-in" className="text-white">
                Sign In
              </Link>
              <Link href="/sign-up" className="text-white">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
