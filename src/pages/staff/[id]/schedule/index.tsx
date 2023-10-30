import 'react-calendar/dist/Calendar.css';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import router from 'next/router';
import { useEffect, useState } from 'react';
import { Calendar } from 'react-calendar';
import { api, EmployeeProfile } from '~/utils/api';
import { calculateTotalHours } from '~/utils/calculateHours';
import { findSickLeaveDays, findVacationDays } from '~/utils/checkAbsence';
import { formatDateLong, getMonthBoundaryTimestamps } from '~/utils/dateFormatting';

import Shift from '@/components/Staff/Shift';
import Sidebar from '@/components/Staff/Sidebar';
import Heading from '@/components/ui/heading';
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';

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
  const [value, setValue] = useState<any>(new Date());

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
    fetchShiftModels: true,
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

  if (!employee) {
    return <Sidebar />;
  }

  return (
    <main className="flex">
      <Sidebar employee={employee} employees={employees} />
      <div className="mt-4 flex">
        <section>
          <Heading size={"xs"} className="mb-4 ml-2">
            {employee?.name}, {month} -{" "}
            {calculateTotalHours(employee?.workDays)} hours
          </Heading>
          <div className="max-h-[82vh] overflow-y-scroll border">
            <Table className="min-w-[40vw]">
              <TableHeader className="sticky top-0 bg-background shadow shadow-border dark:shadow-md dark:shadow-border">
                <TableHead className="border-r">Day</TableHead>
                <TableHead className="border-r">Date</TableHead>
                <TableHead className="text-right">Shift</TableHead>
              </TableHeader>
              <TableBody>
                {employee?.workDays.map((day) => (
                  <TableRow key={day.id} className="hover:bg-inherit">
                    <TableCell
                      className={`border-r ${
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
                      <Link
                        href={`/days/${day.id}/shifts`}
                        className={`py-3 pr-2 underline-offset-2 hover:underline`}
                      >
                        {new Date(day.date * 1000).toLocaleDateString("en-GB", {
                          weekday: "short",
                        })}
                      </Link>
                    </TableCell>
                    <TableCell
                      className={`border-r font-medium  ${
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
                      <Link
                        href={`/days/${day.id}/shifts`}
                        className={`py-3 pr-2 underline-offset-2 hover:underline`}
                      >
                        {formatDateLong(day.date)}
                      </Link>
                    </TableCell>

                    <Shift employee={employee} day={day} />
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>

        <div className="relative ml-8 mt-12">
          <Calendar
            value={value}
            view={"month"}
            maxDetail="year"
            className="h-fit"
            next2Label={null}
            prev2Label={null}
            activeStartDate={value}
            onChange={(value) => setValue(value)}
          />
          <PDFButton employee={employee} value={value} month={month} />
        </div>
      </div>
    </main>
  );
}
