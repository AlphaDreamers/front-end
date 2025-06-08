import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

import { Testimonial } from "@/lib/types";
import Async from "../async";
import TestimonialCard, {
  TestimonialsCardSkeleton,
} from "../reviews/testimonial-card";

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
                          <TestimonialCard testimonial={testimonial} />
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
        <TestimonialsCardSkeleton />
      </div>
    </CarouselItem>
  ));
};
