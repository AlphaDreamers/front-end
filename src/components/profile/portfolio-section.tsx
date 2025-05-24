import { Prisma } from "@prisma/client";

import PorfolioCard from "./porfolio-card";

interface PortfolioSectionProps {
  portfolioItems: Prisma.PortfolioItemGetPayload<{
    select: {
      id: true;
      title: true;
      images: true;
      description: true;
      url: true;
    };
  }>[];
}

const PortfolioSection = ({ portfolioItems }: PortfolioSectionProps) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
      {portfolioItems.map((item) => (
        <PorfolioCard key={item.id} item={item} />
      ))}
    </div>
  );
};

export default PortfolioSection;
