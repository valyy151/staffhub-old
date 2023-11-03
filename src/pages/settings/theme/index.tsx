import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export default function ThemePage() {
  const { setTheme } = useTheme();
  return (
    <main className="flex flex-col items-center">
      <h1 className="mt-4 text-center text-2xl text-primary">Hello World</h1>
      <div className="mt-4 flex space-x-0.5">
        <Button
          onClick={() => setTheme("system")}
          className="focus:ring-0 focus:ring-offset-0 active:bg-inherit"
        >
          Default
        </Button>

        <Button
          onClick={() => setTheme("red")}
          className="focus:ring-0 focus:ring-offset-0 active:bg-inherit"
        >
          Red
        </Button>
      </div>
    </main>
  );
}
