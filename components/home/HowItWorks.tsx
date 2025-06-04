"use client";

import { motion } from "framer-motion";
import { BookOpen, Users, CalendarCheck, Star } from "lucide-react";

const steps = [
  {
    title: "Join or Create Clubs",
    description: "Browse existing clubs or create your own community with admin approval.",
    icon: Users,
  },
  {
    title: "Organize Events",
    description: "Host exciting events and track participation for each club activity.",
    icon: CalendarCheck,
  },
  {
    title: "Earn Points",
    description: "Gain rewards for attending events and contributing to your club.",
    icon: Star,
  },
  {
    title: "Grow & Shine",
    description: "Showcase your involvement and build your campus reputation.",
    icon: BookOpen,
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-white dark:bg-black py-20 px-6 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          How It Works
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
          Whether you want to join clubs or organize amazing events, our platform makes it simple and fun.
        </p>

        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              viewport={{ once: true }}
              className="p-6 bg-gray-50 dark:bg-gray-900 rounded-2xl shadow hover:shadow-md transition"
            >
              <div className="flex justify-center items-center mb-4">
                <step.icon className="h-10 w-10 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                {step.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
