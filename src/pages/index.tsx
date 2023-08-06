import Link from "next/link";
import router from "next/router";
import Heading from "~/components/ui/Heading";
import Spinner from "~/components/ui/Spinner";
import { Button } from "~/components/ui/Button";
import { signIn, useSession } from "next-auth/react";

export default function Home() {
  const { data, status } = useSession();

  if (status === "loading") {
    return <Spinner />;
  }

  return (
    <main className="mt-4 flex flex-col items-center text-2xl">
      {status === "authenticated" && (
        <>
          <Heading size={"lg"} className="">
            {" "}
            Hello {data.user.name}{" "}
          </Heading>
          <Heading className="mt-2 font-semibold">
            Enjoy the Seamless Efficiency at Your Fingertips!
          </Heading>
          <div className="mt-4 space-x-2">
            <Button
              size={"lg"}
              className="h-14 text-2xl"
              onClick={() => router.push("/settings")}
            >
              Account Settings
            </Button>
            <Button
              size={"lg"}
              variant={"subtle"}
              className="h-14 text-2xl"
              onClick={() => router.push("/documentation")}
            >
              How to Use
            </Button>
          </div>
        </>
      )}

      {status === "unauthenticated" && (
        <>
          <Heading size={"lg"}>Welcome to StaffHub!</Heading>
          <Heading className="mt-6 font-semibold">
            Simplify Administration, Maximize Results
          </Heading>
          <Heading className="mt-2 font-normal">
            Optimize Shifts, Track Attendance, and Ensure Smooth Operations!
          </Heading>

          <div className="mt-4 space-x-2">
            <Button
              size={"lg"}
              className="h-14 text-2xl"
              onClick={() => signIn("google")}
            >
              Get Started
            </Button>
            <Button
              size={"lg"}
              variant={"subtle"}
              className="h-14 text-2xl"
              onClick={() => router.push("/documentation")}
            >
              How to Use
            </Button>
          </div>
        </>
      )}

      <footer className="absolute bottom-2 text-slate-400 dark:text-slate-500">
        <Link
          target="_blank"
          href={"https://www.linkedin.com/in/marin-valenta"}
        >
          &copy; StaffHub 2023 Marin Valenta
        </Link>
      </footer>
    </main>
  );
}
