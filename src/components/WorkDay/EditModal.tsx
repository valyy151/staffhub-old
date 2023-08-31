import ReactModal from "react-modal";
import { useState, type MouseEventHandler } from "react";

import { Button } from "../ui/Button";
import { api } from "~/utils/api";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

interface ModalProps {
  shift: {
    date: number;
    start: number;
    end: number;
    id: string;
  };
  showModal: boolean;
  cancel: MouseEventHandler<HTMLButtonElement>;
}

export default function EditModal({ cancel, shift, showModal }: ModalProps) {
  const [end, setEnd] = useState<number>(shift.end);
  const [start, setStart] = useState<number>(shift.start);

  function handleTimeChange(newTime: string, field: "start" | "end"): void {
    if (date) {
      const [hour, minute]: string[] = newTime.split(":");
      const newDate: Date = new Date(date * 1000);
      newDate.setHours(Number(hour));
      newDate.setMinutes(Number(minute));
      const newUnixTime = Math.floor(newDate.getTime() / 1000);

      field === "start" ? setStart(newUnixTime) : setEnd(newUnixTime);
    }
  }
  const queryClient = useQueryClient();
  const updateShiftMutation = api.shift.update.useMutation({
    onSuccess: () => {
      void queryClient.invalidateQueries();
      toast.success("Shift updated successfully.");
    },

    onError: () => {
      toast.error("There was a problem updating the shift.");
    },
  });

  function updateShift(e: React.FormEvent) {
    e.preventDefault();

    updateShiftMutation.mutate({
      shiftId: shift.id,
      shift: { start, end },
    });

    cancel();
  }
  return (
    <ReactModal
      isOpen={showModal}
      className="fixed inset-0 flex items-center justify-center bg-[rgba(16,17,30,0.7)]"
    >
      <div className="mx-auto min-w-[26rem] max-w-3xl animate-fade rounded-xl border border-slate-300 bg-white px-12 pb-6 text-left shadow-lg dark:border-slate-600 dark:bg-slate-700">
        <div className="mt-6 flex h-full justify-end space-x-2">
          <Button size={"lg"} onClick={cancel} className="text-xl">
            No
          </Button>
          <Button
            size={"lg"}
            variant="danger"
            onClick={submit}
            className="text-xl"
          >
            Yes
          </Button>
        </div>
      </div>
    </ReactModal>
  );
}
