import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

const successStories = [
  {
    name: "Aryan Patel",
    quote: "Joining the Tech Club boosted my confidence.",
    image: "/image.jpg",
  },
  {
    name: "Riya Sharma",
    quote: "From events to leadership – an amazing journey!",
    image: "/image.jpg",
  },
  {
    name: "Dev Mehta",
    quote: "My creativity flourished in the Design Club.",
    image: "/image.jpg",
  },
];

export default function SuccessStories() {
  return (
    <section className=" py-20  md:px-12 lg:px-24 px-10 max-w-6xl mx-auto text-center">
      <h2 className="text-3xl font-bold text-center mb-10">
        Student Success Stories
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {successStories.map((story, i) => (
          <Card key={i} className="text-center shadow-lg">
            <CardContent className="p-6">
              {story.image ? (
                <div className="relative w-20  h-20 mx-auto mb-4">
                <Image
                  src={story.image}
                  alt={story.name}
                  fill placeholder="empty"
                  sizes="(max-width: 20px) 100vw, 20px"
                  style={{ objectFit: 'cover' }}
                  className="rounded-full"
                />
              </div>
              
              ) : (
                <div className="mx-auto rounded-full mb-4 w-20 h-20 flex items-center justify-center bg-gray-200 text-2xl font-bold">
                  {story.name.split(" ")[0][0]}
                </div>
              )}
              <p className="italic">{story.quote}</p>
              <p className="mt-2 font-semibold">- {story.name}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
