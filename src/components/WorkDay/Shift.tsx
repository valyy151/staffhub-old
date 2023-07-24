import Link from "next/link";
import Input from "../ui/Input";
import Modal from "../ui/Modal";
import { useState } from "react";
import { api } from "~/utils/api";
import Heading from "../ui/Heading";
import toast from "react-hot-toast";
import { Button } from "../ui/Button";
import { Shift } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { Pencil, Save, Trash2, X } from "lucide-react";
import { formatTime, formatTotal } from "~/utils/dateFormatting";

interface ShiftProps {
  date: number | undefined;
  shift: Shift & { employee: { name: string } };
}

export default function Shift({ shift, date }: ShiftProps) {
  const [showModal, setShowModal] = useState(false);

  const [editMode, setEditMode] = useState<boolean>(false);

  const [end, setEnd] = useState<number>(shift.end);
  const [start, setStart] = useState<number>(shift.start);

  function handleTimeChange(newTime: string, field: "start" | "end"): void {
    if (date) {
      const [hour, minute]: string[] = newTime.split(":");
      const newDate: any = new Date(date * 1000);
      newDate.setHours(hour);
      newDate.setMinutes(minute);
      const newUnixTime = Math.floor(newDate.getTime() / 1000);

      field === "start" ? setStart(newUnixTime) : setEnd(newUnixTime);
    }
  }

  const queryClient = useQueryClient();

  const updateShiftMutation = api.shift.update.useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries();
      toast.success("Shift updated successfully.");
    },
  });

  const deleteShiftMutation = api.shift.delete.useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries();
      toast.success("Shift deleted successfully.");
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
    <div className="flex items-center">
      <Heading size={"xs"} className="mr-8">
        <Link
          className="hover:text-sky-500"
          href={`/employees/${shift.employeeId}`}
        >
          {shift?.employee.name}
        </Link>
      </Heading>

      {editMode ? (
        <div className="mr-6 flex items-center space-x-2">
          <Input
            type="text"
            name="start"
            placeholder="Start time"
            value={formatTime(start)}
            className="m-0 h-14 text-xl"
            onChange={(e) => handleTimeChange(e.target.value, "start")}
          />
          <Input
            name="end"
            type="text"
            placeholder="End time"
            value={formatTime(end)}
            className="m-0 h-14 text-xl"
            onChange={(e) => handleTimeChange(e.target.value, "end")}
          />
        </div>
      ) : (
        <Heading size={"xs"} className="ml-2 w-48 font-normal">
          {formatTime(shift.start)} - {formatTime(shift.end)}
        </Heading>
      )}

      <Heading size={"xs"} className="mr-8">
        {" "}
        {formatTotal(start, end)}
      </Heading>

      {editMode ? (
        <form className="flex justify-center space-x-2" onSubmit={updateShift}>
          <Button title="Save changes" className="">
            Save {<Save className="ml-2" />}
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
            Cancel {<X className="ml-2" />}
          </Button>
        </form>
      ) : (
        !editMode && (
          <>
            <Button
              className="mr-1 "
              title="Edit Shift"
              onClick={() => setEditMode(true)}
            >
              Edit {<Pencil className="ml-2" />}
            </Button>
            <Button
              className="ml-1"
              title="Delete Shift"
              variant={"destructive"}
              onClick={() => setShowModal(true)}
            >
              Delete {<Trash2 className="ml-2" />}
            </Button>
          </>
        )
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
