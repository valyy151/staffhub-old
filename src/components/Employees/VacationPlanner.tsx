import { api } from "~/utils/api";
import toast from "react-hot-toast";
import { Check, Palmtree, X, ArrowLeft } from "lucide-react";
import Calendar from "react-calendar";
import { Employee } from "@prisma/client";
import "react-calendar/dist/Calendar.css";
import Heading from "~/components/ui/Heading";
import { Button } from "~/components/ui/Button";
import { useQueryClient } from "@tanstack/react-query";
import { useState, useEffect, Dispatch, SetStateAction } from "react";

interface VacationPlannerProps {
  employee: Employee & any;
  daysPlanned: number;
  daysRemaining: number;
  setAmount: Dispatch<SetStateAction<number>>;
  setDaysPlanned: Dispatch<SetStateAction<number>>;
  setShowPlanner: Dispatch<SetStateAction<boolean>>;
  setDaysRemaining: Dispatch<SetStateAction<number>>;
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

  const calculateTotalDays = () => {
    const millisecondsPerDay = 24 * 60 * 60 * 1000;
    let totalDays =
      Math.ceil((end.getTime() - start.getTime()) / millisecondsPerDay) + 1;
    if (totalDays > 0 && daysRemaining <= employee?.vacationDays) {
      setDaysPlanned(totalDays);
      setDaysRemaining(employee?.vacationDays - totalDays);
    } else {
      setDaysPlanned(0);
      setDaysRemaining(employee?.vacationDays);
    }
  };

  useEffect(() => {
    calculateTotalDays();
  }, [start, end]);

  const handleStartChange: any = (date: Date) => {
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
  };

  const handleEndChange: any = (date: Date) => {
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
  };

  const queryClient = useQueryClient();

  const createVacation = api.vacation.create.useMutation({
    onSuccess: () => {
      setShowPlanner(false);
      queryClient.invalidateQueries();
      toast.success("Vacation created successfully.");
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
