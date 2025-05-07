import { Meta, StoryObj } from "@storybook/react";

import Page from "@/app/(auth)/sign-up/page";

export default {
  title: "Pages/Register",

  component: Page,
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
    },
  },
} satisfies Meta<typeof Page>;

type Story = StoryObj<typeof Page>;

export const Default: Story = {
  render: () => (
    <div className="flex min-h-screen items-center justify-center p-4 sm:p-6 lg:p-8">
      <Page />
    </div>
  ),
};
