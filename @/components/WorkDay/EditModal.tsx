import { useState } from 'react';
import { api } from '~/utils/api';
import { formatTime, formatTotal } from '~/utils/dateFormatting';

import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter,
    AlertDialogHeader, AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useQueryClient } from '@tanstack/react-query';

import Heading from '../ui/heading';
import RolesDropdown from './RolesDropdown';

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

type ModalProps = {
  shift: Shift;
  setEditMode: (editMode: boolean) => void;
  shiftModels: { start: number; end: number }[];
};

export default function EditModal({
  shift,
  shiftModels,
  setEditMode,
}: ModalProps) {
  const [end, setEnd] = useState<number>(shift.end);
  const [start, setStart] = useState<number>(shift.start);

  const [openRoles, setOpenRoles] = useState<boolean>(false);
  const [role, setRole] = useState<{ name: string; id: string }>({
    name: "",
    id: "",
  });

  function handleTimeChange(newTime: string, field: "start" | "end"): void {
    const [hour, minute]: string[] = newTime.split(":");
    const newDate: Date = new Date(shift.date * 1000);
    newDate.setHours(Number(hour));
    newDate.setMinutes(Number(minute));
    const newUnixTime = Math.floor(newDate.getTime() / 1000);

    field === "start" ? setStart(newUnixTime) : setEnd(newUnixTime);
  }

  const { toast } = useToast();
  const queryClient = useQueryClient();
  const updateShiftMutation = api.shift.update.useMutation({
    onSuccess: () => {
      void queryClient.invalidateQueries();
      toast({
        title: "Shift updated successfully.",
      });
    },

    onError: () => {
      toast({
        title: "There was a problem updating the shift.",
        variant: "destructive",
      });
    },
  });

  function updateShift(e: React.FormEvent) {
    e.preventDefault();

    updateShiftMutation.mutate({
      shiftId: shift.id,
      shift: { start, end, roleId: role.id },
    });

    setEditMode(false);
  }

  return (
    // <Dialog open onOpenChange={() => setEditMode(false)}>
    //   <DialogContent>
    //     <DialogHeader>
    //       <DialogTitle className="text-xl">
    //         {shift.employee.name} -{"  "}
    //         {new Date(shift.date * 1000).toLocaleDateString("en-GB", {
    //           weekday: "long",
    //           year: "numeric",
    //           month: "long",
    //           day: "numeric",
    //         })}
    //       </DialogTitle>
    //     </DialogHeader>
    //     <div className="flex w-fit items-center space-x-2">
    //       {shift.employee.roles.length > 0 && (
    //         <div>
    //           <Label className="ml-2">Role</Label>
    //           <RolesDropdown
    //             role={role}
    //             setRole={setRole}
    //             isOpen={openRoles}
    //             setIsOpen={setOpenRoles}
    //             roles={shift.employee.roles}
    //           />
    //         </div>
    //       )}
    //       <div>
    //         <Label className="ml-2">Start</Label>
    //         <Input
    //           value={formatTime(start)}
    //           className=" w-36 text-2xl"
    //           onChange={(e) => {
    //             handleTimeChange(e.target.value, "start");
    //           }}
    //         />
    //       </div>
    //       <div>
    //         <Label className="ml-2">End</Label>
    //         <Input
    //           value={formatTime(end)}
    //           className=" w-36 text-2xl"
    //           onChange={(e) => {
    //             handleTimeChange(e.target.value, "end");
    //           }}
    //         />
    //       </div>
    //       <div>
    //         <Label className="ml-2">Total</Label>
    //         <Heading
    //           size={"xs"}
    //           className="h-14 w-16 border-none px-4 py-3 text-2xl disabled:cursor-default"
    //         >
    //           {formatTotal(start, end)}
    //         </Heading>
    //       </div>
    //     </div>
    //     <div className="mt-4">
    //       <Heading size={"sm"}>Choose a shift:</Heading>
    //       <div className="mt-1 flex space-x-8">
    //         {shiftModels
    //           .sort((a, b) => a.start - b.start)
    //           .map((shiftModel) => (
    //             <Heading
    //               size={"xs"}
    //               onClick={() => {
    //                 handleTimeChange(formatTime(shiftModel.start)!!, "start");
    //                 handleTimeChange(
    //                   formatTime(shiftModel.end) === "00:00"
    //                     ? "24:00"
    //                     : formatTime(shiftModel.end)!!,
    //                   "end"
    //                 );
    //               }}
    //               className="cursor-pointer font-medium underline-offset-8 hover:text-sky-500 hover:underline"
    //             >
    //               {formatTime(shiftModel.start)} - {formatTime(shiftModel.end)}
    //             </Heading>
    //           ))}
    //       </div>
    //     </div>
    //     <div className="ml-auto mt-4 flex space-x-2">
    //       <Button
    //         size={"lg"}
    //         variant={"subtle"}
    //         className="text-xl"
    //         onClick={() => setEditMode(false)}
    //       >
    //         Cancel
    //       </Button>
    //       <Button size={"lg"} onClick={updateShift} className="text-xl">
    //         Save
    //       </Button>
    //     </div>
    //   </DialogContent>
    // </Dialog>
    <AlertDialog open>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {shift.employee.name} -{"  "}
            {new Date(shift.date * 1000).toLocaleDateString("en-GB", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </AlertDialogTitle>
        </AlertDialogHeader>
        <div className="flex w-fit flex-col">
          <div className="flex space-x-1">
            <div>
              <Label className="ml-2">Start</Label>
              <Input
                value={formatTime(start)}
                className="w-36 text-2xl"
                onChange={(e) => {
                  handleTimeChange(e.target.value, "start");
                }}
              />
            </div>
            <div>
              <Label className="ml-2">End</Label>
              <Input
                value={formatTime(end)}
                className="w-36 text-2xl"
                onChange={(e) => {
                  handleTimeChange(e.target.value, "end");
                }}
              />
            </div>
            <div>
              <Label className="ml-4">Total</Label>
              <Heading
                size={"xs"}
                className="h-14 w-16 border-none px-4 py-1 text-2xl disabled:cursor-default"
              >
                {formatTotal(start, end)}
              </Heading>
            </div>
          </div>
          {shift.employee.roles.length > 0 && (
            <div>
              <Label className="ml-2">Role</Label>
              <RolesDropdown
                role={role}
                setRole={setRole}
                isOpen={openRoles}
                setIsOpen={setOpenRoles}
                roles={shift.employee.roles}
              />
            </div>
          )}
        </div>
        <div className="mt-4">
          <Heading size={"xs"}>Choose a shift:</Heading>
          <div className="mt-1 flex space-x-8">
            {shiftModels
              .sort((a, b) => a.start - b.start)
              .map((shiftModel) => (
                <Heading
                  size={"xxs"}
                  onClick={() => {
                    handleTimeChange(formatTime(shiftModel.start)!!, "start");
                    handleTimeChange(
                      formatTime(shiftModel.end) === "00:00"
                        ? "24:00"
                        : formatTime(shiftModel.end)!!,
                      "end"
                    );
                  }}
                  className="cursor-pointer font-medium underline-offset-8 hover:text-sky-500 hover:underline"
                >
                  {formatTime(shiftModel.start)} - {formatTime(shiftModel.end)}
                </Heading>
              ))}
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setEditMode(false)}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={updateShift}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
