import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "./ui/Button";

export default function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, systemTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const currentTheme = theme === "system" ? systemTheme : theme;
  return (
    <>
      {currentTheme === "dark" ? (
        <Button
          variant={"link"}
          onClick={() => setTheme("light")}
          className="focus:ring-0 focus:ring-offset-0"
        >
          <Sun size={22} className="text-slate-900 dark:text-slate-300" />
        </Button>
      ) : (
        <Button
          variant={"link"}
          onClick={() => setTheme("dark")}
          className="focus:ring-0 focus:ring-offset-0"
        >
          <Moon size={22} className="text-slate-900 dark:text-slate-300" />
        </Button>
      )}
    </>
  );
}
