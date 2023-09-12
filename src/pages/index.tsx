import Link from "next/link";
import Head from "next/head";
import router from "next/router";
import Heading from "~/components/ui/Heading";
import Spinner from "~/components/ui/Spinner";

import { signIn, useSession } from "next-auth/react";
import { Button, buttonVariants } from "@/components/ui/button";

export default function Home() {
  const { data, status } = useSession();

  if (status === "loading") {
    return (
      <main className="mt-8 flex flex-col items-center">
        <Head>
          <title>StaffHub</title>
          <meta
            name="StaffHub"
            content="StaffHub is a web application that helps you manage your staff and their shifts."
          />
        </Head>
        <Heading className="mb-6" size={"lg"}>
          StaffHub
        </Heading>
        <Spinner noMargin />
      </main>
    );
  }

  return (
    <main className="mt-4 flex flex-col items-center px-2 sm:px-0">
      <Head>
        <title>StaffHub</title>
        <meta
          name="StaffHub"
          content="StaffHub is a web application that helps you manage your staff and their shifts."
        />
      </Head>
      {status === "authenticated" && (
        <>
          <Heading> Hello {data.user.name} </Heading>
          <Heading size={"sm"} className="mt-2 text-center font-semibold">
            Enjoy the Seamless Efficiency at Your Fingertips!
          </Heading>
        </>
      )}

      {status === "unauthenticated" && (
        <>
          <Heading>Welcome to StaffHub!</Heading>
          <Heading size={"sm"} className="mt-4 font-semibold">
            Simplify Administration, Maximize Results
          </Heading>
          <Heading size={"xs"} className="mt-2 font-normal">
            Optimize Shifts, Track Attendance, and Ensure Smooth Operations!
          </Heading>

          <div className="mt-4 space-x-2">
            <Button onClick={() => signIn("google")}>Get Started</Button>
            <Link
              href={"/documentation"}
              className={`${buttonVariants({ variant: "subtle" })}`}
            >
              How to Use
            </Link>
          </div>
        </>
      )}

      <footer className="dark:text-slate- absolute bottom-2 text-slate-500">
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
