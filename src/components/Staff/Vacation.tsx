import { useState } from "react";
import { type Vacation } from "@prisma/client";
import Paragraph from "~/components/ui/Paragraph";
import { formatDateLong } from "~/utils/dateFormatting";
import { Trash2 } from "lucide-react";
import FormModal from "~/components/ui/FormModal";
import { type EmployeeProfile, api } from "~/utils/api";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";

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
    <div className="my-2 flex w-fit items-center justify-center rounded-md bg-white px-3 py-1 shadow dark:bg-slate-700">
      <div className="flex items-center space-x-6">
        <Paragraph className="w-[36rem] min-w-[16rem] rounded-md bg-white px-2 py-2 text-left dark:bg-slate-700">
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
          className="w-16 min-w-0 rounded-full p-5 text-red-500 dark:text-red-400"
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
