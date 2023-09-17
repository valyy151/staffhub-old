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
import Sidebar from "~/components/Staff/Sidebar";
import { calculateTotalHours } from "~/utils/calculateHours";
import { findSickLeaveDays, findVacationDays } from "~/utils/checkAbsence";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const PDFButton = dynamic(() => import("~/components/PDFButton"), {
  ssr: false,
});

type SchedulePageProps = {
  query: { id: string };
};

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
      <div className="mt-4 flex">
        <section>
          <Heading size={"xs"} className="mb-4 ml-2 ">
            {month} - {calculateTotalHours(employee?.workDays)} hours
          </Heading>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Day</TableHead>
                <TableHead className="text-right">Shift</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employee?.workDays.map((day, index) => (
                <TableRow key={day.id}>
                  <TableCell>
                    <Link
                      href={`/days/${day.id}/shifts`}
                      className="cursor-pointer font-medium hover:text-sky-500"
                    >
                      {formatDateLong(day.date)}
                    </Link>
                  </TableCell>
                  <TableCell>{formatDay(day.date)}</TableCell>
                  <TableCell className="text-right">
                    {!day.shifts[0]?.start && day.vacation && (
                      <span className="italic group-hover:text-slate-800 dark:group-hover:text-slate-300">
                        Vacation
                      </span>
                    )}
                    {!day.shifts[0]?.start && day.sickLeave && (
                      <span className="italic group-hover:text-slate-800 dark:group-hover:text-slate-300">
                        Sick
                      </span>
                    )}
                    {day.shifts[0]?.start && (
                      <>
                        {formatTime(day.shifts[0]?.start)} -{" "}
                        {formatTime(day.shifts[0]?.end)}{" "}
                        <span className="font-medium">
                          [{" "}
                          {formatTotal(
                            day.shifts[0]?.start,
                            day.shifts[0]?.end
                          )}
                          ]
                        </span>{" "}
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* {employee?.workDays.map((day, index) => (
            <Link
              key={day.id}
              href={`/days/${day.id}`}
              className={`group flex cursor-pointer items-center space-y-4 border-b-2 border-slate-300 dark:border-slate-500 ${
                index % 2 === 0
                  ? "bg-slate-50 dark:bg-slate-700"
                  : "bg-white dark:bg-slate-800"
              } py-2`}
            >
              <div className="group ml-8 mr-auto flex w-96 flex-col items-start">
                <Paragraph className="m-0 group-hover:text-sky-500 dark:group-hover:text-sky-400">
                  {formatDay(day.date)}
                </Paragraph>
                <Paragraph className="m-0 font-bold group-hover:text-sky-500 dark:group-hover:text-sky-400">
                  {formatDateLong(day.date)}
                </Paragraph>
              </div>

              <Paragraph className="m-0 ml-auto mr-8 pb-2 font-bold group-hover:text-sky-500 dark:group-hover:text-sky-400">
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
                      [ {formatTotal(day.shifts[0]?.start, day.shifts[0]?.end)}]
                    </span>{" "}
                  </>
                )}
              </Paragraph>
            </Link>
          ))} */}
        </section>

        <div></div>

        <div className="relative ml-8">
          <div className="fixed">
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
            <PDFButton employee={employee} value={value} month={month} />
          </div>
        </div>
      </div>
    </main>
  );
}
