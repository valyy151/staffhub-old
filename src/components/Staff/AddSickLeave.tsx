import { type EmployeeProfile, api } from "~/utils/api";
import toast from "react-hot-toast";
import { ArrowLeft, HeartPulse } from "lucide-react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import Heading from "~/components/ui/Heading";
import { Button } from "~/components/ui/Button";
import { useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Value } from "react-calendar/dist/cjs/shared/types";

type AddSickLeaveProps = {
  employee: EmployeeProfile;
  setShowPlanner: (showPlanner: boolean) => void;
};

export default function AddSickLeave({
  employee,
  setShowPlanner,
}: AddSickLeaveProps) {
  const [end, setEnd] = useState<Value & Date>(new Date());
  const [start, setStart] = useState<Value & Date>(new Date());
  const [daysPlanned, setDaysPlanned] = useState<number>(0);

  const handleStartChange = (date: any) => {
    const newStart = date;
    const millisecondsPerDay = 24 * 60 * 60 * 1000;
    const newTotalDays =
      Math.ceil((end.getTime() - newStart?.getTime()) / millisecondsPerDay) + 1;
    setStart(date);
    setDaysPlanned(newTotalDays);
  };

  const handleEndChange = (date: any) => {
    setEnd(date);
    const newEnd = date;
    const millisecondsPerDay = 24 * 60 * 60 * 1000;
    const newTotalDays =
      Math.ceil((newEnd?.getTime() - start.getTime()) / millisecondsPerDay) + 1;
    setDaysPlanned(newTotalDays);
  };

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
    <main className="flex w-[36rem] flex-col">
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
          <Calendar
            next2Label={null}
            prev2Label={null}
            value={start}
            onChange={handleStartChange}
          />
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
          <Calendar
            next2Label={null}
            prev2Label={null}
            value={end}
            onChange={handleEndChange}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex w-full flex-col">
        <Button
          size={"lg"}
          title="Create sick leave"
          className="mt-2 h-16 w-[22rem] text-3xl"
        >
          <HeartPulse size={32} className="mr-2" /> Submit
        </Button>

        <Button
          size={"lg"}
          type="button"
          variant={"subtle"}
          title="Cancel sick leave creation"
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
