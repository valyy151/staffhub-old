import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  Scroll,
  ScrollText,
  User,
  X,
} from "lucide-react";
import {
  formatDate,
  formatDay,
  formatMonth,
  formatTime,
} from "~/utils/dateFormatting";
import router from "next/router";
import { useEffect, useState } from "react";
import { CalendarPlus } from "lucide-react";
import Heading from "~/components/ui/Heading";
import groupShifts from "~/utils/groupShifts";
import Spinner from "~/components/ui/Spinner";
import { Button } from "~/components/ui/Button";
import Paragraph from "~/components/ui/Paragraph";
import { type DashboardWorkDay, api } from "~/utils/api";

const DashboardPage = () => {
  const [skip, setSkip] = useState<number>(0);
  const [workDay, setWorkDay] = useState<DashboardWorkDay[] | null>(null);

  const { data, isFetching } = api.dashboard.find.useQuery({
    skip: skip,
  });

  function handlePrevPage(): void {
    setSkip(skip - 1);
  }

  function handleNextPage(): void {
    setSkip(skip + 1);
  }

  useEffect(() => {
    if (data) {
      setWorkDay(data);
    }
  }, [data]);

  if (data?.length === 0) {
    return (
      <main className="flex flex-col items-center">
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

  if (!workDay) {
    return <Spinner />;
  }

  return (
    <main className="mx-auto mt-12 w-fit">
      <div className="mb-2 flex items-baseline justify-between">
        <Heading className="ml-2">
          {workDay &&
            workDay[0] &&
            new Date(workDay[0].date * 1000).toLocaleDateString("en-GB", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}{" "}
          -{" "}
          {workDay &&
            workDay[6] &&
            new Date(workDay[6].date * 1000).toLocaleDateString("en-GB", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}{" "}
        </Heading>

        <div className="flex space-x-1">
          <Button
            variant={"link"}
            title="Previous Week"
            onClick={handlePrevPage}
            disabled={isFetching}
            className="h-16 w-[6.9rem] rounded-lg border border-slate-300 bg-white hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-750 dark:hover:bg-slate-700"
          >
            {<ChevronLeft size={48} />}
          </Button>

          <Button
            variant={"link"}
            title="Next Week"
            onClick={handleNextPage}
            disabled={isFetching}
            className="h-16 w-[6.9rem] rounded-lg border border-slate-300 bg-white hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-750 dark:hover:bg-slate-700"
          >
            {<ChevronRight size={48} />}
          </Button>
        </div>
      </div>

      <div className="flex min-h-[36rem] rounded border border-slate-300 bg-white shadow dark:border-slate-600 dark:bg-slate-750">
        {workDay?.map((day) => (
          <div
            className="group flex min-w-[14rem] cursor-pointer flex-col items-center border-x border-slate-300 transition-colors duration-150 hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-700"
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
    </main>
  );
};

export default DashboardPage;
