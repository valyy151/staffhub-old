import Link from "next/link";
import { useState } from "react";
import { api } from "~/utils/api";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import Paragraph from "@/components/ui/paragraph";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";

type Props = {
  absence: {
    shifts: { id: string; approved: boolean; date: number }[];
    reason: string;
    absent: boolean;
    approved: boolean;
    employee: {
      name: string;
      id: string;
    };
    amount: number;
  };
};

export default function Absence({ absence }: Props) {
  const { toast } = useToast();
  const [approveAll, setApproveAll] = useState<boolean>(false);
  const [showAbsence, setShowAbsence] = useState<boolean>(false);

  const queryClient = useQueryClient();

  const handleSwitchChange = (shiftId: string) => {
    const shift = absence.shifts.find((shift) => shift.id === shiftId);
    if (shift) {
      shift.approved = !shift.approved;
      setShifts([...absence.shifts]);
    }
  };

  const [shifts, setShifts] = useState(absence.shifts);

  const updateAbsences = api.shift.updateAbsences.useMutation({
    onSuccess: () => {
      toast({
        title: "Absences updated",
        description: "Absences have been updated successfully",
      });
      setShowAbsence(false);
      queryClient.invalidateQueries();
    },

    onError: () => {
      toast({
        variant: "destructive",
        title: "Something went wrong",
        description: "There was an error updating absences",
      });
    },
  });

  return (
    <div className="rounded-lg border bg-card py-2">
      <Paragraph className="border-b px-2 pb-1">
        <Link
          className="underline-offset-2 hover:underline"
          href={`/staff/${absence.employee.id}`}
        >
          {absence.employee.name}
        </Link>
      </Paragraph>

      <div className="flex  justify-between px-2 pt-4">
        <Paragraph size={"sm"}>
          <span className="font-light">Reason:</span> {absence.reason}
        </Paragraph>
        <Paragraph size={"sm"}>
          <span className="font-light"> Amount: </span> {absence.amount}
        </Paragraph>
        <Paragraph
          size={"sm"}
          className={`${absence.approved ? "text-green-500" : "text-rose-500"}`}
        >
          <span
            onClick={() => setShowAbsence(true)}
            className="cursor-pointer font-light text-foreground underline-offset-2 hover:underline"
          >
            Approved:{" "}
          </span>{" "}
          {absence.approved ? "Yes" : "No"}
        </Paragraph>
      </div>

      {showAbsence && (
        <AlertDialog open>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Approve Absences</AlertDialogTitle>
            </AlertDialogHeader>
            <Label className="flex w-fit flex-col">
              Approve all
              {approveAll ? (
                <Switch
                  className="mt-1"
                  onClick={() => {
                    setApproveAll(!approveAll);
                    setShifts(
                      absence.shifts.map((shift) => {
                        shift.approved = false;
                        return shift;
                      })
                    );
                  }}
                />
              ) : (
                <Switch
                  onClick={() => {
                    setApproveAll(!approveAll);
                    setShifts(
                      absence.shifts.map((shift) => {
                        shift.approved = true;
                        return shift;
                      })
                    );
                  }}
                  className="mt-1"
                />
              )}
            </Label>
            {shifts.map((shift) => (
              <div
                key={shift.id}
                className="flex items-center justify-between border-b pb-1"
              >
                <Paragraph size={"sm"}>
                  {new Date(shift.date * 1000).toLocaleDateString("en-GB", {
                    weekday: "short",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </Paragraph>
                <Label htmlFor={shift.id} className="flex w-fit flex-col">
                  Approved
                  <Switch
                    id={shift.id}
                    className="mt-1"
                    checked={shift.approved}
                    onClick={() => handleSwitchChange(shift.id)}
                  />
                </Label>
              </div>
            ))}
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setShowAbsence(false)}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() =>
                  updateAbsences.mutate(
                    shifts.map((shift) => ({
                      id: shift.id,
                      approved: shift.approved,
                    }))
                  )
                }
              >
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
