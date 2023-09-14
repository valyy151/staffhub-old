import Link from "next/link";
import Input from "../ui/Input";
import FormModal from "../ui/FormModal";
import { useState } from "react";
import { api } from "~/utils/api";
import Heading from "../ui/Heading";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { Pencil, Trash2 } from "lucide-react";
import { formatTime, formatTotal } from "~/utils/dateFormatting";
import EditModal from "./EditModal";
import { Label } from "@/components/ui/label";

type Shift = {
  id: string;
  end: number;
  date: number;
  start: number;
  userId: string;
  employeeId: string;
  roleId: string | null;
} & {
  role: { name: string; id: string } | null;
  employee: { name: string; roles: { name: string; id: string }[] };
};

type ShiftProps = {
  shift: Shift;
  index: number;
  date: number | undefined;
  shiftModels: { start: number; end: number }[];
};

export default function Shift({ shift, index, shiftModels }: ShiftProps) {
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
    <div className="flex items-end justify-between border-b border-slate-300 pb-2 dark:border-slate-500">
      <div className="min-w-[9rem]">
        {index === 0 && <Label>Role</Label>}

        {shift.role ? (
          <Heading size={"xxs"} className="font-medium">
            {shift.role.name}
          </Heading>
        ) : (
          <Heading size={"xxs"} className="font-light italic">
            None
          </Heading>
        )}
      </div>

      <div className={`ml-12 w-[24rem]`}>
        {index === 0 && <Label>Name</Label>}
        <Heading size={"xxs"}>
          <Link
            className="underline-offset-8 hover:text-sky-500 hover:underline"
            href={`/staff/${shift.employeeId}`}
          >
            {shift?.employee.name}
          </Link>
        </Heading>
      </div>
      <div className="">
        {index === 0 && <Label>Time</Label>}

        <div className="">
          <Heading size={"xxs"} className=" font-normal">
            {formatTime(shift.start)} - {formatTime(shift.end)}
          </Heading>
        </div>
      </div>

      <div className="ml-11 w-36">
        {index === 0 && <Label>Total</Label>}
        <Heading size={"xxs"}>{formatTotal(shift.start, shift.end)}</Heading>
      </div>

      <div className="flex pt-5">
        <Button
          title="Edit Shift"
          onClick={() => setEditMode(true)}
          className="mr-2"
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

      {editMode && (
        <EditModal
          shift={shift}
          showModal={editMode}
          shiftModels={shiftModels}
          setEditMode={setEditMode}
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
