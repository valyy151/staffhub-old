import FormModal from "../ui/FormModal";
import { useState } from "react";
import { api } from "~/utils/api";
import toast from "react-hot-toast";
import Heading from "../ui/Heading";
import Input from "~/components/ui/Input";
import { Button } from "~/components/ui/Button";
import { useQueryClient } from "@tanstack/react-query";
import { formatTime, formatTotal } from "~/utils/dateFormatting";

interface ShiftModelProps {
  shiftModel: {
    id: string;
    end: number;
    start: number;
    userId: string;
  };
}

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
      {!edit && (
        <>
          <div className="flex w-full items-center justify-between">
            <div className="flex space-x-2">
              <Heading size={"sm"}>{formatTime(shiftModel.start)}</Heading>
              <Heading size={"sm"}>-</Heading>
              <Heading size={"sm"}>{formatTime(shiftModel.end)}</Heading>
            </div>
            <div>
              <Heading size={"sm"} className="ml-[2.65rem]">
                {formatTotal(shiftModel.start, shiftModel.end)}
              </Heading>
            </div>
            <div className="space-x-2">
              <Button
                size={"lg"}
                variant={"subtle"}
                onClick={() => setEdit(true)}
                className="ml-4 h-14 w-28 text-2xl"
              >
                Edit
              </Button>
              <Button
                size={"lg"}
                variant={"destructive"}
                className="h-14 w-36 text-2xl"
                onClick={() => setShowModal(true)}
              >
                Delete
              </Button>
            </div>
          </div>
        </>
      )}
      {edit && (
        <form
          onSubmit={handleEdit}
          className="flex w-full items-center justify-between space-x-2"
        >
          <div className="flex items-center space-x-2">
            <Input
              type="text"
              name="start"
              value={formatTime(start)}
              onChange={(e) => handleTimeChange(e.target.value, "start")}
              className="m-0 h-14 w-24 p-0 pl-1 text-3xl"
            />

            <Input
              type="text"
              name="end"
              value={formatTime(end)}
              onChange={(e) => handleTimeChange(e.target.value, "end")}
              className="m-0 h-14 w-24 p-0 pl-1 text-3xl"
            />
          </div>

          <Heading size={"sm"}>{formatTotal(start, end)}</Heading>

          <div className="space-x-2">
            <Button size={"lg"} className="h-14 w-28 text-2xl">
              Save
            </Button>

            <Button
              size={"lg"}
              variant={"subtle"}
              className="h-14 w-36 text-2xl"
              onClick={() => setEdit(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
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
