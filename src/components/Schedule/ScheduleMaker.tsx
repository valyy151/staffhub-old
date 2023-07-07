import { Check } from "lucide-react";
import { Calendar } from "react-calendar";
import "react-calendar/dist/Calendar.css";
import Paragraph from "../ui/Paragraph";
import { calculateTotalMonthlyHours } from "~/utils/calculateHours";
import { formatDate, formatMonth } from "~/utils/dateFormatting";
import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import Heading from "../ui/Heading";
import { Button } from "../ui/Button";
import ScheduleTable from "./ScheduleTable";
import SearchEmployees from "./SearchEmployees";
import { Employee } from "@prisma/client";
import { api } from "~/utils/api";

interface ScheduleMakerProps {
  id: string;
  name: string;
  isOpen: boolean;
  employees: Employee[];
  shiftPreferences: string[];
  setId: Dispatch<SetStateAction<string>>;
  setName: Dispatch<SetStateAction<string>>;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  setShiftPreferences: Dispatch<SetStateAction<string[]>>;
}

interface WorkDay {
  start?: number;
  end?: number;
  total?: number;
  date: number;
}

export default function ScheduleMaker({
  id,
  name,
  employees,
  setName,
  setId,
  isOpen,
  setIsOpen,
  shiftPreferences,
  setShiftPreferences,
}: ScheduleMakerProps) {
  const currentDate = new Date();
  const [value, setValue] = useState<Date | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [schedule, setSchedule] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [mergedData, setMergedData] = useState<WorkDay[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [yearArray, setYearArray] = useState<{ date: number }[]>([]);

  const [month, setMonth] = useState(() => {
    const month = currentDate.getMonth() + 2;
    return `${currentDate.getFullYear()}-${month < 10 ? `0${month}` : month}`;
  });

  useEffect(() => {
    setMergedData(mergeObjectsByDate(yearArray, schedule));
  }, [schedule]);

  const createShift = api.shift.create.useMutation({
    onSuccess: (createdShift) => {
      console.log(createdShift);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const createDay = api.workDay.create.useMutation({
    onSuccess: (createdDay) => {
      console.log(createdDay);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  async function createSchedule() {
    yearArray.forEach((day) => {
      createDay.mutate({
        date: day.date,
      });
    });

    schedule.forEach((day) => {
      if (day.start && day.end) {
        createShift.mutate({
          end: day.end,
          date: day.date,
          start: day.start,
          employeeId: id,
        });
      }
    });
  }

  const handleMonthChange: any = (date: Date) => {
    setValue(date);
    const year = date.getFullYear();
    setYearArray(generateYearArray(year));

    const month = date.getMonth() + 1;
    setMonth(`${year}-${month < 10 ? `0${month}` : month}`);
    setSchedule(() => updateMonthData(date));
  };

  const updateMonthData = (date: Date): WorkDay[] => {
    const year = date.getFullYear();

    const monthIndex = date.getMonth();
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

    const data: WorkDay[] = new Array(daysInMonth)
      .fill(null)
      .map((_, index) => {
        const day = index + 1;
        const dateUnixTimestamp =
          new Date(year, monthIndex, day).getTime() / 1000;

        return {
          date: dateUnixTimestamp,
        };
      });
    return data;
  };

  const generateYearArray = (year: number) => {
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
  };

  const isLeapYear = (year: number) => {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  };

  const mergeObjectsByDate = (
    yearArray: { date: number }[],
    monthArray: WorkDay[]
  ) => {
    const mergedArray = yearArray.map((obj1) => {
      const obj2 = monthArray.find(
        (obj) => formatDate(obj.date) === formatDate(obj1.date)
      );
      if (obj2) {
        return { ...obj1, ...obj2 };
      }
      return obj1;
    });

    return mergedArray;
  };

  return (
    <main className="flex flex-row justify-evenly space-x-6 p-0">
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
            loading={loading}
            title="Create schedule"
            className="text-md mr-auto mt-[1.6rem]"
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
                      {preference}
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
          <Heading className="mt-48 text-center font-normal text-slate-500 dark:text-slate-400">
            Pick a month and an employee.
          </Heading>
        )}
      </div>
    </main>
  );
}
