import FormModal from "../ui/FormModal";
import { useState } from "react";
import { api } from "~/utils/api";
import toast from "react-hot-toast";
import Heading from "../ui/Heading";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { formatTime, formatTotal } from "~/utils/dateFormatting";
import ReactModal from "react-modal";
import { Label } from "@/components/ui/label";

type ShiftModelProps = {
  shiftModel: {
    id: string;
    end: number;
    start: number;
    userId: string;
  };
};

export default function ShiftModel({ shiftModel }: ShiftModelProps) {
  const queryClient = useQueryClient();
  const [edit, setEdit] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [end, setEnd] = useState<number>(shiftModel.end);
  const [start, setStart] = useState<number>(shiftModel.start);

  const editShiftModel = api.shiftModel.update.useMutation({
    onSuccess: () => {
      setEdit(false);
      queryClient.invalidateQueries();
      toast.success("Shift model updated successfully.");
    },

    onError: () => {
      toast.error("There was a problem updating the shift model.");
    },
  });

  const deleteShiftModel = api.shiftModel.delete.useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries();
      toast.success("Shift model deleted successfully.");
    },

    onError: () => {
      toast.error("There was a problem deleting the shift model.");
    },
  });

  function handleEdit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    editShiftModel.mutate({ id: shiftModel.id, start, end });
  }

  function handleTimeChange(newTime: string, field: "start" | "end") {
    const [hour, minute]: string[] = newTime.split(":");
    const newDate: any = new Date(shiftModel.start * 1000);
    newDate.setHours(hour);
    newDate.setMinutes(minute);
    const newUnixTime = Math.floor(newDate.getTime() / 1000);

    field === "start" ? setStart(newUnixTime) : setEnd(newUnixTime);
  }

  return (
    <div className="flex h-20 items-center justify-between border-b border-slate-300 py-2 dark:border-slate-500">
      <div className="flex w-full items-center justify-between">
        <div className="flex space-x-2">
          <Heading size={"xs"}>{formatTime(shiftModel.start)}</Heading>
          <Heading size={"xs"}>-</Heading>
          <Heading size={"xs"}>{formatTime(shiftModel.end)}</Heading>
        </div>
        <div>
          <Heading size={"xs"} className="mx-12">
            {formatTotal(shiftModel.start, shiftModel.end)}
          </Heading>
        </div>
        <div className="space-x-2">
          <Button size={"lg"} variant={"subtle"} onClick={() => setEdit(true)}>
            Edit
          </Button>
          <Button
            size={"lg"}
            variant={"destructive"}
            onClick={() => setShowModal(true)}
          >
            Delete
          </Button>
        </div>
      </div>

      {edit && (
        <ReactModal
          isOpen={edit}
          className="fixed inset-0 flex items-center justify-center bg-[rgba(16,17,30,0.7)]"
        >
          <form
            className="animate-fade mx-auto rounded-xl border border-slate-300 bg-white px-24 pb-6 pt-3 text-left shadow-lg dark:border-slate-600 dark:bg-slate-800"
            onSubmit={handleEdit}
          >
            <Heading size={"sm"} className="text-center">
              Edit Shift Model
            </Heading>
            <div className="mt-4 flex flex-col space-y-4">
              <div>
                <Label>Start Time</Label>
                <Input
                  type="text"
                  value={formatTime(start)}
                  onChange={(e) => handleTimeChange(e.target.value, "start")}
                />
              </div>
              <div>
                <Label>End Time</Label>
                <Input
                  type="text"
                  value={formatTime(end)}
                  onChange={(e) => handleTimeChange(e.target.value, "end")}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  size={"lg"}
                  variant={"subtle"}
                  onClick={() => setEdit(false)}
                >
                  Cancel
                </Button>
                <Button size={"lg"}>Submit</Button>
              </div>
            </div>
          </form>
        </ReactModal>
      )}
      {showModal && (
        <FormModal
          showModal={showModal}
          heading={"Delete Shift Model?"}
          cancel={() => setShowModal(false)}
          submit={() => {
            deleteShiftModel.mutate({ id: shiftModel.id });
            setShowModal(false);
          }}
          text="Are you sure you want to delete this shift model?"
        />
      )}
    </div>
  );
}
