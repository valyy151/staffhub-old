import { type Employee, api } from "~/utils/api";
import Heading from "../ui/Heading";
import { Button } from "../ui/Button";
import Paragraph from "../ui/Paragraph";
import "react-calendar/dist/Calendar.css";
import { useState } from "react";
import toast from "react-hot-toast";
import Calendar from "react-calendar";
import ScheduleTable from "./ScheduleTable";
import SearchEmployees from "./SearchEmployees";
import { type ShiftPreference } from "@prisma/client";
import { formatMonth } from "~/utils/dateFormatting";
import { calculateTotalMonthlyHours } from "~/utils/calculateHours";
import { generateYearArray, updateMonthData } from "~/utils/yearArray";
import { CalendarPlus } from "lucide-react";

interface ScheduleMakerProps {
  name: string;
  isOpen: boolean;
  employeeId: string;
  employees: Employee[];
  shiftPreferences: ShiftPreference[];

  setName: (name: string) => void;
  setEmployeeId: (id: string) => void;
  setIsOpen: (isOpen: boolean) => void;
  setShiftPreferences: (preferences: ShiftPreference[]) => void;
}

export default function ScheduleMaker({
  name,
  isOpen,
  setName,
  employees,
  setIsOpen,
  employeeId,
  setEmployeeId,
  shiftPreferences,
  setShiftPreferences,
}: ScheduleMakerProps) {
  const currentDate = new Date();
  const [value, setValue] = useState<Date>(currentDate);
  const [schedule, setSchedule] = useState<any[]>(updateMonthData(currentDate));

  const [yearArray, setYearArray] = useState(
    generateYearArray(currentDate.getFullYear())
  );

  function handleMonthChange(date: any) {
    setValue(date);
    const year = date.getFullYear();
    setYearArray(generateYearArray(year));
    setSchedule(() => updateMonthData(date));
  }

  const createShift = api.shift.createMany.useMutation({
    onSuccess: () => {
      toast.success("Schedule created!", {
        className: "text-xl",
      });
    },
    onError: () => {
      toast.error("Something went wrong.", {
        className: "text-xl",
      });
    },
  });

  const createDay = api.workDay.createMany.useMutation({
    onSuccess: () => {
      toast.success("Shifts created!", {
        className: "text-xl",
      });
    },
    onError: () => {
      toast.error("Something went wrong.", {
        className: "text-xl",
      });
    },
  });

  const { refetch } = api.workDay.yearExists.useQuery(
    {
      date: schedule[0]?.date,
    },
    { enabled: false }
  );

  function createSchedule() {
    if (!employeeId) {
      return toast("Please select an employee.", {
        className: "text-xl",
      });
    }

    refetch().then(({ data }) => {
      if (!data) {
        createDay.mutate(yearArray);
      }

      const filteredSchedule = schedule.filter(
        (shift) => shift.start && shift.end
      );

      if (filteredSchedule.length === 0) {
        return toast("Please write at least one shift.", {
          className: "text-xl",
        });
      }

      createShift.mutate({
        employeeId,
        schedule: filteredSchedule,
      });
    });
  }

  function checkPreferences() {
    if (shiftPreferences.length === 0) {
      return (
        name && (
          <Heading size={"sm"} className="mt-4">
            {name}{" "}
            <span className="font-normal">has no shift preferences.</span>
          </Heading>
        )
      );
    }

    return (
      <div className="mt-4 flex items-baseline">
        <Heading size={"sm"}>Shift preferences:</Heading>

        {shiftPreferences.map((preference) => (
          <Paragraph size={"lg"} className="m-0 ml-2">
            {preference.content}
          </Paragraph>
        ))}
      </div>
    );
  }

  return (
    <main className="mt-8 flex space-x-8">
      <section className="mt-11 flex flex-col items-center">
        <SearchEmployees
          name={name}
          isOpen={isOpen}
          setName={setName}
          employees={employees}
          setIsOpen={setIsOpen}
          setEmployeeId={setEmployeeId}
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
            className="mt-2 h-14 w-full text-2xl"
            onClick={createSchedule}
          >
            <CalendarPlus size={28} className="mr-2" /> Create Schedule{" "}
          </Button>
        )}
      </section>
      <section>
        {name && schedule ? (
          <div className="flex justify-between">
            <Heading size={"sm"} className="mb-2 ml-4">
              {value.toLocaleDateString("en-GB", {
                month: "long",
                year: "numeric",
              })}
            </Heading>

            <div className="flex items-baseline justify-end">
              <Heading size={"sm"} className="mb-2 mr-2">
                {name}
              </Heading>

              <Heading size={"xs"} className="mb-2 mr-8 text-left font-normal">
                will work{" "}
                <span className="font-bold">
                  {calculateTotalMonthlyHours(schedule)}
                </span>{" "}
                hours in{" "}
                <span className="font-bold">
                  {formatMonth(schedule[0].date)}
                </span>
              </Heading>
            </div>
          </div>
        ) : (
          <Heading size={"sm"} className="mb-2 ml-4">
            {value.toLocaleDateString("en-GB", {
              month: "long",
              year: "numeric",
            })}
          </Heading>
        )}
        <ScheduleTable data={schedule} setData={setSchedule} />
        {checkPreferences()}
      </section>
    </main>
  );
}
