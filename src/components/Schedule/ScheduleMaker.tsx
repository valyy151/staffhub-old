import { Employee, api } from "~/utils/api";
import Heading from "../ui/Heading";
import { Button } from "../ui/Button";
import Paragraph from "../ui/Paragraph";
import "react-calendar/dist/Calendar.css";
import { useState } from "react";
import toast from "react-hot-toast";
import Calendar from "react-calendar";
import ScheduleTable from "./ScheduleTable";
import SearchEmployees from "./SearchEmployees";
import { ShiftPreference } from "@prisma/client";
import { formatMonth } from "~/utils/dateFormatting";
import { calculateTotalMonthlyHours } from "~/utils/calculateHours";

interface ScheduleMakerProps {
  id: string;
  name: string;
  isOpen: boolean;
  employees: Employee[];
  shiftPreferences: ShiftPreference[];

  setId: (id: string) => void;
  setName: (name: string) => void;
  setIsOpen: (isOpen: boolean) => void;
  setShiftPreferences: (preferences: ShiftPreference[]) => void;
}

export default function ScheduleMaker({
  id,
  name,
  setId,
  isOpen,
  setName,
  employees,
  setIsOpen,
  shiftPreferences,
  setShiftPreferences,
}: ScheduleMakerProps) {
  const currentDate = new Date();
  const [schedule, setSchedule] = useState<any[]>([]);
  const [value, setValue] = useState<Date | null>(null);
  const [yearArray, setYearArray] = useState<{ date: number }[]>([]);

  const [, setMonth] = useState(() => {
    const month = currentDate.getMonth() + 2;
    return `${currentDate.getFullYear()}-${month < 10 ? `0${month}` : month}`;
  });

  const createShift = api.shift.create.useMutation();

  const createDay = api.workDay.create.useMutation();

  const { data: yearExists } = api.workDay.yearExists.useQuery({
    date: schedule[0]?.date,
  });

  function createSchedule() {
    if (!yearExists) {
      createYearlyWorkDays();
    }

    createMonthlySchedule();
  }

  function createYearlyWorkDays() {
    Promise.all(
      yearArray.map((day) => {
        return createDay.mutate({
          date: day.date,
        });
      })
    ).then(() => {
      toast.success("Yearly work days created.");
    });
  }

  function createMonthlySchedule() {
    Promise.all(
      schedule.map((day) => {
        if (day.start && day.end) {
          createShift.mutate({
            end: day.end,
            date: day.date,
            start: day.start,
            employeeId: id,
          });
        }
      })
    ).then(() => {
      toast.success("Schedule created.");
    });
  }

  function handleMonthChange(date: any) {
    setValue(date);
    const year = date.getFullYear();
    setYearArray(generateYearArray(year));

    const month = date.getMonth() + 1;
    setMonth(`${year}-${month < 10 ? `0${month}` : month}`);
    setSchedule(() => updateMonthData(date));
  }

  function updateMonthData(date: Date) {
    const year = date.getFullYear();

    const monthIndex = date.getMonth();
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

    const data = new Array(daysInMonth).fill(null).map((_, index) => {
      const day = index + 1;
      const dateUnixTimestamp =
        new Date(year, monthIndex, day).getTime() / 1000;

      return {
        date: dateUnixTimestamp,
      };
    });
    return data;
  }

  function generateYearArray(year: number) {
    const daysInYear = 365 + (isLeapYear(year) ? 1 : 0);
    const startOfYear = new Date(year, 0, 1);
    const yearArray = [];

    for (let i = 0; i < daysInYear; i++) {
      const currentDate = new Date(
        startOfYear.getTime() + i * 24 * 60 * 60 * 1000
      );
      yearArray.push({ date: currentDate.getTime() / 1000 });
    }

    return yearArray;
  }

  function isLeapYear(year: number) {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  }

  return (
    <main className="flex space-x-6">
      <div className="mt-7 flex h-[44rem] flex-col items-center">
        <SearchEmployees
          name={name}
          setId={setId}
          isOpen={isOpen}
          setName={setName}
          employees={employees}
          setIsOpen={setIsOpen}
          setShiftPreferences={setShiftPreferences}
        />
        <Calendar
          value={value}
          view={"month"}
          maxDetail="year"
          className="h-fit"
          onChange={handleMonthChange}
        />
        {schedule.length > 0 && (
          <Button
            size={"lg"}
            title="Create schedule"
            className="mx-auto mt-[1.6rem] w-full text-xl font-medium tracking-wide"
            onClick={createSchedule}
          >
            Create Schedule{" "}
          </Button>
        )}
      </div>
      <div className="mt-8 h-[44rem] w-[82rem]">
        {schedule.length > 0 ? (
          <>
            {name && schedule ? (
              <div className="flex items-baseline justify-end">
                <Heading size={"sm"} className="mb-2 mr-2">
                  {name}
                </Heading>
                <Heading
                  size={"xs"}
                  className="mb-2 mr-8 text-left font-normal"
                >
                  will work{" "}
                  <span className="font-bold">
                    {calculateTotalMonthlyHours(schedule)}
                  </span>{" "}
                  hours in {formatMonth(schedule[0].date)}
                </Heading>
              </div>
            ) : (
              <Heading size={"sm"} className="mb-2 ml-8 text-left font-normal">
                Choose an employee.
              </Heading>
            )}
            <ScheduleTable data={schedule} setData={setSchedule} />
            {shiftPreferences.length > 0 ? (
              <div className="mt-4">
                <Heading
                  size={"xs"}
                  className="mx-auto mb-4 w-1/2 rounded-t-md border-b-2 border-slate-300 p-2 text-center dark:border-slate-500"
                >
                  Shift preferences:
                </Heading>
                <div className="flex flex-col items-center">
                  {shiftPreferences.map((preference) => (
                    <Paragraph className="mb-2 p-1 text-center font-normal">
                      {preference.content}
                    </Paragraph>
                  ))}
                </div>
              </div>
            ) : (
              name && (
                <Heading size={"xs"} className="mt-4 text-center font-normal">
                  This employee has no shift preferences.
                </Heading>
              )
            )}
          </>
        ) : (
          <Heading className="ml-48 mt-48 text-center font-normal text-slate-500 dark:text-slate-400">
            Pick a month and an employee.
          </Heading>
        )}
      </div>
    </main>
  );
}
