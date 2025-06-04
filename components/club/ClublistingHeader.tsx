import { useState} from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export default function ClubListingHeader() {
  const [search, setSearch] = useState("");
  //   const [theme, setTheme] = useState("light");
  const categories = ["Technology", "Arts", "Sports", "Volunteer"];

  return (
    <Card className="w-full bg-white dark:bg-gray-900 shadow-md rounded-2xl p-6 mb-8 transition-colors">
      <CardContent className="flex flex-col space-y-6">
        {/* Title Section */}
        <div className="flex flex-col items-center text-center space-y-2">
          <Avatar className="w-16 h-16 bg-gray-100 dark:bg-gray-800">
            {/* Replace with logo image */}
            <span className="text-2xl">🤝</span>
          </Avatar>
          <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-100">
            Explore Our Clubs
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Discover communities that match your interests
          </p>
        </div>

        <Separator className="border-gray-200 dark:border-gray-700" />

        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          {/* Search Input */}
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search clubs..."
            className="flex-1 max-w-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
          />

          {/* Category Pills */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <Badge
                key={cat}
                variant="outline"
                className="cursor-pointer bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                {cat}
              </Badge>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <Button className="whitespace-nowrap">Create New Club</Button>
          
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
