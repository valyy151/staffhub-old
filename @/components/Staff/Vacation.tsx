import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import { api, EmployeeProfile } from '~/utils/api';
import { formatDateLong } from '~/utils/dateFormatting';

import { Button } from '@/components/ui/button';
import FormModal from '@/components/ui/form-modal';
import Paragraph from '@/components/ui/paragraph';
import { useToast } from '@/components/ui/use-toast';
import { Vacation } from '@prisma/client';
import { useQueryClient } from '@tanstack/react-query';

type VacationProps = {
  employee: EmployeeProfile;
  vacation: { id: string; start: bigint; end: bigint };
};

export default function Vacation({ vacation, employee }: VacationProps) {
  const [showModal, setShowModal] = useState<boolean>(false);

  function calculateTotalDays(): number {
    const millisecondsPerDay = 24 * 60 * 60 * 1000;
    const totalDays =
      Math.ceil(
        (Number(vacation.end) - Number(vacation.start)) / millisecondsPerDay
      ) + 1;

    return totalDays;
  }

  const [totalDays] = useState<number>(calculateTotalDays());

  const { toast } = useToast();

  const queryClient = useQueryClient();

  const deleteVacation = api.vacation.delete.useMutation({
    onSuccess: () => {
      void queryClient.invalidateQueries();
      toast({
        title: "Vacation deleted successfully.",
      });
    },
    onError: () => {
      toast({
        title: "There was a problem deleting the vacation.",
        variant: "destructive",
      });
    },
  });

  function handleDelete() {
    if (!employee.id || !employee.vacationDays) {
      return null;
    }

    deleteVacation.mutate({
      totalDays,
      employeeId: employee.id,
      vacationId: vacation.id,
      vacationDays: employee.vacationDays,
    });
  }

  return (
    <div className="my-2 flex w-full items-center justify-center rounded-md border border-foreground/25 px-3 py-1">
      <div className="flex w-full items-center space-x-6">
        <Paragraph className="w-full rounded px-2 py-2 text-left">
          From{" "}
          <span className="font-bold">
            {formatDateLong(Number(vacation.start) / 1000)}.{" "}
          </span>{" "}
          untill{" "}
          <span className="font-bold">
            {formatDateLong(Number(vacation.end) / 1000)}.
          </span>
        </Paragraph>

        <Button
          size={"sm"}
          variant={"link"}
          className="rounded-full p-5 text-red-500 dark:text-red-400"
          onClick={() => {
            setShowModal(true);
          }}
          title="Delete vacation"
        >
          {<Trash2 />}
        </Button>

        {showModal && (
          <FormModal
            showModal={showModal}
            submit={handleDelete}
            heading={"Delete vacation?"}
            cancel={() => setShowModal(false)}
            text={"Are you sure you want to delete this vacation"}
          />
        )}
      </div>
    </div>
  );
}
