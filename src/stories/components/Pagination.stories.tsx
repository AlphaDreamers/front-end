import { StoryObj, Meta } from "@storybook/react";
import Pagination from "@/components/Pagination";

export default {
  title: "Components/Pagination",
  component: Pagination,
  parameters: {
    nextjs: {
      navigation: {
        query: {
          page: 10,
        },
      },
    },
  },
} satisfies Meta<typeof Pagination>;

type Story = StoryObj<typeof Pagination>;

export const Default: Story = {
  args: {
    totalPages: 100,
  },
};
