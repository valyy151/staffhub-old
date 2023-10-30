import { useState } from 'react';
import { api, EmployeeProfile } from '~/utils/api';
import { formatTime, formatTotal } from '~/utils/dateFormatting';

import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter,
    AlertDialogHeader, AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import FormModal from '@/components/ui/form-modal';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useQueryClient } from '@tanstack/react-query';

import Heading from '../ui/heading';
import RolesDropdown from '../WorkDay/RolesDropdown';

type Props = {
  date: number;
  employee: EmployeeProfile;
  setEdit: (edit: boolean) => void;
  shift?: {
    id: string;
    start: number;
    end: number;
    employeeId: string;
    userId: string;
    date: number;
    roleId: string | null;
    absenceId: string | null;
  };
  shiftModels: {
    id: string;
    end: number;
    start: number;
  }[];
};

export default function EditShift({
  date,
  shift,
  setEdit,
  employee,
  shiftModels,
}: Props) {
  const [end, setEnd] = useState<number>(shift?.end ?? 0);
  const [start, setStart] = useState<number>(shift?.start ?? 0);

  const [showDelete, setShowDelete] = useState<boolean>(false);

  const [role, setRole] = useState<{ name: string; id: string }>({
    id: "",
    name: "",
  });

  function handleTimeChange(newTime: string, field: "start" | "end"): void {
    const [hour, minute]: string[] = newTime.split(":");
    const newDate: Date = new Date(date * 1000);
    newDate.setHours(Number(hour));
    newDate.setMinutes(Number(minute));
    const newUnixTime = Math.floor(newDate.getTime() / 1000);

    field === "start" ? setStart(newUnixTime) : setEnd(newUnixTime);
  }

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createShiftMutation = api.shift.create.useMutation({
    onSuccess: () => {
      setEdit(false);
      void queryClient.invalidateQueries();
      toast({
        title: "Shift created successfully.",
      });
    },

    onError: () => {
      toast({
        title: "There was a problem creating the shift.",
        variant: "destructive",
      });
    },
  });

  const updateShiftMutation = api.shift.update.useMutation({
    onSuccess: () => {
      setEdit(false);
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

  const deleteShiftMutation = api.shift.delete.useMutation({
    onSuccess: () => {
      setEdit(false);
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

  function updateShift(shiftId: string | null) {
    if (!shiftId) {
      createShiftMutation.mutate({
        end,
        date,
        start,
        roleId: role.id,
        employeeId: employee.id!,
      });
      return;
    }
    updateShiftMutation.mutate({
      shiftId,
      shift: { start, end, roleId: role.id },
    });
  }

  function deleteShift() {
    deleteShiftMutation.mutate({
      shiftId: shift?.id!,
    });
  }

  return (
    <>
      <AlertDialog open>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {employee.name} -{"  "}
              {new Date(date * 1000).toLocaleDateString("en-GB", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </AlertDialogTitle>
          </AlertDialogHeader>
          <div className="flex w-fit flex-col">
            {employee?.roles?.length! > 0 && (
              <RolesDropdown
                role={role}
                setRole={setRole}
                roles={employee.roles}
              />
            )}
            <div className="mt-4 flex space-x-1">
              <div>
                <Label className="ml-2">Start</Label>
                <Input
                  value={formatTime(start)}
                  className="w-36 text-lg"
                  onKeyDown={(e) => {
                    if (e.key === "Backspace") {
                      e.currentTarget.select();
                      handleTimeChange("", "start");
                    }
                  }}
                  onChange={(e) => handleTimeChange(e.target.value, "start")}
                />
              </div>
              <div>
                <Label className="ml-2">End</Label>
                <Input
                  value={formatTime(end)}
                  className="w-36 text-lg"
                  onKeyDown={(e) => {
                    if (e.key === "Backspace") {
                      e.currentTarget.select();
                      handleTimeChange("", "end");
                    }
                  }}
                  onChange={(e) => handleTimeChange(e.target.value, "end")}
                />
              </div>
              <div>
                <Label className="ml-4">Total</Label>
                <Heading
                  size={"xs"}
                  className="h-14 border-none px-4 py-1 text-2xl disabled:cursor-default"
                >
                  {formatTotal(start, end)}
                </Heading>
              </div>
            </div>
          </div>
          <div>
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
                    className="cursor-pointer font-medium hover:text-sky-500"
                  >
                    {formatTime(shiftModel.start)} -{" "}
                    {formatTime(shiftModel.end)}
                  </Heading>
                ))}
            </div>
          </div>

          <AlertDialogFooter className="mt-2">
            {shift && (
              <Button
                variant={"link"}
                onClick={() => setShowDelete(true)}
                className="mr-auto pb-0 pl-0 hover:text-rose-500"
              >
                Delete Shift
              </Button>
            )}
            <AlertDialogCancel onClick={() => setEdit(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={() => updateShift(shift?.id ?? null)}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {showDelete && (
        <FormModal
          submit={deleteShift}
          showModal={showDelete}
          heading="Are you absolutely sure?"
          cancel={() => setShowDelete(false)}
          text="Are you sure you want to delete this shift?"
        />
      )}
    </>
  );
}
