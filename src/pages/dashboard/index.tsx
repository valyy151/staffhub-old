import Head from "next/head";
import {
  X,
  User,
  Scroll,
  ScrollText,
  ChevronLeft,
  ChevronRight,
  CalendarIcon,
} from "lucide-react";
import router from "next/router";
import { useEffect, useState } from "react";
import { CalendarPlus } from "lucide-react";
import Heading from "~/components/ui/Heading";
import groupShifts from "~/utils/groupShifts";
import Spinner from "~/components/ui/Spinner";
import { getSession } from "next-auth/react";
import Paragraph from "~/components/ui/Paragraph";
import { type GetServerSideProps } from "next/types";
import { type DashboardWorkDay, api } from "~/utils/api";
import CalendarModal from "~/components/Dashboard/CalendarModal";
import { formatDate, formatDay, formatTime } from "~/utils/dateFormatting";
import { Button } from "@/components/ui/button";

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
    <main className="mx-auto mt-12 w-fit">
      <Head>
        <title>Dashboard | StaffHub</title>
        <meta name="Dashboard" content="Manage your schedules" />
      </Head>
      <div className="mb-2 flex items-baseline justify-between">
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

        <div className="flex space-x-1">
          <Button
            variant={"link"}
            className="h-16 w-[4.85vw] rounded-lg border border-slate-300 bg-white hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:hover:bg-slate-700"
            onClick={() => setShowCalendar(!showCalendar)}
          >
            <CalendarIcon size={42} />
          </Button>
          <Button
            variant={"link"}
            title="Previous Week"
            onClick={handlePrevPage}
            disabled={isFetching}
            className="h-16 w-[4.85vw] rounded-lg border border-slate-300 bg-white hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:hover:bg-slate-700"
          >
            {<ChevronLeft size={42} />}
          </Button>

          <Button
            variant={"link"}
            title="Next Week"
            onClick={handleNextPage}
            disabled={isFetching}
            className="h-16 w-[4.85vw] rounded-lg border border-slate-300 bg-white hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:hover:bg-slate-700"
          >
            {<ChevronRight size={42} />}
          </Button>
        </div>
      </div>
      <div className="flex min-h-[60vh] rounded border border-slate-300 bg-white shadow dark:border-slate-600 dark:bg-slate-800">
        {workDays?.map((day) => (
          <div
            className="group flex min-w-[10vw] cursor-pointer flex-col items-center border-x border-slate-300 transition-colors duration-150 hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-700"
            key={day.id}
            onClick={() => router.push(`/days/${day.id}`)}
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
              {groupShifts(day.shifts).length > 0 ? (
                groupShifts(day.shifts).map((groupedShift) => (
                  <Paragraph
                    className="flex items-center"
                    title={`${day.shifts.length} ${
                      day.shifts.length === 1 ? "shift" : "shifts"
                    } `}
                    key={`${groupedShift.start}-${groupedShift.end}`}
                  >
                    <div className="mr-3 flex">
                      {`${groupedShift.count}`} <User className="font-normal" />
                    </div>
                    {`${formatTime(groupedShift.start)} - ${formatTime(
                      groupedShift.end
                    )}`}
                  </Paragraph>
                ))
              ) : (
                <Paragraph className="flex items-center">
                  <X className="mr-2" />
                  No Shifts
                </Paragraph>
              )}
            </div>
            <Paragraph
              size={"lg"}
              title={`${day.notes.length} ${
                day.notes.length === 1 ? "note" : "notes"
              }`}
              className="mt-auto flex items-center pb-2 text-2xl"
            >
              {day.notes.length}{" "}
              {day.notes.length > 0 ? (
                <ScrollText className="ml-2 h-6 w-6" />
              ) : (
                <Scroll className="ml-2 h-6 w-6" />
              )}
            </Paragraph>
          </div>
        ))}
      </div>
      <div className="mt-8 flex justify-center">
        {isFetching && <Spinner noMargin />}
      </div>
      {showCalendar && (
        <CalendarModal
          value={value}
          setValue={setValue}
          showModal={showCalendar}
          lastDay={firstAndLastDays?.[1]?.date}
          firstDay={firstAndLastDays?.[0]?.date}
          close={() => setShowCalendar(false)}
        />
      )}
    </main>
  );
}
