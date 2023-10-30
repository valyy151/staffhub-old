import { Button } from "@/components/ui/button";

export default function ThemePage() {
  return (
    <main className="flex flex-col items-center">
      <h1 className="mt-4 text-center text-2xl text-primary">Hello World</h1>
      <div className="mt-4 flex space-x-0.5">
        <Button className="focus:ring-0 focus:ring-offset-0 active:bg-inherit">
          Default
        </Button>

        <Button className="focus:ring-0 focus:ring-offset-0 active:bg-inherit">
          Red
        </Button>
      </div>
    </main>
  );
}
