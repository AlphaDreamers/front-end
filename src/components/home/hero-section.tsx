import { Input } from "../ui/input";
import { Search } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative py-20 md:py-32">
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute top-20 left-1/4 h-64 w-64 rounded-full bg-primary blur-[100px]"></div>
        <div className="absolute bottom-20 right-1/4 h-64 w-64 rounded-full bg-primary/75 blur-[100px]"></div>
      </div>

      <div className="mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="mb-6 text-4xl font-extrabold tracking-tight md:text-6xl">
            Hire Top Freelancers with{" "}
            <span className="bg-gradient-to-r from-primary to-primary/75 bg-clip-text text-transparent">
              Solana
            </span>
          </h1>

          <p className="mb-8 text-lg text-muted-foreground md:text-xl">
            Secure, anonymous, and lightning-fast transactions with the power of
            blockchain technology. Connect with the best talent globally without
            the middleman.
          </p>

          <div className="relative mx-auto w-full max-w-2xl">
            <Search className="absolute left-4 top-1/2 z-10 -translate-y-1/2 text-muted-foreground size-6" />
            <Input
              type="text"
              placeholder="Search for services (e.g., logo design, web development)"
              className="w-full max-w-2xl pointer-events-none rounded-full h-12 pl-12"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
export default HeroSection;
