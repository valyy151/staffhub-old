import { ClipboardEdit, Clock, MoreVertical, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { api } from "~/utils/api";
import {
  formatDateLong,
  formatDay,
  formatTime,
  formatTotal,
} from "~/utils/dateFormatting";

import { Button } from "@/components/ui/button";
import { PopoverContent } from "@/components/ui/popover";
import { TableCell, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { Popover, PopoverTrigger } from "@radix-ui/react-popover";
import { useQueryClient } from "@tanstack/react-query";

import FormModal from "../ui/form-modal";
import EditShift from "./EditShift";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type ShiftProps = {
  shift: {
    id: string;
    end: number;
    date: number;
    start: number;
    userId: string;
    employeeId: string;
    roleId: string | null;
    absence: { id: string; reason: string; absent: boolean } | null;
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

  const [absent, setAbsent] = useState<boolean>(shift.absence?.absent || false);

  const [editMode, setEditMode] = useState<boolean>(false);

  const [reason, setReason] = useState<string>(shift.absence?.reason || "");

  const [editAbsence, setEditAbsence] = useState<boolean>(false);

  const { toast } = useToast();

  const queryClient = useQueryClient();

  const updateAbsenceMutation = api.shift.createOrUpdateAbsence.useMutation({
    onSuccess: () => {
      toast({
        title: "Absence updated successfully.",
      });
      setEditAbsence(false);
      void queryClient.invalidateQueries();
    },

    onError: () => {
      toast({
        title: "There was a problem updating the absence.",
        variant: "destructive",
      });
    },
  });

  const deleteShiftMutation = api.shift.delete.useMutation({
    onSuccess: () => {
      void queryClient.invalidateQueries();
      toast({
        title: "Shift deleted successfully.",
      });
    },

    onError: () => {
      toast({
        title: "There was a problem deleting the shift.",
        variant: "destructive",
      });
    },
  });

  function deleteShift() {
    deleteShiftMutation.mutate({ shiftId: shift.id });
    setShowModal(false);
  }

  return (
    <>
      <TableRow className="">
        <TableCell>
          <Link
            href={`/staff/${shift.employeeId}`}
            className="underline-offset-4 hover:underline"
          >
            {shift.employee.name}
          </Link>
        </TableCell>
        <TableCell>
          <span
            onClick={() => setEditMode(true)}
            className="cursor-pointer hover:underline"
          >
            {formatTime(shift.start)} - {formatTime(shift.end)}
          </span>
        </TableCell>
        <TableCell>
          <span
            onClick={() => setEditMode(true)}
            className="cursor-pointer p-4"
          >
            {shift.role?.name || "-"}
          </span>
        </TableCell>
        <TableCell>{formatTotal(shift.start, shift.end)}</TableCell>
        <TableCell className="text-right">
          <span
            onClick={() => setEditAbsence(true)}
            className="cursor-pointer hover:underline"
          >
            {shift.absence?.absent && "Absent"}
          </span>
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
                <Clock size={16} />
                <span className="text-sm font-medium">Edit Shift</span>
              </button>

              <button
                onClick={() => setEditAbsence(true)}
                className="flex w-full items-center space-x-2 rounded-lg px-2 py-2 text-gray-500 hover:bg-gray-200 active:bg-gray-300 dark:text-gray-400 dark:hover:bg-gray-600 dark:active:bg-gray-500"
              >
                <ClipboardEdit size={16} />
                <span className="text-sm font-medium">Edit Absence</span>
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
        <EditShift
          shift={shift}
          setEditMode={setEditMode}
          shiftModels={shiftModels}
        />
      )}
      {editAbsence && (
        <AlertDialog open>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Edit Absence for {shift.employee.name}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {formatDay(shift.date)}, {formatDateLong(shift.date)}
              </AlertDialogDescription>
            </AlertDialogHeader>

            <Label htmlFor="ended" className="flex w-fit flex-col">
              Absent
              <Switch
                id="ended"
                checked={absent}
                className="mt-0.5"
                onClick={() => setAbsent(!absent)}
              />
            </Label>
            <Label htmlFor="reason">
              Reason
              <Input
                type="text"
                id="reason"
                value={reason}
                className="mt-0.5 w-fit"
                onChange={(e) => setReason(e.target.value)}
              />
            </Label>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setEditAbsence(false)}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  updateAbsenceMutation.mutate({
                    reason,
                    absent,
                    shiftId: shift.id,
                  });
                }}
              >
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
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
