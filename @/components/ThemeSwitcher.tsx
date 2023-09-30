import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

export default function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, systemTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-[50px]"></div>;
  }

  const currentTheme = theme === "system" ? systemTheme : theme;
  return (
    <>
      {currentTheme === "dark" ? (
        <Button
          variant={"ghost"}
          onClick={() => setTheme("light")}
          className="focus:ring-0 focus:ring-offset-0 active:bg-inherit"
        >
          <Sun size={18} className="text-gray-900 dark:text-gray-300" />
        </Button>
      ) : (
        <Button
          variant={"ghost"}
          onClick={() => setTheme("dark")}
          className="focus:ring-0 focus:ring-offset-0 active:bg-inherit"
        >
          <Moon size={18} className="text-gray-900 dark:text-gray-300" />
        </Button>
      )}
    </>
  );
}
