import Link from "next/link";
import FormModal from "../ui/FormModal";
import { useState } from "react";
import { api } from "~/utils/api";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { ClipboardEdit, MoreVertical, Trash2 } from "lucide-react";
import { formatTime, formatTotal } from "~/utils/dateFormatting";
import EditModal from "./EditModal";
import { TableCell, TableRow } from "@/components/ui/table";
import { Popover, PopoverTrigger } from "@radix-ui/react-popover";
import { PopoverContent } from "@/components/ui/popover";

type ShiftProps = {
  shift: {
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

  shiftModels: {
    end: number;
    start: number;
  }[];
};

export default function Shift({ shift, shiftModels }: ShiftProps) {
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
    <>
      <TableRow className="dark:border-slate-700">
        <TableCell>
          <Link
            href={`/staff/${shift.employeeId}`}
            className="underline-offset-4 hover:underline"
          >
            {shift.employee.name}
          </Link>
        </TableCell>
        <TableCell>
          {formatTime(shift.start)} - {formatTime(shift.end)}
        </TableCell>
        <TableCell>{shift.role ? shift.role.name : "-"}</TableCell>
        <TableCell className="text-right">
          {formatTotal(shift.start, shift.end)}
        </TableCell>
        <TableCell>
          <Popover>
            <PopoverTrigger>
              <Button
                className="rounded bg-transparent px-2 py-1 text-black hover:bg-gray-200 active:bg-gray-300 dark:text-gray-300 dark:hover:bg-gray-600 dark:active:bg-gray-500"
                type="button"
              >
                <MoreVertical size={16} />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-40 bg-white dark:bg-gray-800">
              <button
                onClick={() => setEditMode(true)}
                className="flex w-full items-center space-x-2 rounded-lg px-2 py-2 text-gray-500 hover:bg-gray-200 active:bg-gray-300 dark:text-gray-400 dark:hover:bg-gray-600 dark:active:bg-gray-500"
              >
                <ClipboardEdit size={16} />
                <span className="text-sm font-medium">Edit</span>
              </button>

              <button
                onClick={() => setShowModal(true)}
                className="flex w-full items-center space-x-2 rounded-lg px-2 py-2 text-gray-500 hover:bg-gray-200 active:bg-gray-300 dark:text-gray-400 dark:hover:bg-gray-600 dark:active:bg-gray-500"
              >
                <Trash2 size={16} />
                <span className="text-sm font-medium">Delete</span>
              </button>
            </PopoverContent>
          </Popover>
        </TableCell>
      </TableRow>
      {editMode && (
        <EditModal
          shift={shift}
          showModal={editMode}
          setEditMode={setEditMode}
          shiftModels={shiftModels}
        />
      )}
      {showModal && (
        <FormModal
          heading="Delete Shift?"
          showModal={showModal}
          cancel={() => setShowModal(false)}
          submit={deleteShift}
          text="Are you sure you want to delete this shift?"
        />
      )}
    </>
  );
}
