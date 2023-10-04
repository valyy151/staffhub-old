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

  const notesArray: {
    id: string;
    date: number;
    userId: string;
    content: string;
    createdAt: Date;
    workDayId: string;
  }[] = [];

  workDays?.map((day) =>
    day.notes.map((note) => notesArray.push({ ...note, date: day.date }))
  );

  const absencesArray:
    | {
        reason: string;
        absent: boolean;
        approved: boolean;
        employee: {
          name: string;
          id: string;
        };
        amount: number;
      }[]
    | null = [];

  //calculate amount of absences for each employee then push to absencesArray
  workDays?.map((day) =>
    day.shifts.map((shift) => {
      if (shift.absence?.absent) {
        const index = absencesArray.findIndex(
          (absence) => absence.employee.id === shift.employee.id
        );

        if (index === -1) {
          absencesArray.push({
            reason: shift.absence.reason,
            absent: shift.absence.absent,
            approved: shift.absence.approved,
            employee: {
              name: shift.employee.name,
              id: shift.employee.id,
            },
            amount: 1,
          });
        } else {
          absencesArray[index]!.amount += 1;
        }
      }
    })
  );

  return (
    <div className="flex min-h-screen flex-col">
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
                  className="rounded-lg border"
                  onClick={() => setSkip(skip - 1)}
                >
                  Prev Week
                </Button>

                <Button
                  variant={"ghost"}
                  title="Next Week"
                  disabled={isFetching}
                  className="rounded-lg border"
                  onClick={() => setSkip(skip + 1)}
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
                  <div
                    key={day.id}
                    className={`flex w-full flex-col items-center border-x  ${
                      index === 0 && "rounded-s-lg"
                    } ${index === 6 && "rounded-e-lg"}`}
                  >
                    <Link
                      href={`/days/${day.id}/shifts`}
                      className="group w-full text-center"
                    >
                      <Heading size={"xs"} className="px-3 pt-6">
                        {formatDay(day.date)}
                      </Heading>
                      <Paragraph className="w-full border-b-2 py-2 text-center duration-150 group-hover:border-primary">
                        {day && formatDate(day.date)}
                      </Paragraph>
                    </Link>
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
                                  <User
                                    className={`ml-1 ${
                                      shift.absence?.absent && "text-rose-500"
                                    }`}
                                  />
                                  <Link
                                    href={`/staff/${shift.employee.id}`}
                                    className={`text-left hover:underline ${
                                      shift.absence?.absent &&
                                      "text-muted-foreground"
                                    }`}
                                  >
                                    {shift.employee.name.split(" ")[0]}
                                  </Link>

                                  <span
                                    className={`ml-auto ${
                                      shift.absence?.absent &&
                                      "text-muted-foreground"
                                    }`}
                                  >
                                    {formatTime(shift.start)}
                                  </span>
                                  <span
                                    className={`mx-0.5 ${
                                      shift.absence?.absent &&
                                      "text-muted-foreground"
                                    }`}
                                  >
                                    -
                                  </span>
                                  <span
                                    className={`mr-2 ${
                                      shift.absence?.absent &&
                                      "text-muted-foreground"
                                    }`}
                                  >
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

                    <Link
                      href={`/days/${day.id}/notes`}
                      title={`${day.notes.length} ${
                        day.notes.length === 1 ? "note" : "notes"
                      }`}
                      className="mt-auto flex items-center border-b border-transparent px-2 pb-2 text-2xl duration-150 hover:border-primary"
                    >
                      {day.notes.length}
                      {day.notes.length > 0 ? (
                        <ScrollText className="ml-2 h-6 w-6" />
                      ) : (
                        <Scroll className="ml-2 h-6 w-6" />
                      )}
                    </Link>
                  </div>
                );
              })}
            </div>

            {absencesArray.length > 0 && (
              <>
                <Heading size={"xs"} className="ml-2">
                  Absences
                </Heading>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {absencesArray.map((absence, index) => (
                    <div key={index} className="rounded-lg border bg-card py-2">
                      <Paragraph className="border-b px-2 pb-1">
                        <Link
                          className="underline-offset-2 hover:underline"
                          href={`/staff/${absence.employee.id}`}
                        >
                          {absence.employee.name}{" "}
                        </Link>
                      </Paragraph>

                      <div className="flex justify-between px-2 pt-4">
                        <Paragraph size={"sm"}>
                          <span className="font-light">Reason:</span>{" "}
                          {absence.reason}
                        </Paragraph>
                        <Paragraph size={"sm"}>
                          <span className="font-light"> Amount: </span>{" "}
                          {absence.amount}
                        </Paragraph>
                        <Paragraph
                          size={"sm"}
                          className={`${
                            absence.approved
                              ? "text-green-500"
                              : "text-rose-500"
                          }`}
                        >
                          <span className={"font-light text-foreground"}>
                            {" "}
                            Approved:{" "}
                          </span>{" "}
                          {absence.approved ? "Yes" : "No"}
                        </Paragraph>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {notesArray.length > 0 && (
              <>
                <Heading size={"xs"} className="ml-2">
                  Notes
                </Heading>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {notesArray
                    .sort(
                      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
                    )
                    .map((note) => (
                      <div
                        key={note.id}
                        className="flex min-h-[6rem] w-full flex-col rounded-lg border bg-card py-1"
                      >
                        <Link
                          href={`/days/${note.workDayId}/notes`}
                          className="w-fit px-2 text-sm font-medium underline-offset-2 hover:underline"
                        >
                          {new Date(note.date * 1000).toLocaleString("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </Link>

                        <Paragraph
                          size={"sm"}
                          className="px-2 pb-2 text-justify font-light"
                        >
                          {note.content}
                        </Paragraph>
                      </div>
                    ))}
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
