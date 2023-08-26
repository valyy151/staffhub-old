import {
  formatDateLong,
  formatDay,
  formatTime,
  formatTotal,
  getMonthBoundaryTimestamps,
} from "~/utils/dateFormatting";
import { useState, useEffect } from "react";
import router from "next/router";
import { EmployeeProfile, api } from "~/utils/api";
import dynamic from "next/dynamic";
import "react-calendar/dist/Calendar.css";
import { Calendar } from "react-calendar";
import Heading from "~/components/ui/Heading";
import Paragraph from "~/components/ui/Paragraph";
import Sidebar from "~/components/Staff/Sidebar";
import { calculateTotalHours } from "~/utils/calculateHours";
import { findSickLeaveDays, findVacationDays } from "~/utils/checkAbsence";

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

  const [startOfMonth, endOfMonth] = getMonthBoundaryTimestamps(value);
  const [month, setMonth] = useState<string>(
    value.toLocaleDateString("en-GB", {
      month: "long",
      year: "numeric",
    })
  );

  const { data, failureReason } = api.employee?.findOne.useQuery({
    id: query.id,
    endOfMonth,
    startOfMonth,
  });

  if (failureReason?.data?.httpStatus === 401) {
    router.push("/");
  }

  const [employee, setEmployee] = useState<EmployeeProfile | undefined>(data);

  useEffect(() => {
    if (data) {
      const sickDays = findSickLeaveDays(data?.sickLeaves, data?.workDays);
      const vacationDays = findVacationDays(data?.vacations, data?.workDays);
      const newWorkDays: any = data?.workDays.map((day) => {
        if (vacationDays.includes(day.date)) {
          day.vacation = true;
        }

        if (sickDays.includes(day.date)) {
          day.sickLeave = true;
        }
        return day;
      });

      setEmployee({ ...data, workDays: newWorkDays });
      setMonth(
        value.toLocaleDateString("en-GB", {
          month: "long",
          year: "numeric",
        })
      );
    }
  }, [data]);

  function handleMonthChange(date: any) {
    setValue(date);
  }

  if (!employee) {
    return <Sidebar />;
  }

  return (
    <main className="flex">
      <Sidebar employee={employee} />
      <div className="mt-4 flex justify-end">
        <section>
          <Heading className="mb-2">Schedules for {employee?.name}</Heading>
          <div
            className={`ml-auto h-[41.6rem] w-[56rem] overflow-x-hidden overflow-y-scroll rounded border border-slate-300 bg-white shadow dark:border-slate-500 dark:bg-slate-800`}
          >
            <div className="flex min-h-[5.7rem] w-full items-center justify-between border-b-2 border-t border-slate-300 bg-white py-4 dark:border-slate-500 dark:bg-slate-800">
              <Heading size={"sm"} className="text-md ml-8">
                {month} ({employee && calculateTotalHours(employee?.workDays)}{" "}
                hours)
              </Heading>
              <PDFButton employee={employee} value={value} month={month} />
            </div>

            {employee?.workDays.map((day, index) => (
              <div
                key={day.id}
                onClick={() => router.push(`/days/${day.id}`)}
                className={`group flex cursor-pointer items-center space-y-4 border-b-2 border-slate-300 dark:border-slate-500 ${
                  index % 2 === 0
                    ? "bg-slate-50 dark:bg-slate-700"
                    : "bg-white dark:bg-slate-800"
                } py-2`}
              >
                <div className="group ml-8 mr-auto flex w-96 flex-col items-start">
                  <Paragraph
                    size={"lg"}
                    className="m-0 group-hover:text-sky-500 dark:group-hover:text-sky-400"
                  >
                    {formatDay(day.date)}
                  </Paragraph>
                  <Paragraph
                    size={"lg"}
                    className="m-0 font-bold group-hover:text-sky-500 dark:group-hover:text-sky-400"
                  >
                    {formatDateLong(day.date)}
                  </Paragraph>
                </div>

                <Paragraph
                  size={"lg"}
                  className="m-0 ml-auto mr-8 pb-2 font-bold group-hover:text-sky-500 dark:group-hover:text-sky-400"
                >
                  {!day.shifts[0]?.start && day.vacation && (
                    <span className="font-medium italic group-hover:text-slate-800 dark:group-hover:text-slate-300">
                      Vacation
                    </span>
                  )}
                  {!day.shifts[0]?.start && day.sickLeave && (
                    <span className="font-medium italic group-hover:text-slate-800 dark:group-hover:text-slate-300">
                      Sick
                    </span>
                  )}
                  {day.shifts[0]?.start && (
                    <>
                      {formatTime(day.shifts[0]?.start)} -{" "}
                      {formatTime(day.shifts[0]?.end)}{" "}
                      <span className="font-normal">
                        [{" "}
                        {formatTotal(day.shifts[0]?.start, day.shifts[0]?.end)}]
                      </span>{" "}
                    </>
                  )}
                </Paragraph>
              </div>
            ))}
          </div>
        </section>

        <div className="ml-4 mr-52 mt-12">
          <Calendar
            value={value}
            view={"month"}
            maxDetail="year"
            className="h-fit"
            next2Label={null}
            prev2Label={null}
            activeStartDate={value}
            onChange={handleMonthChange}
          />
        </div>
      </div>
    </main>
  );
}
