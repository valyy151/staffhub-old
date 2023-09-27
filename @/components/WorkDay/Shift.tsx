import { ClipboardEdit, MoreVertical, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { api } from '~/utils/api';
import { formatTime, formatTotal } from '~/utils/dateFormatting';

import { Button } from '@/components/ui/button';
import { PopoverContent } from '@/components/ui/popover';
import { TableCell, TableRow } from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import { Popover, PopoverTrigger } from '@radix-ui/react-popover';
import { useQueryClient } from '@tanstack/react-query';

import FormModal from '../ui/form-modal';
import EditModal from './EditModal';

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

  const { toast } = useToast();

  const queryClient = useQueryClient();

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
