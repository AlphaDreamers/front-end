import { StoryObj, Meta } from "@storybook/react";
import Rating from "@/components/Rating";

export default {
  component: Rating,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Rating>;
type Story = StoryObj<typeof Rating>;

export const Default: Story = {
  args: {
    rating: 4,
  },
};

export const Partial: Story = {
  args: {
    rating: 4.26,
  },
};

export const Expanded: Story = {
  args: {
    rating: 4.26,
    maxRating: 10,
  },
};

export const Hover: Story = {
  args: {
    rating: 4.26,
    onClick: (value: number) => {
      console.log(value);
    },
  },
};
