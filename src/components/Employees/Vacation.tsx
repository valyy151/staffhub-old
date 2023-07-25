import { useState } from "react";
import { Vacation } from "@prisma/client";
import Paragraph from "~/components/ui/Paragraph";
import { formatDateLong } from "~/utils/dateFormatting";
import { Button } from "~/components/ui/Button";
import { Trash2 } from "lucide-react";
import Modal from "~/components/ui/Modal";
import { EmployeeProfile, api } from "~/utils/api";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

interface VacationProps {
  employee: EmployeeProfile;
  setAmount: (amount: number) => void;
  vacation: { id: string; start: bigint; end: bigint };
}

export default function Vacation({ vacation, employee }: VacationProps) {
  const [showModal, setShowModal] = useState<boolean>(false);

  function calculateTotalDays(): number {
    const millisecondsPerDay = 24 * 60 * 60 * 1000;
    let totalDays =
      Math.ceil(
        (Number(vacation.end) - Number(vacation.start)) / millisecondsPerDay
      ) + 1;

    return totalDays;
  }

  const [totalDays] = useState<number>(calculateTotalDays());

  const queryClient = useQueryClient();

  const deleteVacation = api.vacation.delete.useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries();
      toast.success("Vacation deleted successfully.");
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
    <div className="mx-auto my-2 flex w-fit items-center justify-center rounded-md bg-white px-3 py-1 shadow dark:bg-slate-700">
      <div className="flex items-center space-x-6">
        <Paragraph className="m-0 w-[36rem] min-w-[16rem] rounded-md bg-white px-2 py-2 text-left dark:bg-slate-700">
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
          className="w-16 min-w-0 rounded-full p-5 text-red-500 hover:bg-slate-200 dark:text-red-400"
          onClick={() => {
            setShowModal(true);
          }}
          title="Delete vacation"
        >
          {<Trash2 />}
        </Button>

        {showModal && (
          <Modal
            showModal={showModal}
            text={"Delete vacation?"}
            cancel={() => setShowModal(false)}
            submit={handleDelete}
          />
        )}
      </div>
    </div>
  );
}
