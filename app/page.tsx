import NewLandingPage from "@/components/HomePage";
import { NavbarDemo } from "@/components/NavbarMenu";

export default function Home() {
  return (
    <>
      
      <NavbarDemo />
      {/* <LandingPage /> */}
      <NewLandingPage/>
      {/* <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold text-center">Welcome to ClubSync</h1>
        <p className="mt-4 text-center">
          A platform for managing clubs and events. Explore, create, and join
          clubs and events that interest you.
        </p>
      </div> */}
    </>
  );
}
