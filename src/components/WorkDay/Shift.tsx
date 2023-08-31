import Link from "next/link";
import Input from "../ui/Input";
import FormModal from "../ui/FormModal";
import { useState } from "react";
import { api } from "~/utils/api";
import Heading from "../ui/Heading";
import toast from "react-hot-toast";
import { Button } from "../ui/Button";
import { type Shift } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Pencil, Save, Trash2 } from "lucide-react";
import { formatTime, formatTotal } from "~/utils/dateFormatting";
import EditModal from "./EditModal";

interface ShiftProps {
  date: number | undefined;
  index: number;
  shift: Shift & {
    employee: {
      name: string;
      roles: { name: string }[];
    };
    role: { name: string } | null;
  };
}

export default function Shift({ shift, date, index }: ShiftProps) {
  const [showModal, setShowModal] = useState(false);

  const [editMode, setEditMode] = useState<boolean>(false);

  const queryClient = useQueryClient();

  const deleteShiftMutation = api.shift.delete.useMutation({
    onSuccess: () => {
      void queryClient.invalidateQueries();
      toast.success("Shift deleted successfully.");
    },

    onError: () => {
      toast.error("There was a problem deleting the shift.");
    },
  });

  function deleteShift() {
    deleteShiftMutation.mutate({ shiftId: shift.id });
    setShowModal(false);
  }

  return (
    <div className="flex items-end justify-between">
      <div className="min-w-[9rem]">
        {index === 0 && (
          <Heading size={"xxs"} className="font-normal">
            Role
          </Heading>
        )}

        {shift.role ? (
          <Heading size={"xs"} className="font-medium">
            {shift.role.name}
          </Heading>
        ) : (
          <Heading className="font-light italic">None</Heading>
        )}
      </div>

      <div className={`ml-12 w-[24rem]`}>
        {index === 0 && (
          <Heading size={"xxs"} className="font-normal">
            Name
          </Heading>
        )}
        <Heading size={"xs"}>
          <Link
            className="underline-offset-8 hover:text-sky-500 hover:underline"
            href={`/staff/${shift.employeeId}`}
          >
            {shift?.employee.name}
          </Link>
        </Heading>
      </div>
      <div className="">
        {index === 0 && (
          <Heading size={"xxs"} className="font-normal">
            Time
          </Heading>
        )}

        <div className="">
          <Heading size={"xs"} className=" font-normal">
            {formatTime(shift.start)} - {formatTime(shift.end)}
          </Heading>
        </div>
      </div>

      <div className="ml-11 w-36">
        {index === 0 && (
          <Heading size={"xxs"} className="font-normal">
            Total
          </Heading>
        )}
        <Heading size={"xs"}>{formatTotal(start, end)}</Heading>
      </div>

      <div className="flex pt-5">
        <Button
          title="Edit Shift"
          onClick={() => setEditMode(true)}
          className="mr-2 text-2xl"
        >
          {<Pencil className="mr-2" />} Edit
        </Button>
        <Button
          title="Delete Shift"
          variant={"destructive"}
          className="text-2xl"
          onClick={() => setShowModal(true)}
        >
          {<Trash2 className="mr-2" />} Delete
        </Button>
      </div>

      {editMode && (
        <EditModal
          shift={shift}
          date={date}
          showModal={editMode}
          cancel={() => setEditMode(false)}
        />
      )}

      {showModal && (
        <FormModal
          submit={deleteShift}
          showModal={showModal}
          heading={"Delete shift?"}
          cancel={() => setShowModal(false)}
          text={"Are you sure you want to delete this shift?"}
        />
      )}
    </div>
  );
}
