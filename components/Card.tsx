"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface CardProps {
  imageUrl?: string;
  name: string;
  description: string;
  slug: string;
  onViewClick: (slug: string) => void;
}

export function CLubCard({
  imageUrl,
  name,
  description,
  slug,
  onViewClick,
}: CardProps) {
  return (
   <Card className="group w-[95%] flex flex-col h-full rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-lg transition-shadow duration-200 transform group-hover:-translate-y-1">
      <div className="relative w-full pb-[56.25%] overflow-hidden rounded-t-2xl">
        {imageUrl && (
          <>
            <Image
              src={imageUrl}
              alt={name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-200"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors duration-200"
            />
          </>
        )}
      </div>

      <CardContent className="flex flex-col items-center text-center p-6 space-y-4 flex-1">
        <h3 className="self-start text-2xl font-semibold text-gray-800 dark:text-gray-200 group-hover:text-indigo-600 transition-colors duration-200">
          {name}
        </h3>
        <p className="self-center text-sm leading-relaxed text-gray-600 dark:text-gray-300 line-clamp-3">
          {description}
        </p>
        <div className="self-baseline mt-auto w-full">
          <Button
            className="w-full self-baseline bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 active:scale-95 transition-all duration-150"
            onClick={() => onViewClick(slug)}
          >
            View Club
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
