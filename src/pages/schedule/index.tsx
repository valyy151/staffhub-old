import router from "next/router";
import { useState } from "react";
import { Employee, api } from "~/utils/api";
import toast from "react-hot-toast";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { getSession } from "next-auth/react";
import Heading from "~/components/ui/Heading";
import Spinner from "~/components/ui/Spinner";
import { Button } from "~/components/ui/Button";
import { formatMonth, formatTime } from "~/utils/dateFormatting";
import { type GetServerSideProps } from "next/types";
import { CalendarPlus, Info, UserPlus, X } from "lucide-react";
import ScheduleTable from "~/components/Schedule/ScheduleTable";
import sentences from "~/data/schedule.json";
import SearchEmployees from "~/components/Schedule/SearchEmployees";
import {
  calculateTotalMonthlyHours,
  isTimeGreaterThanTotalHours,
} from "~/utils/calculateHours";
import { generateYearArray, updateMonthData } from "~/utils/yearArray";
import { findSickLeaveDays, findVacationDays } from "~/utils/checkAbsence";
import InfoModal from "~/components/ui/InfoModal";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx);

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
};

export default function NewSchedulePage() {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const currentDate = new Date();

  const [value, setValue] = useState<Date>(currentDate);
  const [schedule, setSchedule] = useState<
    {
      date: number;
      end?: number;
      start?: number;
    }[]
  >(updateMonthData(currentDate));

  const [shift, setShift] = useState<string>();

  const [yearArray, setYearArray] = useState(
    generateYearArray(currentDate.getFullYear())
  );

  const [employee, setEmployee] = useState<Employee>({} as Employee);

  const [showModal, setShowModal] = useState(false);

  const { data } = api.employee.find.useQuery();

  const createShift = api.shift.createMany.useMutation({
    onSuccess: () => {
      toast.success("Schedule created!");
    },
    onError: () => {
      toast.error("Something went wrong.");
      InfoModal;
    },
  });

  const createDay = api.workDay.createMany.useMutation({
    onSuccess: () => {
      toast.success("Yearly work days created!");
    },
    onError: () => {
      toast.error("Something went wrong with creating work days.");
    },
  });

  const { refetch } = api.workDay.yearExists.useQuery(
    {
      date: schedule[0]?.date!,
    },
    { enabled: false }
  );

  function handleMonthChange(date: any) {
    setValue(date);
    const year = date.getFullYear();
    setYearArray(generateYearArray(year));
    setSchedule(updateMonthData(date));
  }

  function createSchedule() {
    if (!employee.id) {
      return toast("Please select an employee.");
    }

    refetch().then(({ data }) => {
      if (!data) {
        createDay.mutate(yearArray);
      }

      const filteredSchedule: any = schedule.filter(
        (shift) => shift.start && shift.end
      );

      if (filteredSchedule.length === 0) {
        return toast("Please write at least one shift.", {
          className: "text-xl",
        });
      }

      createShift.mutate({
        employeeId: employee.id,
        schedule: filteredSchedule,
      });
    });
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
          onClick={() => router.push("/staff/new")}
        >
          <UserPlus size={30} className="mr-2" /> New Employee
        </Button>
      </main>
    );
  }

  const sickDays = findSickLeaveDays(employee.sickLeaves, schedule);
  const vacationDays = findVacationDays(employee.vacations, schedule);

  return (
    <main onClick={() => isOpen && setIsOpen(false)}>
      <section className="mt-4 flex justify-evenly">
        <div className="mt-16 flex flex-col">
          <SearchEmployees
            isOpen={isOpen}
            employees={data}
            employee={employee}
            setIsOpen={setIsOpen}
            setEmployee={setEmployee}
          />
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

          <Button
            size={"lg"}
            title="Create schedule"
            className="mt-2 h-16 w-full text-3xl"
            onClick={createSchedule}
          >
            <CalendarPlus size={30} className="mr-2" /> Create Schedule{" "}
          </Button>
          <Button
            size={"lg"}
            variant={"subtle"}
            title="How do I make a schedule?"
            className="mt-2 h-16 w-full text-xl"
            onClick={() => setShowModal(true)}
          >
            <Info size={28} className="mr-2" /> How do I write a schedule?
          </Button>
        </div>
        <div>
          {employee.name && schedule ? (
            <div className="mb-2 mt-4 flex justify-between">
              <Heading className="ml-4">
                {value.toLocaleDateString("en-GB", {
                  month: "long",
                  year: "numeric",
                })}
              </Heading>

              <div className="flex items-baseline justify-end">
                <Heading
                  onClick={() => router.push(`/staff/${employee.id}`)}
                  className="mr-2 cursor-pointer underline-offset-8 hover:text-sky-400 hover:underline"
                >
                  {employee.name}
                </Heading>

                <Heading className="mr-8 text-left font-normal">
                  will work{" "}
                  <span className="font-bold">
                    {calculateTotalMonthlyHours(
                      schedule,
                      vacationDays.length,
                      sickDays.length
                    )}
                  </span>{" "}
                  in{" "}
                  <span className="font-bold">
                    {formatMonth(schedule[0]!.date)}
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
          <ScheduleTable
            shift={shift}
            data={schedule}
            sickDays={sickDays}
            setData={setSchedule}
            vacationDays={vacationDays}
          />

          {employee.name && (
            <div className="mt-2 flex items-baseline">
              <Heading
                className="mr-4 cursor-pointer underline-offset-8 hover:text-sky-400 hover:underline"
                onClick={() => router.push(`/staff/${employee.id}/preferences`)}
              >
                Schedule Preference:
              </Heading>

              {employee.schedulePreference?.shiftModels.length! > 1 ? (
                employee.schedulePreference?.shiftModels
                  ?.sort((a, b) => a.start - b.start)
                  .map((item) => (
                    <Heading
                      size={"xs"}
                      key={item.id}
                      onClick={() => {
                        shift ===
                        `${formatTime(item.start)} - ${
                          formatTime(item.end) == "00:00"
                            ? "24:00"
                            : formatTime(item.end)
                        }`
                          ? setShift("")
                          : setShift(
                              `${formatTime(item.start)} - ${
                                formatTime(item.end) == "00:00"
                                  ? "24:00"
                                  : formatTime(item.end)
                              }`
                            );
                      }}
                      className={`mr-4 cursor-pointer text-left font-normal hover:text-sky-400 ${
                        shift ===
                        `${formatTime(item.start)} - ${
                          formatTime(item.end) == "00:00"
                            ? "24:00"
                            : formatTime(item.end)
                        }`
                          ? "text-sky-400 underline underline-offset-8"
                          : ""
                      }`}
                    >
                      [{formatTime(item.start)} - {formatTime(item.end)}]
                    </Heading>
                  ))
              ) : (
                <Heading size={"sm"} className="mr-4 text-left font-normal">
                  No shift models set
                </Heading>
              )}

              {employee.schedulePreference?.hoursPerMonth! > 0 ? (
                <Heading className="ml-auto font-normal">
                  <span
                    className={`${
                      isTimeGreaterThanTotalHours(
                        calculateTotalMonthlyHours(
                          schedule,
                          vacationDays.length
                        ),
                        employee.schedulePreference?.hoursPerMonth!
                      )
                        ? "text-emerald-500"
                        : "text-yellow-500 dark:text-yellow-300"
                    }`}
                  >
                    {calculateTotalMonthlyHours(schedule, vacationDays.length)}
                  </span>{" "}
                  / {employee.schedulePreference?.hoursPerMonth} hours per month
                </Heading>
              ) : (
                <Heading className="ml-auto font-normal">
                  No monthly hours set
                </Heading>
              )}
            </div>
          )}
        </div>
      </section>

      {showModal && (
        <InfoModal
          text={sentences}
          showModal={showModal}
          close={() => setShowModal(false)}
          heading="How do I write a schedule?"
        />
      )}
    </main>
  );
}
