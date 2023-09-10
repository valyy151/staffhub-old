import Link from "next/link";
import Head from "next/head";
import router from "next/router";
import Heading from "~/components/ui/Heading";
import Spinner from "~/components/ui/Spinner";
import { Button } from "~/components/ui/Button";
import { signIn, useSession } from "next-auth/react";

export default function Home() {
  const { data, status } = useSession();

  if (status === "loading") {
    return (
      <main className="mt-8 flex flex-col items-center">
        <Heading className="mb-6" size={"lg"}>
          StaffHub
        </Heading>
        <Spinner noMargin />
      </main>
    );
  }

  return (
    <main className="mt-4 flex flex-col items-center px-2 text-2xl sm:px-0">
      <Head>
        <title>StaffHub</title>
        <meta
          name="StaffHub"
          content="StaffHub is a web application that helps you manage your staff and their shifts."
        />
      </Head>
      {status === "authenticated" && (
        <>
          <Heading size={"lg"}> Hello {data.user.name} </Heading>
          <Heading className="mt-2 text-center font-semibold">
            Enjoy the Seamless Efficiency at Your Fingertips!
          </Heading>
          <div className="mt-8 flex flex-col space-y-2 sm:mt-4 sm:flex-row sm:space-x-2 sm:space-y-0">
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
