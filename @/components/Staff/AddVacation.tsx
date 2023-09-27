import "react-calendar/dist/Calendar.css";

import { addDays, differenceInDays } from "date-fns";
import { ArrowLeft, Palmtree } from "lucide-react";
import { useState } from "react";
import { DateRange } from "react-day-picker";
import { api, EmployeeProfile } from "~/utils/api";

import { Button } from "@/components/ui/button";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import Heading from "@/components/ui/heading";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";

type VacationPlannerProps = {
  employee: EmployeeProfile;
  setAmount: (amount: number) => void;
  setShowPlanner: (showPlanner: boolean) => void;
};

export default function VacationPlanner({
  employee,
  setShowPlanner,
}: VacationPlannerProps) {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 5),
  });

  if (!employee) {
    return null;
  }

  const { toast } = useToast();

  const queryClient = useQueryClient();

  const createVacation = api.vacation.create.useMutation({
    onSuccess: () => {
      setShowPlanner(false);
      void queryClient.invalidateQueries();
      toast({
        title: "Vacation created successfully.",
      });
    },
    onError: () => {
      toast({
        title: "There was a problem creating the vacation.",
        variant: "destructive",
      });
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!date?.from || !date?.to) {
      return toast({
        title: "Please select a start and end date.",
      });
    }

    createVacation.mutate({
      end: date.to.getTime(),
      employeeId: employee.id!,
      start: date.from.getTime(),
      vacationDays: employee.vacationDays!,
      daysPlanned: differenceInDays(date?.to!, date?.from!) + 1,
    });
  }

  return (
    <main className="flex w-fit flex-col">
      <Heading size={"xs"} className="mb-1 mt-6">
        Days planned:
        <span>
          {differenceInDays(date?.to!, date?.from!) + 1 > 0
            ? differenceInDays(date?.to!, date?.from!) + 1
            : 0}
        </span>
      </Heading>
      <DatePickerWithRange date={date} setDate={setDate} />

      <form onSubmit={handleSubmit} className="mt-4 flex w-full flex-col">
        <Button size={"lg"} title="Create vacation" className="w-fit text-xl">
          <Palmtree size={32} className="mr-2" /> Submit
        </Button>
        <Button
          size={"lg"}
          type="button"
          variant={"subtle"}
          title="Cancel vacation creation"
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
