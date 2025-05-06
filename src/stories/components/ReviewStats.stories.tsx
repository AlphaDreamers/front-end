import { StoryObj, Meta } from "@storybook/react";
import ReviewStatsCard from "@/components/ReviewStats";

export default {
  component: ReviewStatsCard,
} satisfies Meta<typeof ReviewStatsCard>;

type Story = StoryObj<typeof ReviewStatsCard>;

export const Default: Story = {
  args: {
    distribution: {
      5: 85052,
      4: 10247,
      3: 3074,
      2: 1024,
      1: 3074,
    },
    averageRating: 4.5,
    totalReviews: 102471,
  },
};
