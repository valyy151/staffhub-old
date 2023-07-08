import Link from "next/link";
import Input from "../ui/Input";
import { useState } from "react";
import { Button } from "../ui/Button";
import { Shift, WorkDay, WorkDayNote } from "@prisma/client";
import { Check, Pencil, Save, Trash2, X } from "lucide-react";
import { formatTime, formatTotal } from "~/utils/dateFormatting";
import Heading from "../ui/Heading";
import { api } from "~/utils/api";
import toast from "react-hot-toast";
import Modal from "../ui/Modal";

interface ShiftProps {
  index: number;
  setWorkDay: (data: WorkDay) => void;
  shift: Shift & { employee: { name: string } };
  data: WorkDay & { shifts: Shift[]; notes: WorkDayNote[] };
}

export default function Shift({ shift, index, data, setWorkDay }: ShiftProps) {
  const [showModal, setShowModal] = useState(false);

  const [editMode, setEditMode] = useState<{ [key: string]: boolean }>({});

  const toggleEditMode = (shiftId: string) => {
    setEditMode((prevState) => {
      const updatedEditMode: any = {};

      Object.keys(prevState).forEach((key) => {
        updatedEditMode[key] = false;
      });

      updatedEditMode[shiftId] = !prevState[shiftId];

      return updatedEditMode;
    });
  };

  const handleTimeChange = (
    newTime: string,
    field: "start" | "end",
    index: number
  ) => {
    if (data) {
      const [hour, minute]: string[] = newTime.split(":");
      const newDate: any = new Date(data.date * 1000);

      newDate.setHours(hour);
      newDate.setMinutes(minute);

      const newUnixTime = Math.floor(newDate.getTime() / 1000);

      const newShifts = data?.shifts.map((d, i) =>
        i === index ? { ...d, [field]: newUnixTime } : d
      );

      const newWorkDay = {
        userId: "",
        id: data.id,
        date: data.date,
        notes: data.notes,
        shifts: newShifts,
      };
      setWorkDay(newWorkDay);
    }
  };

  const updateShift = api.shift.update.useMutation({
    onSuccess: () => {
      toast.success("Shift updated successfully.");
    },
  });

  const deleteShift = api.shift.delete.useMutation({
    onSuccess: () => {
      toast.success("Shift deleted successfully.");
    },
  });

  async function handleEdit(e: React.FormEvent, shiftId: string) {
    e.preventDefault();

    updateShift.mutate({
      shiftId: shiftId,
      shift: { start: shift.start, end: shift.end },
    });

    toggleEditMode(shiftId);
  }

  async function handleDelete(shiftId: string) {
    deleteShift.mutate({ shiftId: shiftId });

    setShowModal(false);
  }

  return (
    <div
      className="flex w-10/12 items-center justify-center pb-6"
      key={shift.id}
    >
      <Heading size={"xs"} className="w-72">
        <Link
          className="hover:text-sky-500"
          href={`/employees/${shift.employeeId}`}
        >
          {shift?.employee.name}
        </Link>
      </Heading>

      {editMode[shift.id] ? (
        <div className="flex w-72 items-center space-x-2">
          <Input
            type="text"
            title="Shift start"
            value={formatTime(shift.start)}
            className="text-center text-2xl"
            onChange={(e) => handleTimeChange(e.target.value, "start", index)}
          />
          <Input
            type="text"
            title="Shift end"
            value={formatTime(shift.end)}
            className="text-center text-2xl"
            onChange={(e) => handleTimeChange(e.target.value, "end", index)}
          />
        </div>
      ) : (
        <Heading size={"xs"} className="w-72 text-center font-normal">
          {formatTime(shift.start)} - {formatTime(shift.end)}
        </Heading>
      )}

      <Heading size={"xs"} className="w-72 text-center font-normal">
        {" "}
        {formatTotal(shift.start, shift.end)}
      </Heading>

      {editMode[shift.id] ? (
        <form
          className="flex justify-center space-x-2"
          onSubmit={(e) => handleEdit(e, shift.id)}
        >
          <Button title="Save changes" className="w-28">
            Save {<Save className="ml-2" />}
          </Button>
          <Button
            type="button"
            className="w-28"
            title="Cancel editing"
            variant={"subtle"}
            onClick={() => toggleEditMode(shift.id)}
          >
            Cancel {<X className="ml-2" />}
          </Button>
        </form>
      ) : (
        !editMode[shift.id] && (
          <>
            <Button
              className="mr-1 w-28"
              title="Edit Shift"
              onClick={() => toggleEditMode(shift.id)}
            >
              Edit {<Pencil className="ml-2" />}
            </Button>
            <Button
              className="ml-1 w-28"
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
          showModal={showModal}
          cancel={() => setShowModal(false)}
          submit={() => handleDelete(shift.id)}
          text={"Are you sure you want to delete this shift?"}
        />
      )}
    </div>
  );
}
