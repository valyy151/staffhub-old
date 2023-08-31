import ReactModal from "react-modal";
import { useState, type MouseEventHandler } from "react";

import { Button } from "../ui/Button";
import { api } from "~/utils/api";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Input from "../ui/Input";
import { formatTime, formatTotal } from "~/utils/dateFormatting";
import Heading from "../ui/Heading";

interface ModalProps {
  shift: {
    date: number;
    start: number;
    end: number;
    id: string;
    employee: {
      name: string;
    };
  };

  showModal: boolean;
  cancel: MouseEventHandler<HTMLButtonElement>;
}

export default function EditModal({
  cancel,

  shift,
  showModal,
}: ModalProps) {
  const [end, setEnd] = useState<number>(shift.end);
  const [start, setStart] = useState<number>(shift.start);

  function handleTimeChange(newTime: string, field: "start" | "end"): void {
    const [hour, minute]: string[] = newTime.split(":");
    const newDate: Date = new Date(shift.date * 1000);
    newDate.setHours(Number(hour));
    newDate.setMinutes(Number(minute));
    const newUnixTime = Math.floor(newDate.getTime() / 1000);

    field === "start" ? setStart(newUnixTime) : setEnd(newUnixTime);
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
      <div className="mx-auto min-w-[48rem] max-w-3xl animate-fade rounded-xl border border-slate-300 bg-white px-12 pb-6 text-left shadow-lg dark:border-slate-600 dark:bg-slate-750">
        <div className="mt-6 flex flex-col">
          <Heading size={"sm"} className="mb-4">
            {shift.employee.name} -{"  "}
            {new Date(shift.date * 1000).toLocaleDateString("en-GB", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </Heading>
          <div className="flex w-fit items-center space-x-2">
            <div>
              <label className="ml-2">Start</label>
              <Input
                value={formatTime(start)}
                className="h-14 w-36 text-2xl"
                onChange={(e) => {
                  handleTimeChange(e.target.value, "start");
                }}
              />
            </div>
            <div>
              <label className="ml-2">End</label>
              <Input
                value={formatTime(end)}
                className="h-14 w-36 text-2xl"
                onChange={(e) => {
                  handleTimeChange(e.target.value, "end");
                }}
              />
            </div>
            <div>
              <label className="ml-2">Total</label>
              <Heading
                size={"xs"}
                className="h-14 w-16 border-none px-4 py-3 text-2xl disabled:cursor-default"
              >
                {formatTotal(start, end)}
              </Heading>
            </div>
          </div>
          <div className="ml-auto mt-4 flex space-x-2">
            <Button
              size={"lg"}
              onClick={cancel}
              variant={"subtle"}
              className="text-xl"
            >
              Cancel
            </Button>
            <Button size={"lg"} onClick={updateShift} className="text-xl">
              Save
            </Button>
          </div>
        </div>
      </div>
    </ReactModal>
  );
}
