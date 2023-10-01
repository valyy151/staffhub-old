import "react-calendar/dist/Calendar.css";

import {
  CalendarOff,
  CalendarPlus,
  Scroll,
  ScrollText,
  User,
} from "lucide-react";
import { getSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import router from "next/router";
import { GetServerSideProps } from "next/types";
import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import { api, DashboardWorkDay } from "~/utils/api";
import { formatDate, formatDay, formatTime } from "~/utils/dateFormatting";

import { Button, buttonVariants } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import Paragraph from "@/components/ui/paragraph";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Spinner from "@/components/ui/spinner";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx);

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
};

export default function DashboardPage() {
  const [skip, setSkip] = useState<number>(0);
  const [value, setValue] = useState<Date>(new Date());
  const [showCalendar, setShowCalendar] = useState<boolean>(false);
  const [workDays, setWorkDays] = useState<DashboardWorkDay[] | null>(null);

  const { data, isFetching } = api.dashboard.find.useQuery({
    skip: skip,
    date: value,
  });

  const { data: firstAndLastDays } =
    api.dashboard.findFirstAndLastDay.useQuery();

  useEffect(() => {
    if (data) {
      setWorkDays(data);
    }
  }, [data]);

  useEffect(() => {
    setSkip(0);
  }, [value]);

  if (data?.length === 0) {
    return (
      <main className="flex flex-col items-center">
        <Head>
          <title>Dashboard | StaffHub</title>
          <meta name="Dashboard" content="Manage your schedules" />
        </Head>
        <Heading className="mt-6" size={"xs"}>
          You do not currently have any created schedules.
        </Heading>

        <Heading size={"xxs"} className="mt-2">
          Click below if you wish to create a schedule.
        </Heading>

        <Link className={`mt-4 ${buttonVariants()}`} href={"/schedule"}>
          <CalendarPlus className="mr-2" /> New Schedule
        </Link>
      </main>
    );
  }

  if (!workDays) {
    return <Spinner />;
  }

  return (
    <div className="flex h-screen flex-col">
      <Head>
        <title>Dashboard | StaffHub</title>
        <meta name="Dashboard" content="Manage your schedules" />
      </Head>
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-64 overflow-auto border-r ">
          <nav className="flex flex-col gap-4 p-4">
            <h2 className="text-lg font-semibold">Filters</h2>
            <div className="space-y-4">
              <Select
                open={showCalendar}
                onOpenChange={() => setShowCalendar(!showCalendar)}
              >
                <SelectTrigger onClick={() => setShowCalendar(!showCalendar)}>
                  <SelectValue placeholder="Select a month" />
                </SelectTrigger>
                <SelectContent>
                  <Calendar
                    view="month"
                    maxDetail="year"
                    next2Label={null}
                    prev2Label={null}
                    activeStartDate={value!}
                    onChange={(value: any) => {
                      setValue(value);
                      setShowCalendar(false);
                    }}
                    maxDate={new Date(1000 * firstAndLastDays?.[1]?.date!)}
                    minDate={new Date(1000 * firstAndLastDays?.[0]?.date!)}
                  />
                </SelectContent>
              </Select>
              <div className="flex space-x-1">
                <Button
                  variant={"ghost"}
                  title="Previous Week"
                  disabled={isFetching}
                  onClick={() => setSkip(skip - 1)}
                  className="rounded-lg border   bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700"
                >
                  Prev Week
                </Button>

                <Button
                  variant={"ghost"}
                  title="Next Week"
                  disabled={isFetching}
                  onClick={() => setSkip(skip + 1)}
                  className="rounded-lg border   bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700"
                >
                  Next Week
                </Button>
              </div>
              <div className="flex justify-center pt-6">
                {isFetching && <Spinner noMargin />}
              </div>
            </div>
          </nav>
        </aside>
        <main className="flex-1 p-4">
          <div className="grid gap-4">
            <Heading size={"sm"} className="ml-2">
              {workDays &&
                workDays[0] &&
                new Date(workDays[0].date * 1000).toLocaleDateString("en-GB", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}{" "}
              -{" "}
              {workDays &&
                workDays[6] &&
                new Date(workDays[6].date * 1000).toLocaleDateString("en-GB", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}{" "}
            </Heading>

            <div className="flex min-h-[24rem] rounded-lg border-b border-t  ">
              {workDays?.map((day, index) => {
                return (
                  <Link
                    key={day.id}
                    href={`/days/${day.id}/shifts`}
                    className={`group flex w-full cursor-pointer flex-col items-center border-x transition-colors duration-150 ${
                      index === 0 && "rounded-s-lg"
                    } ${index === 6 && "rounded-e-lg"}`}
                  >
                    <div className="w-full text-center">
                      <Heading
                        size={"xs"}
                        className="px-3 pt-6 transition-colors duration-75 group-hover:text-sky-500 dark:group-hover:text-sky-400"
                      >
                        {formatDay(day.date)}
                      </Heading>
                      <Paragraph className="w-full cursor-pointer border-b-2   py-2 text-center group-hover:text-sky-500 dark:group-hover:text-sky-400">
                        {day && formatDate(day.date)}
                      </Paragraph>
                    </div>
                    <div className="mt-4 flex w-full flex-col items-center">
                      {day.shifts.length > 0 ? (
                        day.shifts
                          .sort((a, b) => a.start - b.start)
                          .map((shift) => {
                            return (
                              <div
                                key={shift.id}
                                title={shift.employee.name}
                                className="w-full"
                              >
                                <p className="text-md flex items-center">
                                  <User className={`ml-1`} />
                                  <span className={`text-left`}>
                                    {shift.employee.name.split(" ")[0]}
                                  </span>
                                  <span className="ml-auto">
                                    {formatTime(shift.start)}
                                  </span>
                                  <span className="mx-0.5">-</span>
                                  <span className="mr-2">
                                    {formatTime(shift.end)}
                                  </span>
                                </p>
                              </div>
                            );
                          })
                      ) : (
                        <Paragraph className="flex items-center">
                          <CalendarOff className="mr-2" />
                          No Shifts
                        </Paragraph>
                      )}
                    </div>

                    <div
                      title={`${day.notes.length} ${
                        day.notes.length === 1 ? "note" : "notes"
                      }`}
                      className="mt-auto flex items-center pb-2 text-2xl duration-150 hover:text-sky-400"
                    >
                      <div
                        onClick={() => router.push(`/days/${day.id}/notes`)}
                        className="flex items-center"
                      >
                        {day.notes.length}
                        {day.notes.length > 0 ? (
                          <ScrollText className="ml-2 h-6 w-6" />
                        ) : (
                          <Scroll className="ml-2 h-6 w-6" />
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
            {/* <div className="h-96 rounded-lg bg-zinc-100 dark:bg-zinc-800"></div> */}
          </div>
        </main>
      </div>
    </div>
  );
}
