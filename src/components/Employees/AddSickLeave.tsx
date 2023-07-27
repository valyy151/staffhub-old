import { type EmployeeProfile, api } from "~/utils/api";
import toast from "react-hot-toast";
import { ArrowLeft, HeartPulse } from "lucide-react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import Heading from "~/components/ui/Heading";
import { Button } from "~/components/ui/Button";
import { useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";

interface AddSickLeaveProps {
  employee: EmployeeProfile;
  setShowPlanner: (showPlanner: boolean) => void;
}

export default function AddSickLeave({
  employee,
  setShowPlanner,
}: AddSickLeaveProps) {
  const [end, setEnd] = useState(new Date());
  const [start, setStart] = useState(new Date());
  const [daysPlanned, setDaysPlanned] = useState<number>(0);

  function handleStartChange(date: any) {
    const newStart = date;
    const millisecondsPerDay = 24 * 60 * 60 * 1000;
    const newTotalDays =
      Math.ceil((end.getTime() - newStart.getTime()) / millisecondsPerDay) + 1;
    setStart(date);
    setDaysPlanned(newTotalDays);
  }

  function handleEndChange(date: any) {
    setEnd(date);
    const newEnd = date;
    const millisecondsPerDay = 24 * 60 * 60 * 1000;
    const newTotalDays =
      Math.ceil((newEnd.getTime() - start.getTime()) / millisecondsPerDay) + 1;
    setDaysPlanned(newTotalDays);
  }

  useEffect(() => {
    function calculateTotalDays() {
      const millisecondsPerDay = 24 * 60 * 60 * 1000;
      const totalDays =
        Math.ceil((end.getTime() - start.getTime()) / millisecondsPerDay) + 1;

      if (totalDays > 0) {
        setDaysPlanned(totalDays);
      } else {
        setDaysPlanned(0);
      }
    }

    calculateTotalDays();
  }, [start, end]);

  const queryClient = useQueryClient();

  const createSickLeave = api.sickLeave.create.useMutation({
    onSuccess: () => {
      setShowPlanner(false);
      void queryClient.invalidateQueries();
      toast.success("Sick leave created successfully.");
    },
    onError: () => {
      toast.error("There was an error creating the sick leave.");
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!start || !end) {
      return toast.error("Please select a start and end date.");
    }

    if (!employee.id) {
      return null;
    }

    createSickLeave.mutate({
      end: end.getTime(),
      start: start.getTime(),
      employeeId: employee.id,
    });
  }

  if (!employee) {
    return null;
  }

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
        onSubmit={void handleSubmit}
        className="mt-12 flex w-1/2 flex-col space-y-3"
      >
        <Button
          size={"lg"}
          title="Create sick leave"
          className="h-16 w-full text-3xl"
        >
          <HeartPulse size={32} className="mr-2" /> Submit
        </Button>

        <Button
          size={"lg"}
          type="button"
          variant={"link"}
          title="Cancel sick leave creation"
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
