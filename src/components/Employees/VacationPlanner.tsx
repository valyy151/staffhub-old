import { EmployeeProfile, api } from "~/utils/api";
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
  daysRemaining: number;
  employee: EmployeeProfile;
  setAmount: (amount: number) => void;
  setDaysPlanned: (daysPlanned: number) => void;
  setShowPlanner: (showPlanner: boolean) => void;
  setDaysRemaining: (daysRemaining: number) => void;
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
    let totalDays =
      Math.ceil((end.getTime() - start.getTime()) / millisecondsPerDay) + 1;

    if (totalDays > 0 && daysRemaining <= employee.vacationDays) {
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

    if (newTotalDays > 0 && daysRemaining < employee?.vacationDays) {
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

    if (newTotalDays > 0 && daysRemaining < employee?.vacationDays) {
      setDaysPlanned(newTotalDays);
      setDaysRemaining(employee?.vacationDays - newTotalDays);
    }
  }

  const queryClient = useQueryClient();

  const createVacation = api.vacation.create.useMutation({
    onSuccess: () => {
      setShowPlanner(false);
      queryClient.invalidateQueries();
      toast.success("Vacation created successfully.");
    },
    onError: () => {
      toast.error("There was an error creating the vacation.");
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!start || !end) {
      return toast.error("Please select a start and end date.");
    }

    if (daysPlanned <= 0) {
      return toast.error("Please select a valid date range.");
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
  };

  return (
    <main className="flex flex-col items-center">
      <Heading className=" mt-12 text-center font-normal">
        Days planned:{" "}
        <span className="font-bold">{daysPlanned > 0 ? daysPlanned : 0}</span>
      </Heading>
      <div className="mt-6 flex h-96 space-x-24">
        <div>
          <Heading className="mb-2 text-center" size={"sm"}>
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
          <Heading className="mb-2 text-center" size={"sm"}>
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

      <form
        onSubmit={handleSubmit}
        className="mt-12 flex w-1/2 flex-col space-y-3"
      >
        <Button
          size={"lg"}
          title="Create vacation"
          className="h-16 w-full text-3xl"
        >
          <Palmtree size={32} className="mr-2" /> Create Vacation
        </Button>
        <Button
          size={"lg"}
          type="button"
          variant={"link"}
          title="Cancel vacation creation"
          onClick={() => setShowPlanner(false)}
          className="h-16 w-full text-3xl"
        >
          <ArrowLeft size={32} className="mr-2" />
          Cancel
        </Button>
      </form>
    </main>
  );
}
