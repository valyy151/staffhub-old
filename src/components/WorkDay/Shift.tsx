import Link from "next/link";
import Input from "../ui/Input";
import Modal from "../ui/Modal";
import { useState } from "react";
import { api } from "~/utils/api";
import Heading from "../ui/Heading";
import toast from "react-hot-toast";
import { Button } from "../ui/Button";
import { type Shift } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Pencil, Save, Trash2 } from "lucide-react";
import { formatTime, formatTotal } from "~/utils/dateFormatting";

interface ShiftProps {
  date: number | undefined;
  index: number;
  shift: Shift & { employee: { name: string } };
}

export default function Shift({ shift, date, index }: ShiftProps) {
  const [showModal, setShowModal] = useState(false);

  const [editMode, setEditMode] = useState<boolean>(false);

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
      toast.success("Shift updated successfully.", {
        className: "text-xl",
      });
    },

    onError: () => {
      toast.error("There was a problem updating the shift.", {
        className: "text-xl",
      });
    },
  });

  const deleteShiftMutation = api.shift.delete.useMutation({
    onSuccess: () => {
      void queryClient.invalidateQueries();
      toast.success("Shift deleted successfully.", {
        className: "text-xl",
      });
    },

    onError: () => {
      toast.error("There was a problem deleting the shift.", {
        className: "text-xl",
      });
    },
  });

  function updateShift(e: React.FormEvent) {
    e.preventDefault();

    updateShiftMutation.mutate({
      shiftId: shift.id,
      shift: { start, end },
    });

    setEditMode(false);
  }

  function deleteShift() {
    deleteShiftMutation.mutate({ shiftId: shift.id });
    setShowModal(false);
  }

  return (
    <div className="flex items-end justify-between">
      <div className="w-64">
        {index === 0 && (
          <Heading size={"xxs"} className="font-normal">
            Name
          </Heading>
        )}
        <Heading size={"xs"}>
          <Link
            className="underline-offset-8 hover:text-sky-500 hover:underline"
            href={`/employees/${shift.employeeId}`}
          >
            {shift?.employee.name}
          </Link>
        </Heading>
      </div>
      <div>
        {index === 0 && (
          <Heading size={"xxs"} className="font-normal">
            Time
          </Heading>
        )}
        {editMode ? (
          <div className="flex w-[10.25rem]">
            <Input
              type="text"
              name="start"
              placeholder="Start time"
              value={formatTime(start)}
              className="m-0 w-20 px-0 pl-1 text-2xl"
              onChange={(e) => handleTimeChange(e.target.value, "start")}
            />
            <Input
              name="end"
              type="text"
              placeholder="End time"
              value={formatTime(end)}
              className="m-0 ml-1 w-20 px-0 pl-1 text-2xl"
              onChange={(e) => handleTimeChange(e.target.value, "end")}
            />
          </div>
        ) : (
          <>
            <Heading size={"xs"} className="w-[10.25rem] font-normal">
              {formatTime(shift.start)} - {formatTime(shift.end)}
            </Heading>
          </>
        )}
      </div>

      <div className="ml-11 w-36">
        {index === 0 && (
          <Heading size={"xxs"} className="font-normal">
            Total
          </Heading>
        )}
        <Heading size={"xs"}>{formatTotal(start, end)}</Heading>
      </div>
      {editMode ? (
        <form className="flex w-64 space-x-1" onSubmit={updateShift}>
          <Button title="Save changes" className="ml-auto">
            {<Save className="mr-2" />} Save
          </Button>
          <Button
            type="button"
            className=""
            title="Cancel editing"
            variant={"subtle"}
            onClick={() => {
              setEnd(shift.end);
              setStart(shift.start);
              setEditMode(false);
            }}
          >
            {<ArrowLeft className="mr-2" />} Cancel
          </Button>
        </form>
      ) : (
        <div className="flex w-64 space-x-1">
          <Button
            title="Edit Shift"
            onClick={() => setEditMode(true)}
            className="ml-auto"
          >
            {<Pencil className="mr-2" />} Edit
          </Button>
          <Button
            title="Delete Shift"
            variant={"destructive"}
            onClick={() => setShowModal(true)}
          >
            {<Trash2 className="mr-2" />} Delete
          </Button>
        </div>
      )}

      {showModal && (
        <Modal
          submit={deleteShift}
          showModal={showModal}
          cancel={() => setShowModal(false)}
          text={"Are you sure you want to delete this shift?"}
        />
      )}
    </div>
  );
}
