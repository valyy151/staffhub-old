import 'react-calendar/dist/Calendar.css';

import { CalendarPlus, Info, UserPlus } from 'lucide-react';
import { getSession } from 'next-auth/react';
import Head from 'next/head';
import router from 'next/router';
import { GetServerSideProps } from 'next/types';
import { useState } from 'react';
import Calendar from 'react-calendar';
import sentences from '~/data/schedule.json';
import { api, Employee } from '~/utils/api';
import { calculateTotalMonthlyHours } from '~/utils/calculateHours';
import { findSickLeaveDays, findVacationDays } from '~/utils/checkAbsence';
import { formatMonth, formatTime } from '~/utils/dateFormatting';
import { generateYearArray, updateMonthData } from '~/utils/yearArray';

import ScheduleTable from '@/components/Schedule/ScheduleTable';
import SelectEmployee from '@/components/Schedule/SelectEmployee';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Heading from '@/components/ui/heading';
import InfoModal from '@/components/ui/info-modal';
import Spinner from '@/components/ui/spinner';
import { useToast } from '@/components/ui/use-toast';

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
                <Heading
                  size={"xs"}
                  onClick={() => setShowCalendar(true)}
                  className="cursor-pointer underline-offset-8 hover:underline"
                >
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
                <Heading
                  size={"xs"}
                  onClick={() => setShowCalendar(true)}
                  className="cursor-pointer underline-offset-8 hover:underline"
                >
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

      {showCalendar && (
        <Dialog open onOpenChange={() => setShowCalendar(false)}>
          <DialogContent className="mx-auto flex flex-col">
            <div className="mx-auto">
              <DialogHeader>
                <DialogTitle className="text-xl">Choose a Month</DialogTitle>
              </DialogHeader>

              <Calendar
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
          </DialogContent>
        </Dialog>
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
