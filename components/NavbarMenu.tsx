"use client";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ModeToggle } from "./ModeToggle";
import { clubsApi } from "@/services/api/clubs";
import { useDispatch } from "react-redux";
import { eventsApi } from "@/services/api/events";
import { mainApi } from "@/services/api/main";
import { persistor } from "@/services/api";

export function NavbarDemo() {
  const navItems = [
    {
      name: "Club",
      link: "/clubs",
    },
    {
      name: "Event",
      link: "/events",
    },
    {
      name: "Contact",
      link: "/contact",
    },
  ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: session } = useSession(); // Using NextAuth's session hook

  const dispatch = useDispatch();
  const router = useRouter();
  console.log(session);
  const handleLogout = async () => {
    dispatch(clubsApi.util.resetApiState());
    dispatch(eventsApi.util.resetApiState());
    dispatch(mainApi.util.resetApiState());

    // dispatch({ type: PURGE });
    await persistor.purge();

    dispatch({ type: "LOGOUT" });

    signOut({ callbackUrl: "/sign-in" }); // Redirect after logout
  };
  return (
    <div className="relative z-10 py-6 px-10 text-base">
      <Navbar>
        {/* Desktop Navigation */}
        <NavBody className="shadow-2xl border p-2.5 shadow-blue-900">
          <NavbarLogo />
          <NavItems items={navItems} />
          <div className="flex items-center gap-4">
            {/* <NavbarButton variant="secondary">Login</NavbarButton>
            <NavbarButton variant="primary">Book a call</NavbarButton> */}
            {session ? (
              <>
                <NavbarButton
                  onClick={() =>
                    router.push(`/users/${session?.user.id}/profile`)
                  }
                >
                  {session.user.name || "profile"}
                </NavbarButton>
                <NavbarButton
                  onClick={handleLogout}
                  className="bg-red-500 text-white rounded-md mr-2.5 hover:bg-red-600"
                >
                  Logout
                </NavbarButton>
                <div className="z-50">
                  <ModeToggle />
                </div>
              </>
            ) : (
              <>
                <NavbarButton href="/sign-in" className="">
                  Sign In
                </NavbarButton>
                <NavbarButton href="/sign-up" className="ml-3 ">
                  Sign Up
                </NavbarButton>
                <div className="z-50">
                  <ModeToggle />
                </div>
              </>
            )}
          </div>
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <div className="flex justify-center gap-5 items-center">
              <MobileNavToggle
                isOpen={isMobileMenuOpen}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              />
              <div className="z-50">
                <ModeToggle />
              </div>
            </div>
          </MobileNavHeader>

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            {navItems.map((item, idx) => (
              <Link
                key={`mobile-link-${idx}`}
                href={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className="relative text-neutral-600 dark:text-neutral-300"
              >
                <span className="block">{item.name}</span>
              </Link>
            ))}

            <div className="flex w-full flex-col gap-4">
              {session ? (
                <>
                  <NavbarButton
                    onClick={() =>
                      router.push(`/users/${session?.user.id}/profile`)
                    }
                  >
                    {session.user.name || "profile"}
                  </NavbarButton>
                  <NavbarButton
                    onClick={handleLogout}
                    className="bg-red-500 text-white rounded-md hover:bg-red-600"
                  >
                    Logout
                  </NavbarButton>
                </>
              ) : (
                <>
                  <NavbarButton href="/sign-in" className="">
                    Sign In
                  </NavbarButton>
                  <NavbarButton href="/sign-up" className="">
                    Sign Up
                  </NavbarButton>
                </>
              )}
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>

      {/* Navbar */}
    </div>
  );
}
