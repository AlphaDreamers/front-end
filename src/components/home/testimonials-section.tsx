import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Rating from "@/components/rating";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Testimonial } from "@/lib/types";
import Async from "../async";
import { Skeleton } from "../ui/skeleton";

interface TestimonialSectionProps {
  getTestimonials: () => Promise<Testimonial[]>;
}

function TestimonialsSection({ getTestimonials }: TestimonialSectionProps) {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">What Our Users Say</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover why thousands of freelancers and clients trust our platform
            for their projects.
          </p>
        </div>

        <div className="w-full">
          <Carousel
            opts={{
              align: "start",
              loop: true,
              skipSnaps: false,
              dragFree: true,
            }}
            autoScrollOpts={{
              playOnInit: true,
              stopOnInteraction: false,
              speed: 0.5,
            }}
            className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]"
          >
            <CarouselContent className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
              <Async
                fetch={getTestimonials}
                fallback={<TestimonialsSectionSkeleton />}
              >
                {(testimonials) =>
                  testimonials.length > 0 ? (
                    testimonials.map((testimonial) => (
                      <CarouselItem
                        key={testimonial.id}
                        className="md:basis-1/2 lg:basis-1/3"
                      >
                        <div className="p-1">
                          <Card className="h-54">
                            <CardHeader className="flex items-center gap-3">
                              <Image
                                src={
                                  testimonial.author.avatar ||
                                  "/avatar-fallback.jpg"
                                }
                                alt="Testimonial Image"
                                width={40}
                                height={40}
                                className="rounded-full size-12"
                              />

                              <div className="flex-1">
                                <h4 className="font-semibold">
                                  {testimonial.author.firstName}{" "}
                                  {testimonial.author.lastName}
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                  {testimonial.author.username}
                                </p>
                              </div>

                              <Rating rating={testimonial.rating} />
                            </CardHeader>

                            <CardContent>
                              <blockquote className="text-muted-foreground leading-relaxed line-clamp-3">
                                &ldquo;{testimonial.content}&rdquo;
                              </blockquote>
                            </CardContent>
                          </Card>
                        </div>
                      </CarouselItem>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center w-full h-60">
                      <h4 className="text-xl font-semibold text-muted-foreground">
                        No testimonials available at the moment.
                      </h4>
                      <p className="text-sm text-muted-foreground mt-2">
                        Check back later or explore other sections of our site.
                      </p>
                    </div>
                  )
                }
              </Async>
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    </section>
  );
}
export default TestimonialsSection;

const TestimonialsSectionSkeleton = () => {
  return Array.from({ length: 5 }).map((_, index) => (
    <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
      <div className="p-1">
        <Card className="h-54">
          <CardHeader className="flex items-center gap-3">
            <Skeleton className="rounded-full size-12" />

            <div className="flex-1">
              <Skeleton className="font-semibold" />
              <Skeleton />
            </div>

            <Skeleton className="w-24 h-6" />
          </CardHeader>

          <CardContent>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-7/8 mt-2" />
            <Skeleton className="h-4 w-11/12 mt-2" />
            <Skeleton className="h-4 w-4/5 mt-2" />
          </CardContent>
        </Card>
      </div>
    </CarouselItem>
  ));
};
