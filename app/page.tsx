import LandingPage from "@/components/LandindPage";
import Navbar from "@/components/NavBar";

export default function Home() {
  return (
    <>
     <Navbar/>
     <LandingPage/>
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
