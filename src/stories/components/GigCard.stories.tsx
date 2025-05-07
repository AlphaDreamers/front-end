import { StoryObj, Meta } from "@storybook/react";
import GigCard from "@/components/GigCard";

export default {
  component: GigCard,
} satisfies Meta<typeof GigCard>;

type Story = StoryObj<typeof GigCard>;

export const Default: Story = {
  args: {
    title: "NFT Collection Creation & Launch",
    description:
      "Complete NFT collection development, from artwork to smart contracts and marketplace listing",
    level: "Expert",
    experience: "4+ years",
    completedProjects: 47,
    deliveryTime: "7 days",
    startingPrice: 3.5,
    currency: "SOL",
    sellerName: "NFT_Master",
    sellerAvatar: "/api/placeholder/80/80",
    popularityScore: 98,
  },
};
