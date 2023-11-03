import "react-calendar/dist/Calendar.css";

import { addDays, differenceInDays } from "date-fns";
import { useState } from "react";
import { DateRange } from "react-day-picker";
import { api, EmployeeProfile } from "~/utils/api";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";

type VacationPlannerProps = {
  employee: EmployeeProfile;
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
    <AlertDialog open>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>New Vacation</AlertDialogTitle>
          <AlertDialogDescription>
            Days planned:{" "}
            <span>
              {differenceInDays(date?.to!, date?.from!) + 1 > 0
                ? differenceInDays(date?.to!, date?.from!) + 1
                : 0}
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <DatePickerWithRange date={date} setDate={setDate} />

        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setShowPlanner(false)}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleSubmit}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
