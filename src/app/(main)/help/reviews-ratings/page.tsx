import { BorderedCard } from "@/components/help/bordered-card";
import { FeatureGrid } from "@/components/help/feature-grid";
import { InfoAlert } from "@/components/help/info-alert";
import { RatingDisplay } from "@/components/help/rating-display";
import { TipBox } from "@/components/help/tip-box";
import { HelpPageTemplate } from "@/components/templates/help-page-template";
import { MessageSquare, Shield, Star, ThumbsUp } from "lucide-react";

export default function ReviewsRatings() {
  const reviewFeatures = [
    {
      icon: () => (
        <div className="flex">
          {[1, 2, 3, 4, 5].map((star) => (
            <svg
              key={star}
              className="h-1 w-1 fill-yellow-400 text-yellow-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          ))}
        </div>
      ),
      bgColor: "bg-yellow-500 flex justify-center items-center",
      title: "Quality Assurance",
      description: "Maintain high standards",
    },
    {
      icon: Shield,
      bgColor: "bg-green-500",
      title: "Verified Reviews",
      description: "Blockchain authenticated",
    },
    {
      icon: ThumbsUp,
      bgColor: "bg-blue-500",
      title: "Build Trust",
      description: "Establish credibility",
    },
  ];

  const ratings = [
    { rating: 1, label: "1 Star - Poor" },
    { rating: 2, label: "2 Stars - Below Average" },
    { rating: 3, label: "3 Stars - Average" },
    { rating: 4, label: "4 Stars - Good" },
    { rating: 5, label: "5 Stars - Excellent" },
  ];

  return (
    <HelpPageTemplate
      title="Reviews and Ratings"
      description="Build trust and reputation in our community"
    >
      <BorderedCard color="yellow" icon={Star} title="The Power of Reviews">
        <p className="text-muted-foreground leading-relaxed mb-4">
          Reviews and ratings are the backbone of trust in our marketplace. They
          help clients make informed decisions and enable freelancers to build
          their reputation. Our blockchain-verified review system ensures
          authenticity and prevents fake reviews, creating a transparent and
          trustworthy environment for everyone.
        </p>
        <FeatureGrid features={reviewFeatures} columns={3} />
      </BorderedCard>

      <BorderedCard
        color="blue"
        icon={MessageSquare}
        title="Leaving a Review"
        description="How to write helpful and constructive reviews"
      >
        <InfoAlert icon={Star} title="Remember">
          You can only leave a review after completing a transaction. Reviews
          are permanent and cannot be deleted, so please be thoughtful and fair.
        </InfoAlert>

        <TipBox title="Rating Guide" className="mt-6">
          <div className="space-y-2">
            {ratings.map((item, index) => (
              <RatingDisplay
                key={index}
                rating={item.rating}
                label={item.label}
              />
            ))}
          </div>
        </TipBox>
      </BorderedCard>
    </HelpPageTemplate>
  );
}
