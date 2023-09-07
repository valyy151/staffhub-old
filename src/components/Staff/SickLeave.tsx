import { useState } from "react";
import Paragraph from "~/components/ui/Paragraph";
import { formatDateLong } from "~/utils/dateFormatting";
import { Button } from "~/components/ui/Button";
import { Trash2 } from "lucide-react";
import FormModal from "~/components/ui/FormModal";
import { api } from "~/utils/api";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

type SickLeaveProps = {
  sickLeave: { id: string; start: bigint; end: bigint };
};

export default function SickLeave({ sickLeave }: SickLeaveProps) {
  const [showModal, setShowModal] = useState<boolean>(false);

  const queryClient = useQueryClient();

  const deleteSickLeave = api.sickLeave.delete.useMutation({
    onSuccess: () => {
      void queryClient.invalidateQueries();
      toast.success("Sick leave deleted successfully.");
    },
    onError: () => {
      toast.error("There was an error deleting the sick leave.");
    },
  });

  function handleDelete() {
    deleteSickLeave.mutate(sickLeave.id);
  }

  return (
    <div className="mx-auto my-2 flex w-fit items-center justify-center rounded-md bg-white px-3 py-1 shadow dark:bg-slate-700">
      <div className="flex items-center space-x-6">
        <Paragraph className="w-[36rem] min-w-[16rem] rounded-md bg-white px-2 py-2 text-left dark:bg-slate-700">
          From{" "}
          <span className="font-bold">
            {formatDateLong(Number(sickLeave.start) / 1000)}.{" "}
          </span>{" "}
          untill{" "}
          <span className="font-bold">
            {formatDateLong(Number(sickLeave.end) / 1000)}.
          </span>
        </Paragraph>

        <Button
          size={"sm"}
          variant={"link"}
          className="w-16 min-w-0 rounded-full p-5 text-red-500 hover:bg-slate-200 dark:text-red-400"
          onClick={() => {
            setShowModal(true);
          }}
          title="Delete sick leave"
        >
          {<Trash2 />}
        </Button>

        {showModal && (
          <FormModal
            showModal={showModal}
            submit={handleDelete}
            heading={"Delete sick leave?"}
            cancel={() => setShowModal(false)}
            text={"Are you sure you want to delete this sick leave?"}
          />
        )}
      </div>
    </div>
  );
}
