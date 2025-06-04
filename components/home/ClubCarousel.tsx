"use client";

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import AutoScroll from "embla-carousel-auto-scroll";
import { useRouter } from "next/navigation";
// import { ClubWithImage } from "../LandindPage";
import { CLubCard } from "../Card";
import { ClubWithImage } from "../HomePage";
// import { CLubCard } from "@/components/CLubCard"; // Make sure the import path is correct
// import { ClubWithImages } from "@/types"; // Adjust type based on your data shape

interface PopularClubsCarouselProps {
  clubs: ClubWithImage[];
  fetchStatus: "fetching" | "idle" | "error";
}

export const PopularClubsCarousel: React.FC<PopularClubsCarouselProps> = ({ clubs, fetchStatus }) => {
  const router = useRouter();

  return (
    <section className="px-10 max-w-6xl mx-auto text-center">
      <h2 className="text-3xl font-bold mb-10 text-center">Popular Clubs</h2>

      {fetchStatus === "fetching" && <p>Loading...</p>}
      {fetchStatus === "error" && <p>Error fetching data. Retrying...</p>}
      {fetchStatus === "idle" && (
        <Carousel
          opts={{
            loop: true,
          }}
          plugins={[
            AutoScroll({
              speed: 1,
              startDelay: 1000,
              direction: "forward",
              stopOnInteraction: true,
              stopOnMouseEnter: true,
            }),
          ]}
          className="w-full"
        >
          <CarouselContent>
            {clubs && clubs.length > 0 && clubs.map((club, i) => (
              <CarouselItem
                key={club.clubs.id || i}
                className="md:basis-1/2 lg:basis-1/3"
              >
                <CLubCard
                  imageUrl={club.club_images.imageUrl}
                  name={club.clubs.name}
                  description={club.clubs.description}
                  slug={club.clubs.slug}
                  onViewClick={() => router.push(`/clubs/${club.clubs.slug}`)}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="cursor-pointer" />
          <CarouselNext className="cursor-pointer" />
        </Carousel>
      )}
    </section>
  );
};
