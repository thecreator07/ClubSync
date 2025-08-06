"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import AutoScroll from "embla-carousel-auto-scroll";
import { useRouter } from "next/navigation";
import { CLubCard } from "../Card";
import { ClubWithImage } from "../LandindPage";

interface PopularClubsCarouselProps {
  clubs: ClubWithImage[];
  // isLoading: boolean;
  // isError: boolean;
}
export const PopularClubsCarousel: React.FC<PopularClubsCarouselProps> = ({
  clubs
}) => {
  const router = useRouter();

  return (
    <section className="bg-gradient-to-b from-white to-gray-100 dark:from-black dark:to-gray-900 py-20 px-6 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto text-center relative">
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Popular Clubs
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
          Explore top clubs that are creating an impact on campus. Join the ones that inspire you.
        </p>

        {clubs && clubs.length > 0 && (
          <div className="relative">
            <Carousel
              opts={{ loop: true }}
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
              <CarouselContent className="px-2">
                {clubs.map((club, i) => (
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

              {/* Carousel Nav Buttons */}
              <CarouselPrevious className="absolute -left-8 top-1/2 -translate-y-1/2 z-10 bg-white/80 dark:bg-black/40 hover:bg-white dark:hover:bg-gray-800 rounded-full shadow-md" />
              <CarouselNext className="absolute -right-6 top-1/2 -translate-y-1/2 z-10 bg-white/80 dark:bg-black/40 hover:bg-white dark:hover:bg-gray-800 rounded-full shadow-md" />
            </Carousel>
          </div>
        )}
      </div>
    </section>
  );
};
