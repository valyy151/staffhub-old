import Head from "next/head";
import {
  calculateTotalMonthlyHours,
  isTimeGreaterThanTotalHours,
} from "~/utils/calculateHours";
import router from "next/router";
import { useState } from "react";
import toast from "react-hot-toast";
import Calendar from "react-calendar";
import CalendarModal from "~/components/Dashboard/CalendarModal";
import "react-calendar/dist/Calendar.css";
import { Employee, api } from "~/utils/api";
import { getSession } from "next-auth/react";
import sentences from "~/data/schedule.json";
import Heading from "~/components/ui/Heading";
import Spinner from "~/components/ui/Spinner";
import { Button } from "~/components/ui/Button";
import InfoModal from "~/components/ui/InfoModal";
import { type GetServerSideProps } from "next/types";
import { CalendarIcon, CalendarPlus, Info, UserPlus, X } from "lucide-react";
import ScheduleTable from "~/components/Schedule/ScheduleTable";
import { formatMonth, formatTime } from "~/utils/dateFormatting";
import SearchEmployees from "~/components/Schedule/SearchEmployees";
import { generateYearArray, updateMonthData } from "~/utils/yearArray";
import { findSickLeaveDays, findVacationDays } from "~/utils/checkAbsence";
import ReactModal from "react-modal";

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
        <Head>
          <title>Create Schedule | StaffHub</title>
          <meta
            name="Create Schedule"
            content="Create a schedule for your staff."
          />
        </Head>
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
    <main onClick={() => isOpen && setIsOpen(false)} className="p-4">
      <Head>
        <title>Create Schedule | StaffHub</title>
        <meta
          name="Create Schedule"
          content="Create a schedule for your staff."
        />
      </Head>
      <section className="flex justify-between">
        <Button
          onClick={() => setShowCalendar(true)}
          className="fixed bottom-4 left-4 rounded-full p-8"
        >
          <CalendarIcon size={48} />
        </Button>

        {/* <div className="mt-16 flex flex-col">
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
        </div> */}

        <div className="w-fit pt-2">
          <SearchEmployees
            isOpen={isOpen}
            employees={data}
            employee={employee}
            setIsOpen={setIsOpen}
            setEmployee={setEmployee}
          />
          {employee.name && (
            <div className="mt-2 flex flex-col items-baseline">
              <Heading size={"xs"}>Shift Preferences</Heading>
              <div className="flex">
                {employee.schedulePreference?.shiftModels.length! > 1 ? (
                  employee.schedulePreference?.shiftModels
                    ?.sort((a, b) => a.start - b.start)
                    .map((item) => (
                      <Heading
                        size={"xxs"}
                        key={item.id}
                        className="m-1 font-normal"
                      >
                        [{formatTime(item.start)} - {formatTime(item.end)}]
                      </Heading>
                    ))
                ) : (
                  <Heading size={"xxs"} className="mr-4 text-left font-normal">
                    No shift models set
                  </Heading>
                )}
              </div>
            </div>
          )}
          <div className="flex flex-col pt-2">
            <Heading size={"xs"}>All Shift Models</Heading>
            <div className="flex">
              {shiftModels?.map((item) => (
                <Heading
                  size={"xxs"}
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
                  className={`m-1 cursor-pointer text-left font-normal hover:text-sky-400 ${
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
              ))}
            </div>
          </div>
          {employee.schedulePreference?.hoursPerMonth! > 0 && (
            <>
              <Heading size={"xs"}>Hours per month</Heading>
              <Heading size={"xxs"} className="font-normal">
                <span>
                  {calculateTotalMonthlyHours(schedule, vacationDays.length)}
                </span>{" "}
                / {employee.schedulePreference?.hoursPerMonth} hours per month
              </Heading>
            </>
          )}
          <div className="flex w-fit flex-col space-y-1 pt-4">
            <Button title="Create schedule" onClick={createSchedule}>
              <CalendarPlus size={30} className="mr-2" /> Submit
            </Button>
            <Button
              variant={"subtle"}
              title="How do I make a schedule?"
              onClick={() => setShowModal(true)}
            >
              <Info size={28} className="mr-2" /> How do I write a schedule?
            </Button>
          </div>
        </div>

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
            <Heading size={"xs"} className="mb-4">
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
        </div>
      </section>
      {showCalendar && (
        <ReactModal
          isOpen={showCalendar}
          className="fixed inset-0 flex items-center justify-center bg-[rgba(16,17,30,0.7)]"
        >
          <div className="animate-fade dark:bg-slate-750 mx-auto min-w-[26rem] max-w-3xl rounded-xl border border-slate-300 bg-white px-2 pb-6 pt-2  text-left shadow-lg dark:border-slate-600 dark:bg-slate-700">
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
                activeStartDate={value!}
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
          showModal={showModal}
          close={() => setShowModal(false)}
          heading="How do I write a schedule?"
        />
      )}
    </main>
  );
}
