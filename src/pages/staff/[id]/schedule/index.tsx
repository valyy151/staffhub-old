import "react-calendar/dist/Calendar.css";

import dynamic from "next/dynamic";
import Link from "next/link";
import router from "next/router";
import { useEffect, useState } from "react";
import { Calendar } from "react-calendar";
import { api, EmployeeProfile } from "~/utils/api";
import { calculateTotalHours } from "~/utils/calculateHours";
import { findSickLeaveDays, findVacationDays } from "~/utils/checkAbsence";
import {
  formatDateLong,
  formatDay,
  formatTime,
  formatTotal,
  getMonthBoundaryTimestamps,
} from "~/utils/dateFormatting";

import Sidebar from "@/components/Staff/Sidebar";
import Heading from "@/components/ui/heading";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const PDFButton = dynamic(() => import("@/components/PDFButton"), {
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

  const { data: employees } = api.employee.find.useQuery();

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
      <Sidebar employee={employee} employees={employees} />
      <div className="mt-4 flex">
        <section>
          <Heading size={"xs"} className="mb-4 ml-2 ">
            {month} - {calculateTotalHours(employee?.workDays)} hours
          </Heading>

          <Table className="min-w-[35vw] grow border">
            <TableHeader>
              <TableRow>
                <TableHead className="border-r">Date</TableHead>
                <TableHead className="border-r">Shift</TableHead>
                <TableHead className="text-right">Day</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employee?.workDays.map((day) => (
                <TableRow key={day.id}>
                  <TableCell className="flex space-x-4 border-r font-medium">
                    <Link
                      href={`/days/${day.id}/shifts`}
                      className={`underline-offset-2 hover:underline ${
                        (new Date(day.date * 1000).toLocaleDateString("en-GB", {
                          weekday: "short",
                        }) === "Sat" &&
                          "font-bold text-rose-500") ||
                        (new Date(day.date * 1000).toLocaleDateString("en-GB", {
                          weekday: "short",
                        }) === "Sun" &&
                          "font-bold text-rose-500")
                      }`}
                    >
                      {formatDateLong(day.date)}
                    </Link>
                  </TableCell>

                  <TableCell className="border-r">
                    {!day.shifts[0]?.start && day.vacation && (
                      <span className="italic group-hover:text-gray-800 dark:group-hover:text-gray-300">
                        Vacation
                      </span>
                    )}
                    {!day.shifts[0]?.start && day.sickLeave && (
                      <span className="italic group-hover:text-gray-800 dark:group-hover:text-gray-300">
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
                  <TableCell
                    className={`text-right ${
                      (new Date(day.date * 1000).toLocaleDateString("en-GB", {
                        weekday: "short",
                      }) === "Sat" &&
                        "font-bold text-rose-500") ||
                      (new Date(day.date * 1000).toLocaleDateString("en-GB", {
                        weekday: "short",
                      }) === "Sun" &&
                        "font-bold text-rose-500")
                    }`}
                  >
                    {new Date(day.date * 1000).toLocaleDateString("en-GB", {
                      weekday: "short",
                    })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </section>

        <div className="relative ml-8 mt-12">
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
