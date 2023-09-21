import { type EmployeeProfile, api } from "~/utils/api";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, HeartPulse } from "lucide-react";
import "react-calendar/dist/Calendar.css";
import Heading from "~/components/ui/Heading";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { addDays, differenceInDays } from "date-fns";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { DateRange } from "react-day-picker";

type AddSickLeaveProps = {
  employee: EmployeeProfile;
  setShowPlanner: (showPlanner: boolean) => void;
};

export default function AddSickLeave({
  employee,
  setShowPlanner,
}: AddSickLeaveProps) {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 5),
  });

  const { toast } = useToast();

  const queryClient = useQueryClient();

  const createSickLeave = api.sickLeave.create.useMutation({
    onSuccess: () => {
      setShowPlanner(false);
      void queryClient.invalidateQueries();
      toast({
        title: "Sick leave created successfully.",
      });
    },
    onError: () => {
      toast({
        title: "There was a problem creating the sick leave.",
        variant: "destructive",
      });
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!date?.from || !date.to) {
      return toast({
        title: "Please select a date range.",
      });
    }

    createSickLeave.mutate({
      end: date.to.getTime(),
      start: date.from.getTime(),
      employeeId: employee.id!,
    });
  }

  if (!employee) {
    return null;
  }

  return (
    <main className="flex flex-col">
      <Heading size={"xs"} className="mb-1 mt-6 ">
        Days planned:{" "}
        <span>
          {differenceInDays(date?.to!, date?.from!) + 1 > 0
            ? differenceInDays(date?.to!, date?.from!) + 1
            : 0}
        </span>
      </Heading>

      <DatePickerWithRange date={date} setDate={setDate} />

      <form onSubmit={handleSubmit} className="mt-2 flex w-full flex-col">
        <Button
          size={"lg"}
          title="Create sick leave"
          className="mt-2 w-fit text-xl"
        >
          <HeartPulse size={32} className="mr-2" /> Submit
        </Button>

        <Button
          size={"lg"}
          type="button"
          variant={"subtle"}
          title="Cancel sick leave creation"
          onClick={() => setShowPlanner(false)}
          className="mt-2 w-fit text-xl"
        >
          <ArrowLeft size={32} className="mr-2" />
          Cancel
        </Button>
      </form>
    </main>
  );
}
