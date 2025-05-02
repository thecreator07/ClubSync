
"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function ErrorPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-6">
      <h1 className="text-5xl font-bold mb-4">Something went wrong</h1>
      <p className="text-lg mb-8 text-center">
        An unexpected error occurred. Please try again later or go back to the homepage.
      </p>
      <Button onClick={() => router.push("/")}>Go Home</Button>
    </div>
  );
}
