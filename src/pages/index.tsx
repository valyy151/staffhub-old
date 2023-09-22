import {
  Cog,
  Users,
  Forward,
  Palmtree,
  FileSearch,
  CalendarClock,
} from "lucide-react";
import Link from "next/link";
import Head from "next/head";
import Spinner from "@/components/ui/spinner";
import { signIn, useSession } from "next-auth/react";
import { Button, buttonVariants } from "@/components/ui/button";

export default function Home() {
  const { status } = useSession();

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
        <h1 className="mb-6 bg-gradient-to-r from-black to-gray-400 bg-clip-text text-3xl font-bold tracking-tighter text-transparent dark:from-white dark:to-gray-500 sm:text-5xl xl:text-6xl/none">
          StaffHub
        </h1>
        <Spinner noMargin />
      </main>
    );
  }

  return (
    <main className="mt-4 flex   flex-col items-center px-2 sm:px-0">
      <Head>
        <title>StaffHub</title>
        <meta
          name="StaffHub"
          content="StaffHub is a web application that helps you manage your staff and their shifts."
        />
      </Head>

      <section className="w-full py-12">
        <div className="container px-4 md:px-6">
          <div className="grid items-center gap-6">
            <div className="flex flex-col justify-center space-y-8 text-center">
              <div className="space-y-2">
                <h1 className="bg-gradient-to-r from-black to-gray-400 bg-clip-text text-3xl font-bold tracking-tighter text-transparent dark:from-white dark:to-gray-500 sm:text-5xl xl:text-6xl/none">
                  Simplify Administration, Maximize Results
                </h1>
                <p className="mx-auto max-w-[600px]  md:text-xl">
                  Designed to enhance your productivity and streamline your
                  workflow.
                </p>
              </div>
              <div className="mx-auto w-full max-w-full space-y-4">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                  <div className="flex flex-col items-center space-y-2 rounded-lg border-gray-800 p-4">
                    <div className="p-2">
                      <Users />
                    </div>
                    <h2 className="text-xl font-bold ">Staff Overview</h2>
                    <p className="">
                      All your staff in one place. See their shifts,
                      availability, and contact information.
                    </p>
                  </div>
                  <div className="flex flex-col items-center space-y-2 rounded-lg border-gray-800 p-4">
                    <div className="p-2">
                      <CalendarClock />
                    </div>
                    <h2 className="text-xl font-bold ">Schedule Planing</h2>
                    <p className="">
                      Create and share schedules with your staff. Easily add or
                      remove shifts.
                    </p>
                  </div>{" "}
                  <div className="flex flex-col items-center space-y-2 rounded-lg border-gray-800 p-4">
                    <div className=" p-2">
                      <Forward />
                    </div>
                    <h2 className="text-xl font-bold ">Share Documents</h2>
                    <p className="">
                      Share schedules and documents with your team easily.
                    </p>
                  </div>
                  <div className="flex flex-col items-center space-y-2 rounded-lg border-gray-800 p-4">
                    <div className="p-2">
                      <Palmtree />
                    </div>
                    <h2 className="text-xl font-bold ">
                      Vacation and Sick Days
                    </h2>
                    <p className="">
                      Plan vacations for your staff and keep track of their sick
                      days.
                    </p>
                  </div>
                  <div className="flex flex-col items-center space-y-2 rounded-lg border-gray-800 p-4">
                    <div className="p-2">
                      <FileSearch />
                    </div>
                    <h2 className="text-xl font-bold ">
                      Keep Track of Everything
                    </h2>
                    <p className="">
                      Keep track of your staff's hours, notes, overtime, and
                      more.
                    </p>
                  </div>
                  <div className="flex flex-col items-center space-y-2 rounded-lg border-gray-800 p-4">
                    <div className="p-2">
                      <Cog />
                    </div>
                    <h2 className="text-xl font-bold ">
                      Advanced Customization
                    </h2>
                    <p className="">
                      Every business is different. Customize StaffHub to fit
                      your needs.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {status === "authenticated" && (
        <>
          <div className="flex space-x-1 pb-16">
            <Link
              href={"/dashboard"}
              className={buttonVariants({
                size: "lg",
              })}
            >
              Dashboard
            </Link>
            <Link
              href={"/documentation"}
              className={buttonVariants({
                size: "lg",
                variant: "subtle",
              })}
            >
              Documentation
            </Link>
          </div>
        </>
      )}

      {status === "unauthenticated" && (
        <div className="flex space-x-1 pb-16">
          <Button size={"lg"} onClick={() => signIn("google")}>
            Get Started
          </Button>
          <Link
            href={"/documentation"}
            className={buttonVariants({
              size: "lg",
              variant: "subtle",
            })}
          >
            Read More
          </Link>
        </div>
      )}
    </main>
  );
}
