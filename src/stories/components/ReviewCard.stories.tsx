import { StoryObj, Meta } from "@storybook/react";
import ReviewCard from "@/components/ReviewCard";

export default {
  component: ReviewCard,
  parameters: {},
} satisfies Meta<typeof ReviewCard>;

type Story = StoryObj<typeof ReviewCard>;

export const Default: Story = {
  args: {
    author: {
      firstName: "John",
      lastName: "Doe",
    },
    createdAt: new Date(),
    rating: 4.5,
    title: "This is a title",
    text: "This is a review very long review text that should be truncated if it exceeds a certain length. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    maxLength: 100,
  },
};
