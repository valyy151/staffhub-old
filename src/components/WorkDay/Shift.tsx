import Link from "next/link";
import Input from "../ui/Input";
import { useState } from "react";
import { Button } from "../ui/Button";
import Paragraph from "../ui/Paragraph";
import { Shift, WorkDay, WorkDayNote } from "@prisma/client";
import { Check, Pencil, Trash2, X } from "lucide-react";
import { formatTime, formatTotal } from "~/utils/dateFormatting";

interface ShiftProps {
  shift: Shift;
  index: number;
  setWorkDay: (data: WorkDay) => void;
  data: WorkDay & { shifts: Shift[]; notes: WorkDayNote[] };
}

export default function Shift({ shift, index, data, setWorkDay }: ShiftProps) {
  const [showModal, setShowModal] = useState(false);

  const [editMode, setEditMode] = useState<{ [key: string]: boolean }>({});

  const toggleEditMode = (shiftId: string) => {
    setEditMode((prevState) => {
      const updatedEditMode: any = {};

      // Set edit mode to false for all shifts
      Object.keys(prevState).forEach((key) => {
        updatedEditMode[key] = false;
      });

      // Toggle edit mode for the clicked shift
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
      // convert the new time into Unix timestamp
      const [hour, minute]: string[] = newTime.split(":");
      const newDate: any = new Date(data.date * 1000);

      newDate.setHours(hour);
      newDate.setMinutes(minute);

      const newUnixTime = Math.floor(newDate.getTime() / 1000);

      const newShifts = data?.shifts.map((d, i) =>
        i === index ? { ...d, [field]: newUnixTime } : d
      );

      const newWorkDay = {
        id: data.id,
        date: data.date,
        notes: data.notes,
        shifts: newShifts,
        userId: "",
      };
      setWorkDay(newWorkDay);
    }
  };

  const handleEdit = async (e: React.FormEvent, shiftId: string) => {
    e.preventDefault();

    const updatedWorkDay: any = { ...data };

    // Find the shift with the matching shiftId
    const shiftIndex = updatedWorkDay.shifts.findIndex(
      (shift: Shift) => shift.id === shiftId
    );

    if (shiftIndex !== -1) {
      updatedWorkDay.shifts[shiftIndex].loading = true;
      setWorkDay(updatedWorkDay);
    }

    // Reset the loading property after the request is completed
    if (shiftIndex !== -1) {
      updatedWorkDay.shifts[shiftIndex].loading = false;
      setWorkDay(updatedWorkDay);
    }
  };

  return (
    <div
      className="slide-in-bottom flex items-center justify-between"
      key={shift.id}
    >
      <Paragraph className="w-96 py-2">
        <Link
          className="hover:text-sky-500"
          href={`/employees/${shift.employeeId}`}
        >
          {shift?.employeeId}
        </Link>
      </Paragraph>

      {editMode[shift.id] ? (
        <>
          <Input
            type="text"
            title="Shift start"
            value={formatTime(shift.start)}
            className="m-0 mx-2 w-44 text-center"
            onChange={(e) => handleTimeChange(e.target.value, "start", index)}
          />
          <Input
            type="text"
            title="Shift end"
            value={formatTime(shift.end)}
            className="m-0 mx-2 w-44 text-center"
            onChange={(e) => handleTimeChange(e.target.value, "end", index)}
          />
        </>
      ) : (
        <Paragraph className="w-96 ">
          {formatTime(shift.start)} - {formatTime(shift.end)}
        </Paragraph>
      )}

      <Paragraph className="w-96">
        {" "}
        {formatTotal(shift.start, shift.end)}
      </Paragraph>

      {editMode[shift.id] && (
        <form className="space-x-2" onSubmit={(e) => handleEdit(e, shift.id)}>
          <Button
            size={"sm"}
            type="button"
            title="Cancel editing"
            onClick={() => toggleEditMode(shift.id)}
            variant={"outline"}
          >
            Cancel {<X className="ml-2 h-4 w-4" />}
          </Button>
          <Button size={"sm"} title="Save changes">
            Save {<Check className="ml-2 h-4 w-4" />}
          </Button>
        </form>
      )}

      {!editMode[shift.id] && (
        <div className="space-x-2">
          <Button
            size={"sm"}
            title="Edit Shift"
            onClick={() => toggleEditMode(shift.id)}
          >
            Edit {<Pencil className="ml-2 h-4 w-4" />}
          </Button>
          <Button
            size={"sm"}
            title="Delete Shift"
            onClick={() => setShowModal(true)}
          >
            Delete {<Trash2 className="ml-2 h-4 w-4" />}
          </Button>
        </div>
      )}
      {/* {showModal && (
        <Modal
          showModal={showModal}
          loading={loading}
          cancel={() => setShowModal(false)}
          submit={() => handleDelete(shift.id)}
          text={"Are you sure you want to delete this shift?"}
        />
      )} */}
    </div>
  );
}
