import { useEffect, useState } from "react";
import router from "next/router";
import {
  formatDateLong,
  formatDay,
  formatMonth,
  formatTime,
  getMonthBoundaryTimestamps,
} from "~/utils/dateFormatting";
import { api } from "~/utils/api";
import dynamic from "next/dynamic";
import "react-calendar/dist/Calendar.css";
import { Calendar } from "react-calendar";
import Heading from "~/components/ui/Heading";
import Paragraph from "~/components/ui/Paragraph";
import { calculateTotalHours } from "~/utils/calculateHours";
import Spinner from "~/components/ui/Spinner";
import Sidebar from "~/components/Employees/Sidebar";

const PDFButton = dynamic(() => import("~/components/PDFButton"), {
  ssr: false,
});

interface SchedulePageProps {
  query: { id: string };
}

SchedulePage.getInitialProps = ({ query }: SchedulePageProps) => {
  return { query };
};

export default function SchedulePage({ query }: SchedulePageProps) {
  const [value, setValue] = useState<Date>(new Date());
  const [month, setMonth] = useState(formatMonth(value.getTime() / 1000));

  const [startOfMonth, endOfMonth]: any = getMonthBoundaryTimestamps(value);

  const { data: employee } = api.employee?.findOneAndMonthly.useQuery({
    id: query.id,
    endOfMonth,
    startOfMonth,
  });

  function handleMonthChange(date: any) {
    setValue(date);
    setMonth(formatMonth(value.getTime() / 1000));
  }

  if (!employee) {
    return null;
  }

  return (
    <main className="flex flex-col">
      <Sidebar employee={employee} />
      <div className="mt-4 flex w-full flex-col items-center">
        {" "}
        <Heading>Schedules for {employee?.name}</Heading>
      </div>
      <div className="mt-16 flex justify-end">
        {value && employee?.workDays ? (
          <div
            className={`${
              value
                ? "overflow-y-scroll border border-slate-300 bg-white shadow dark:border-slate-500 dark:bg-slate-800"
                : "border-none"
            }  ml-auto h-[39rem] overflow-x-hidden rounded border border-slate-300`}
          >
            <div className="flex w-full items-center justify-between border-b-2 border-t border-slate-300 bg-white py-4 dark:border-slate-500 dark:bg-slate-800">
              <Heading
                size={"xs"}
                className="text-md ml-8 text-center font-normal"
              >
                {month} ({calculateTotalHours(employee?.workDays)} hours)
              </Heading>
              <PDFButton employee={employee} month={month} value={value} />
            </div>

            {employee?.workDays.map((day, index) => (
              <div
                key={day.id}
                onClick={() => router.push(`/days/${day.id}`)}
                className={`group flex w-[48rem] cursor-pointer items-center space-y-4 border-b-2 border-slate-300 dark:border-slate-500 ${
                  index % 2 === 0
                    ? "bg-slate-50 dark:bg-slate-700"
                    : "bg-white dark:bg-slate-800"
                } py-2`}
              >
                <div className="ml-8 mr-auto flex w-96 flex-col items-start group-hover:text-sky-500 dark:group-hover:text-sky-400">
                  {formatDay(day.date)}
                  <Paragraph className=" group-hover:text-sky-500 dark:group-hover:text-sky-400">
                    {formatDateLong(day.date)}
                  </Paragraph>
                </div>

                <Paragraph className="ml-auto mr-8  pb-2 group-hover:text-sky-500 dark:group-hover:text-sky-400">
                  {day.shifts[0]?.start && (
                    <>
                      {formatTime(day.shifts[0]?.start)} -{" "}
                      {formatTime(day.shifts[0]?.end)}
                    </>
                  )}
                </Paragraph>
              </div>
            ))}
          </div>
        ) : (
          <Spinner className="mx-auto my-auto mr-96" />
        )}
        <div className="ml-4 mr-52">
          <Calendar
            value={value}
            view={"month"}
            maxDetail="year"
            className="h-fit"
            onChange={handleMonthChange}
          />
        </div>
      </div>
    </main>
  );
}
