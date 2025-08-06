"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import heroImg from "@/public/image.jpg";

export default function Hero() {
  const router = useRouter();

  return (
    <section className="relative pt-32 pb-20 px-6 sm:px-10 lg:px-20 xl:px-32 bg-gradient-to-b from-indigo-50 to-white dark:from-gray-900 dark:to-black overflow-hidden">
      {/* Decorative Background Shape */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[60rem] h-[40rem] bg-gradient-to-tr from-indigo-400 via-purple-500 to-pink-500 opacity-20 rounded-full blur-3xl pointer-events-none"
      />

      <div className="relative max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-16 md:gap-20">
        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8 text-center md:text-left"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight text-gray-900 dark:text-white">
            Connect. <span className="text-indigo-600 dark:text-indigo-400">Create.</span> Celebrate!
          </h1>
          <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 max-w-xl mx-auto md:mx-0">
            Discover your community, grow your passions, and shine at every step. Join clubs and events that inspire you.
          </p>
          <div className="flex flex-col sm:flex-row justify-center md:justify-start items-center gap-4 sm:gap-6 pt-4">
            <Button
              onClick={() => router.push("/clubs")}
              className="text-base sm:text-lg px-8 py-4 shadow-lg"
            >
              Explore Clubs
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push("/events")}
              className="text-base sm:text-lg px-8 py-4 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900"
            >
              Upcoming Events
            </Button>
          </div>
        </motion.div>

        {/* Image Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="flex justify-center"
        >
          <Image
            src={heroImg}
            alt="Campus Life"
            width={650}
            height={450}
            className="rounded-3xl shadow-2xl w-full max-w-md sm:max-w-lg lg:max-w-xl h-auto object-cover"
            priority
          />
        </motion.div>
      </div>
    </section>
  );
}
