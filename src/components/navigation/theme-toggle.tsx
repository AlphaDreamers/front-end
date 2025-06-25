"use client";

import { useTheme } from "next-themes";
import { Button } from "../ui/button";
import { Computer, Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  const handleThemeChange = () => {
    if (theme === "light") {
      setTheme("dark");
    } else if (theme === "dark") {
      setTheme("system");
    } else {
      setTheme("light");
    }
  };

  return (
    <Button
      onClick={handleThemeChange}
      variant="ghost"
      size="icon"
      className={cn({
        "text-yellow-500": theme === "light",
        "text-blue-500": theme === "dark",
        "text-gray-500": theme === "system",
      })}
    >
      {theme === "light" ? (
        <Sun />
      ) : theme === "dark" ? (
        <Moon />
      ) : (
        theme === "system" && <Computer />
      )}
    </Button>
  );
};

export default ThemeToggle;
