import Head from "next/head";
import { X, User, Scroll, ScrollText } from "lucide-react";
import router from "next/router";
import { useEffect, useState } from "react";
import { CalendarPlus } from "lucide-react";

import groupShifts from "~/utils/groupShifts";

import { getSession } from "next-auth/react";

import { type GetServerSideProps } from "next/types";
import { type DashboardWorkDay, api } from "~/utils/api";

import { formatDate, formatDay, formatTime } from "~/utils/dateFormatting";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Heading from "@/components/ui/heading";
import Spinner from "@/components/ui/spinner";
import Paragraph from "@/components/ui/paragraph";
import "react-calendar/dist/Calendar.css";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import Calendar from "react-calendar";

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

  function handlePrevPage(): void {
    setSkip(skip - 1);
  }

  function handleNextPage(): void {
    setSkip(skip + 1);
  }

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
        <Heading className="mt-6" size={"sm"}>
          You do not currently have any created schedules.
        </Heading>

        <Heading size={"xs"} className="mt-2">
          Click below if you wish to create a schedule.
        </Heading>

        <Button
          size={"lg"}
          className="mt-4 h-14 text-2xl"
          onClick={() => router.push("/schedule")}
        >
          <CalendarPlus size={30} className="mr-2" /> New Schedule
        </Button>
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
        <aside className="w-64 overflow-auto border-r border-gray-300 dark:border-gray-700">
          <nav className="flex flex-col gap-4 p-4">
            <h2 className="text-lg font-semibold text-zinc-500 dark:text-zinc-400">
              Filters
            </h2>
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
                  onClick={handlePrevPage}
                  disabled={isFetching}
                  className="rounded-lg border border-slate-300 bg-white hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:hover:bg-slate-700"
                >
                  Prev Week
                </Button>

                <Button
                  variant={"ghost"}
                  title="Next Week"
                  onClick={handleNextPage}
                  disabled={isFetching}
                  className="rounded-lg border border-slate-300 bg-white hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:hover:bg-slate-700"
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

            <div className="flex min-h-[24rem] rounded-lg border-b border-t border-slate-300 dark:border-slate-600">
              {workDays?.map((day, index) => {
                console.log(day);
                return (
                  <Link
                    key={day.id}
                    href={`/days/${day.id}/shifts`}
                    className={`group flex w-full cursor-pointer flex-col items-center border-x border-slate-300 transition-colors duration-150 hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-gray-800 ${
                      index === 0 && "rounded-s-lg"
                    } ${index === 6 && "rounded-e-lg"}`}
                  >
                    <div className="w-full text-center">
                      <Heading
                        className="px-3 pt-6 transition-colors duration-75 group-hover:text-sky-500 dark:group-hover:text-sky-400"
                        size={"xs"}
                      >
                        {formatDay(day.date)}
                      </Heading>
                      <Paragraph className="w-full cursor-pointer border-b-2 border-slate-300 py-2 text-center group-hover:text-sky-500 dark:border-slate-600 dark:group-hover:text-sky-400">
                        {day && formatDate(day.date)}
                      </Paragraph>
                    </div>
                    <div className="mt-4 flex w-full flex-col items-center">
                      {groupShifts(day.shifts).map((groupedShift, index) => (
                        <div
                          key={index}
                          className="flex items-center"
                          title={`${day.shifts.length} ${
                            day.shifts.length === 1 ? "shift" : "shifts"
                          } `}
                        >
                          <div className="mr-3 flex">
                            {`${groupedShift.count}`}{" "}
                            <User className="font-normal" />
                          </div>
                          {`${formatTime(groupedShift.start)} - ${formatTime(
                            groupedShift.end
                          )}`}
                        </div>
                      ))}
                    </div>

                    <Paragraph
                      size={"lg"}
                      title={`${day.notes.length} ${
                        day.notes.length === 1 ? "note" : "notes"
                      }`}
                      className="mt-auto flex items-center pb-2 text-2xl duration-150 hover:text-sky-400"
                    >
                      <Link
                        href={`/days/${day.id}/notes`}
                        className="flex items-center"
                      >
                        {day.notes.length}
                        {day.notes.length > 0 ? (
                          <ScrollText className="ml-2 h-6 w-6" />
                        ) : (
                          <Scroll className="ml-2 h-6 w-6" />
                        )}
                      </Link>
                    </Paragraph>
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
