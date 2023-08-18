import { type EmployeeProfile, api } from "~/utils/api";
import toast from "react-hot-toast";
import { Palmtree, ArrowLeft } from "lucide-react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import Heading from "~/components/ui/Heading";
import { Button } from "~/components/ui/Button";
import { useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";

interface VacationPlannerProps {
  daysPlanned: number;
  employee: EmployeeProfile;
  daysRemaining: number | undefined;
  setAmount: (amount: number) => void;
  setDaysPlanned: (daysPlanned: number) => void;
  setShowPlanner: (showPlanner: boolean) => void;
  setDaysRemaining: (daysRemaining: number | undefined) => void;
}

export default function VacationPlanner({
  employee,
  setDaysPlanned,
  daysRemaining,
  daysPlanned,
  setDaysRemaining,
  setShowPlanner,
}: VacationPlannerProps) {
  const [end, setEnd] = useState(new Date());
  const [start, setStart] = useState(new Date());

  if (!employee) {
    return null;
  }

  function calculateTotalDays() {
    if (!employee.vacationDays) {
      return null;
    }

    const millisecondsPerDay = 24 * 60 * 60 * 1000;
    const totalDays =
      Math.ceil((end.getTime() - start.getTime()) / millisecondsPerDay) + 1;

    if (
      daysRemaining &&
      totalDays > 0 &&
      daysRemaining <= employee.vacationDays
    ) {
      setDaysPlanned(totalDays);
      setDaysRemaining(employee?.vacationDays - totalDays);
    } else {
      setDaysPlanned(0);
      setDaysRemaining(employee?.vacationDays);
    }
  }

  useEffect(() => {
    calculateTotalDays();
  }, [start, end]);

  function handleStartChange(date: any) {
    if (!employee.vacationDays) {
      return null;
    }

    const newStart = date;
    const millisecondsPerDay = 24 * 60 * 60 * 1000;
    const newTotalDays =
      Math.ceil((end.getTime() - newStart.getTime()) / millisecondsPerDay) + 1;

    if (employee?.vacationDays - newTotalDays < 0) {
      return toast.error("You can't plan that many days.");
    }

    setStart(newStart);

    if (
      daysRemaining &&
      newTotalDays > 0 &&
      daysRemaining < employee?.vacationDays
    ) {
      setDaysPlanned(newTotalDays);
      setDaysRemaining(employee?.vacationDays - newTotalDays);
    }
  }

  function handleEndChange(date: any) {
    if (!employee.vacationDays) {
      return null;
    }

    const newEnd = date;
    const millisecondsPerDay = 24 * 60 * 60 * 1000;
    const newTotalDays =
      Math.ceil((newEnd.getTime() - start.getTime()) / millisecondsPerDay) + 1;

    if (newEnd < start) {
      return toast.error("End date must be after start date.");
    }

    if (employee?.vacationDays - newTotalDays < 0) {
      return toast.error("You can't plan that many days.");
    }

    setEnd(newEnd);

    if (
      daysRemaining &&
      newTotalDays > 0 &&
      daysRemaining < employee?.vacationDays
    ) {
      setDaysPlanned(newTotalDays);
      setDaysRemaining(employee?.vacationDays - newTotalDays);
    }
  }

  const queryClient = useQueryClient();

  const createVacation = api.vacation.create.useMutation({
    onSuccess: () => {
      setShowPlanner(false);
      void queryClient.invalidateQueries();
      toast.success("Vacation created successfully.");
    },
    onError: () => {
      toast.error("There was an error creating the vacation.");
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!start || !end) {
      return toast("Please select a start and end date.");
    }

    if (daysPlanned <= 0) {
      return toast("Please select a valid date range.");
    }

    if (!employee.id || !employee.vacationDays) {
      return null;
    }

    createVacation.mutate({
      daysPlanned,
      end: end.getTime(),
      start: start.getTime(),
      employeeId: employee.id,
      vacationDays: employee.vacationDays,
    });
  }

  return (
    <main className="flex w-fit flex-col">
      <Heading className="mt-12 ">
        Days planned:{" "}
        <span className="">{daysPlanned > 0 ? daysPlanned : 0}</span>
      </Heading>
      <div className="mt-6 flex h-96 space-x-12">
        <div>
          <Heading className="mb-2" size={"sm"}>
            Start:{" "}
            {start.toLocaleString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </Heading>
          <Calendar value={start} onChange={handleStartChange} />
        </div>
        <div>
          <Heading className="mb-2" size={"sm"}>
            End:{" "}
            {end.toLocaleString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </Heading>
          <Calendar value={end} onChange={handleEndChange} />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex w-full flex-col">
        <Button
          size={"lg"}
          title="Create vacation"
          className="h-16 w-[22rem] text-3xl"
        >
          <Palmtree size={32} className="mr-2" /> Create Vacation
        </Button>
        <Button
          size={"lg"}
          type="button"
          variant={"subtle"}
          title="Cancel vacation creation"
          onClick={() => setShowPlanner(false)}
          className="mt-2 h-16 w-[22rem] text-3xl"
        >
          <ArrowLeft size={32} className="mr-2" />
          Cancel
        </Button>
      </form>
    </main>
  );
}
