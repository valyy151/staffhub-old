import { useState } from 'react';
import { api, EmployeeProfile } from '~/utils/api';

import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
    AlertDialogFooter, AlertDialogHeader, AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { useQueryClient } from '@tanstack/react-query';

import { Input } from '../ui/input';
import { useToast } from '../ui/use-toast';

type Props = {
  employee: EmployeeProfile;
  setShowChangeAmount: (showChangeAmount: boolean) => void;
};

export default function ChangeVacationDays({
  employee,
  setShowChangeAmount,
}: Props) {
  const { toast } = useToast();

  const queryClient = useQueryClient();

  const [amount, setAmount] = useState<number>(employee.vacationDays!);

  const updateAmountMutation = api.vacation.updateAmountOfDays.useMutation({
    onSuccess: () => {
      setShowChangeAmount(false);
      void queryClient.invalidateQueries();
      toast({ title: "Vacation days updated successfully." });
    },

    onError: () => {
      toast({
        title: "There was a problem updating the vacation days.",
        variant: "destructive",
      });
    },
  });

  function updateAmount() {
    if (!amount) {
      return toast({ title: "Please enter a number." });
    }

    if (!employee?.id) {
      return null;
    }

    updateAmountMutation.mutate({
      vacationDays: amount,
      employeeId: employee.id,
    });
  }
  return (
    <AlertDialog open>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            How many vacation days should this employee have?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This will overwrite the current amount of vacation days.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Input
          type="text"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="w-fit"
        />

        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setShowChangeAmount(false)}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={updateAmount}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
