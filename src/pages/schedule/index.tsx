import Head from "next/head";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Employee, api } from "~/utils/api";
import { getSession } from "next-auth/react";
import sentences from "~/data/schedule.json";
import Heading from "@/components/ui/heading";
import Spinner from "@/components/ui/spinner";
import InfoModal from "@/components/ui/info-modal";
import { type GetServerSideProps } from "next/types";
import { CalendarIcon, CalendarPlus, Info, UserPlus, X } from "lucide-react";
import ScheduleTable from "@/components/Schedule/ScheduleTable";
import { formatMonth, formatTime } from "~/utils/dateFormatting";
import { generateYearArray, updateMonthData } from "~/utils/yearArray";
import { findSickLeaveDays, findVacationDays } from "~/utils/checkAbsence";
import router from "next/router";
import ReactModal from "react-modal";
import { Button } from "@/components/ui/button";
import { calculateTotalMonthlyHours } from "~/utils/calculateHours";
import Link from "next/link";
import SelectEmployee from "@/components/Schedule/SelectEmployee";

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

  const [showCalendar, setShowCalendar] = useState<boolean>(false);

  const [showModal, setShowModal] = useState(false);

  const { data } = api.employee.find.useQuery();

  const { data: shiftModels } = api.shiftModel.find.useQuery();

  const { toast } = useToast();

  const createShift = api.shift.createMany.useMutation({
    onSuccess: () => {
      toast({
        title: "Schedule created successfully.",
      });
    },
    onError: () => {
      toast({
        title: "There was a problem creating the schedule.",
        variant: "destructive",
      });
    },
  });

  const createDay = api.workDay.createMany.useMutation();

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
      return toast({
        title: "Please select an employee.",
      });
    }

    refetch().then(({ data }) => {
      if (!data) {
        createDay.mutate(yearArray);
      }

      const filteredSchedule: any = schedule.filter(
        (shift) => shift.start && shift.end
      );

      if (filteredSchedule.length === 0) {
        return toast({
          title: "Please select a shift.",
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
        <Head>
          <title>Create Schedule | StaffHub</title>
          <meta
            name="Create Schedule"
            content="Create a schedule for your staff."
          />
        </Head>
        <Heading className="mt-6" size={"xs"}>
          You do not currently have any employees on your account to create a
          schedule.
        </Heading>
        <Heading size={"xxs"} className="mt-2">
          Click below if you wish to create an employee.
        </Heading>
        <Button
          size={"lg"}
          className="mt-4"
          onClick={() => router.push("/staff/new")}
        >
          <UserPlus className="mr-2" /> New Employee
        </Button>
      </main>
    );
  }

  const sickDays = findSickLeaveDays(employee.sickLeaves, schedule);
  const vacationDays = findVacationDays(employee.vacations, schedule);

  return (
    <main onClick={() => isOpen && setIsOpen(false)} className="p-4">
      <Head>
        <title>Create Schedule | StaffHub</title>
        <meta
          name="Create Schedule"
          content="Create a schedule for your staff."
        />
      </Head>
      <section className="flex">
        <div className="flex">
          <div>
            {employee.name && schedule ? (
              <div className="mb-4 flex justify-between">
                <Heading size={"xs"}>
                  {value.toLocaleDateString("en-GB", {
                    month: "long",
                    year: "numeric",
                  })}
                </Heading>

                <div className="flex items-baseline justify-end">
                  <Heading
                    size={"xxs"}
                    onClick={() => router.push(`/staff/${employee.id}`)}
                    className="mr-2 cursor-pointer underline-offset-8 hover:text-sky-400 hover:underline"
                  >
                    {employee.name}
                  </Heading>

                  <Heading size={"xxs"} className="text-left font-normal">
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
              <div className="mb-4 flex justify-between">
                <Heading size={"xs"}>
                  {value.toLocaleDateString("en-GB", {
                    month: "long",
                    year: "numeric",
                  })}
                </Heading>
                <Heading size={"xxs"} className="mr-2">
                  No employee selected
                </Heading>
              </div>
            )}
            <ScheduleTable
              shift={shift}
              data={schedule}
              sickDays={sickDays}
              setData={setSchedule}
              vacationDays={vacationDays}
            />
          </div>

          <div className="relative ml-12">
            <div className="fixed">
              <SelectEmployee
                employees={data}
                employee={employee}
                setEmployee={setEmployee}
              />
              {employee.name && (
                <div className="mt-2 flex flex-col items-baseline">
                  <Heading size={"xs"}>Shift Preferences</Heading>
                  <div className="flex">
                    {employee.schedulePreference?.shiftModels.length! > 0 ? (
                      employee.schedulePreference?.shiftModels
                        ?.sort((a, b) => a.start - b.start)
                        .map((item) => (
                          <Heading
                            size={"xxs"}
                            key={item.id}
                            className="mx-2 my-1 font-normal"
                          >
                            {formatTime(item.start)} - {formatTime(item.end)}
                          </Heading>
                        ))
                    ) : (
                      <Heading
                        size={"xxs"}
                        className="mr-4 text-left font-normal"
                      >
                        No shift models set
                      </Heading>
                    )}
                  </div>
                </div>
              )}
              <div className="flex flex-col pt-2">
                {shiftModels?.length! > 0 && (
                  <>
                    <Heading size={"xs"}>Select a shift</Heading>
                    <div className="flex">
                      {shiftModels?.map((model) => (
                        <Heading
                          size={"xxs"}
                          key={model.id}
                          onClick={() => {
                            shift ===
                            `${formatTime(model.start)} - ${
                              formatTime(model.end) == "00:00"
                                ? "24:00"
                                : formatTime(model.end)
                            }`
                              ? setShift("")
                              : setShift(
                                  `${formatTime(model.start)} - ${
                                    formatTime(model.end) == "00:00"
                                      ? "24:00"
                                      : formatTime(model.end)
                                  }`
                                );
                          }}
                          className={`m-1 cursor-pointer text-left font-medium hover:text-sky-400 ${
                            shift ===
                            `${formatTime(model.start)} - ${
                              formatTime(model.end) == "00:00"
                                ? "24:00"
                                : formatTime(model.end)
                            }`
                              ? "text-sky-400 underline underline-offset-8"
                              : ""
                          }`}
                        >
                          [{formatTime(model.start)} - {formatTime(model.end)}]
                        </Heading>
                      ))}
                    </div>
                  </>
                )}
              </div>
              {employee.schedulePreference?.hoursPerMonth! > 0 && (
                <>
                  <Heading size={"xs"}>Hours per month</Heading>
                  <Heading size={"xxs"} className="font-normal">
                    <span>
                      {calculateTotalMonthlyHours(
                        schedule,
                        vacationDays.length
                      )}
                    </span>{" "}
                    / {employee.schedulePreference?.hoursPerMonth} hours per
                    month
                  </Heading>
                </>
              )}
              <div className="flex w-fit flex-col space-y-1 pt-4">
                <Button title="Create schedule" onClick={createSchedule}>
                  <CalendarPlus className="mr-2" /> Submit
                </Button>
                <Button
                  variant={"subtle"}
                  title="How do I make a schedule?"
                  onClick={() => setShowModal(true)}
                >
                  <Info className="mr-2" /> How do I write a schedule?
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div
        onClick={() => setShowCalendar(true)}
        className="fixed bottom-4 right-4 cursor-pointer rounded-full bg-primary p-4 active:scale-95"
      >
        <CalendarIcon size={48} className="text-secondary" />
      </div>
      {showCalendar && (
        <ReactModal
          isOpen={showCalendar}
          className="fixed inset-0 flex items-center justify-center bg-[rgba(16,17,30,0.7)]"
        >
          <div className="animate-fade dark:bg-gray-750 mx-auto min-w-[26rem] max-w-3xl rounded-xl border  bg-background px-2 pb-6  pt-2 text-left shadow-lg">
            <div className="flex">
              <div className="ml-auto">
                {" "}
                <Button
                  variant={"ghost"}
                  onClick={() => setShowCalendar(false)}
                  className="hover:bg-transparent dark:hover:bg-transparent"
                >
                  <X size={30} />
                </Button>
              </div>
            </div>

            <div className="flex flex-col px-8 py-2">
              <Heading size={"xs"} className="mb-1 ml-1">
                Choose a month
              </Heading>
              <Calendar
                view="month"
                maxDetail="year"
                next2Label={null}
                prev2Label={null}
                onChange={(value: any) => {
                  setValue(value);
                  handleMonthChange(value);
                  setShowCalendar(false);
                }}
              />
            </div>
          </div>
        </ReactModal>
      )}
      {showModal && (
        <InfoModal
          text={sentences}
          close={() => setShowModal(false)}
          heading="How do I write a schedule?"
        />
      )}
    </main>
  );
}
