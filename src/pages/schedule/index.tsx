import router from "next/router";
import { useState } from "react";
import { api } from "~/utils/api";
import toast from "react-hot-toast";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import Heading from "~/components/ui/Heading";
import Spinner from "~/components/ui/Spinner";
import { Button } from "~/components/ui/Button";
import Paragraph from "~/components/ui/Paragraph";
import { formatMonth } from "~/utils/dateFormatting";
import { type ShiftPreference } from "@prisma/client";
import { CalendarPlus, Info, UserPlus } from "lucide-react";
import ScheduleTable from "~/components/Schedule/ScheduleTable";
import SearchEmployees from "~/components/Schedule/SearchEmployees";
import { calculateTotalMonthlyHours } from "~/utils/calculateHours";
import { generateYearArray, updateMonthData } from "~/utils/yearArray";

export default function NewSchedulePage() {
  const [name, setName] = useState<string>("");
  const [employeeId, setEmployeeId] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [shiftPreferences, setShiftPreferences] = useState<ShiftPreference[]>(
    []
  );

  const currentDate = new Date();
  const [value, setValue] = useState<Date>(currentDate);
  const [schedule, setSchedule] = useState<any[]>(updateMonthData(currentDate));

  const [yearArray, setYearArray] = useState(
    generateYearArray(currentDate.getFullYear())
  );

  const { data } = api.employee.find.useQuery();

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
      toast.success("Schedule created!", {
        className: "text-xl",
      });
    },
    onError: () => {
      toast.error("Something went wrong with creating work days.", {
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

  function handleMonthChange(date: any) {
    setValue(date);
    const year = date.getFullYear();
    setYearArray(generateYearArray(year));
    setSchedule(() => updateMonthData(date));
  }

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
          <Heading size={"sm"} className="ml-4 mt-4">
            {name} has no shift preferences.
          </Heading>
        )
      );
    }

    return (
      <div className="ml-4 mt-4 flex items-baseline">
        <Heading size={"sm"}>Shift preferences:</Heading>

        {shiftPreferences.map((preference) => (
          <Paragraph size={"lg"} className="m-0 ml-2">
            {preference.content}
          </Paragraph>
        ))}
      </div>
    );
  }

  if (!data) {
    return <Spinner />;
  }

  if (data.length === 0) {
    return (
      <main className="flex flex-col items-center">
        <Heading className="mt-6" size={"sm"}>
          You do not currently have any employees on your account to create a
          schedule.
        </Heading>
        <Heading size={"xs"} className="mt-2">
          Click below if you wish to create an employee.
        </Heading>
        <Button
          size={"lg"}
          className="mt-4 h-14 text-2xl"
          onClick={() => router.push("/employees/new")}
        >
          <UserPlus size={30} className="mr-2" /> New Employee
        </Button>
      </main>
    );
  }

  return (
    <main onClick={() => isOpen && setIsOpen(false)}>
      <section className="mt-4 flex justify-evenly">
        <div className="mt-16 flex flex-col">
          <SearchEmployees
            name={name}
            isOpen={isOpen}
            setName={setName}
            employees={data}
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

          <Button
            size={"lg"}
            title="Create schedule"
            className="mt-2 h-14 w-full text-2xl"
            onClick={createSchedule}
          >
            <CalendarPlus size={28} className="mr-2" /> Create Schedule{" "}
          </Button>
          <Button
            size={"lg"}
            variant={"subtle"}
            title="How do I make a schedule?"
            className="mt-2 h-14 w-full text-xl"
          >
            <Info size={28} className="mr-2" /> How do I write a schedule?
          </Button>
        </div>
        <div>
          {name && schedule ? (
            <div className="mb-2 mt-4 flex justify-between">
              <Heading className="ml-4">
                {value.toLocaleDateString("en-GB", {
                  month: "long",
                  year: "numeric",
                })}
              </Heading>

              <div className="flex items-baseline justify-end">
                <Heading className="mr-2">{name}</Heading>

                <Heading className="mr-8 text-left font-normal">
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
            <Heading className="mb-2 ml-4 mt-4">
              {value.toLocaleDateString("en-GB", {
                month: "long",
                year: "numeric",
              })}
            </Heading>
          )}
          <ScheduleTable data={schedule} setData={setSchedule} />
          {checkPreferences()}
        </div>
      </section>
    </main>
  );
}
