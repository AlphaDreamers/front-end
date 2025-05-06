import type { Preview } from "@storybook/react";
import { ThemeProvider } from "../src/components/ThemeProvider";
import { useTheme } from "next-themes";
import { Toaster } from "../src/components/ui/sonner";
import React, { useEffect } from "react";
import "../src/app/globals.css";

const ThemeWrapper = ({
  children,
  theme,
}: {
  children: React.ReactNode;
  theme: string;
}) => {
  const { setTheme } = useTheme();

  useEffect(() => {
    setTheme(theme);
  }, [theme, setTheme]);

  return children;
};

const preview: Preview = {
  parameters: {
    nextjs: { appDirectory: true },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
      themes: {
        default: "light",
        list: [
          { name: "light", class: "light" },
          { name: "dark", class: "dark" },
        ],
      },
    },
  },
  decorators: [
    (Story, context) => {
      const theme = context.globals.theme;
      return (
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ThemeWrapper theme={theme}>
            <Story />
            <Toaster richColors />
          </ThemeWrapper>
        </ThemeProvider>
      );
    },
  ],
  globalTypes: {
    theme: {
      description: "Global theme for components",
      toolbar: {
        title: "Theme",
        icon: "circlehollow",
        items: ["light", "dark"],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: "light",
  },
};

export default preview;
