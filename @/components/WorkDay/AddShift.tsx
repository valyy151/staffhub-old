import Link from "next/link";
import { useEffect, useState } from "react";
import { api, Employee, WorkDay } from "~/utils/api";
import { formatTime, formatTotal } from "~/utils/dateFormatting";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";

import SelectEmployee from "../Schedule/SelectEmployee";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "../ui/alert-dialog";
import Heading from "../ui/heading";
import RolesDropdown from "./RolesDropdown";

type AddShiftProps = {
  data: WorkDay;
  setShowAddShift: (showAddShift: boolean) => void;
};

export default function AddShift({ data, setShowAddShift }: AddShiftProps) {
  const [employee, setEmployee] = useState<Employee>({} as Employee);

  const [role, setRole] = useState<{ id: string; name: string }>(
    {} as {
      id: string;
      name: string;
    }
  );
  const [end, setEnd] = useState<number>(0);
  const [start, setStart] = useState<number>(0);

  const [endDate, setEndDate] = useState<number>(0);
  const [isSick, setIsSick] = useState<boolean>(false);
  const [remainingDays, setRemainingDays] = useState<number>(0);
  const [isOnVacation, setIsOnVacation] = useState<boolean>(false);

  function handleTimeChange(newTime: string, field: "start" | "end") {
    // convert the new time into Unix timestamp
    if (data.date) {
      const [hour, minute]: string[] = newTime.split(":");
      const newDate: any = new Date(data.date * 1000);
      newDate.setHours(hour);
      newDate.setMinutes(minute);
      const newUnixTime = Math.floor(newDate.getTime() / 1000);

      field === "start" ? setStart(newUnixTime) : setEnd(newUnixTime);
    }
  }

  function checkIfSickOrVacation(employee: any) {
    setIsSick(false);
    setIsOnVacation(false);
    const currentDate = Date.now();

    for (const sickLeave of employee.sickLeaves) {
      const startDate: Date = new Date(Number(sickLeave.start));
      const endDate: Date = new Date(Number(sickLeave.end));

      if (
        Number(currentDate) >= Number(startDate) &&
        Number(currentDate) <= Number(endDate)
      ) {
        const remainingDays = Math.ceil(
          (Number(endDate) - currentDate) / (1000 * 60 * 60 * 24)
        );

        setIsSick(true);
        setEndDate(Number(endDate));
        setRemainingDays(remainingDays);
        return;
      }
    }

    for (const vacation of employee.vacations) {
      const startDate: Date = new Date(Number(vacation.start));
      const endDate: Date = new Date(Number(vacation.end));

      if (
        Number(currentDate) >= Number(startDate) &&
        Number(currentDate) <= Number(endDate)
      ) {
        const remainingDays = Math.ceil(
          (Number(endDate) - currentDate) / (1000 * 60 * 60 * 24)
        );

        setIsOnVacation(true);
        setEndDate(Number(endDate));
        setRemainingDays(remainingDays);
        return;
      }
    }
  }

  useEffect(() => {
    if (employee.id) {
      checkIfSickOrVacation(employee);
    }
  }, [employee]);

  const { data: employees } = api.employee.find.useQuery();

  const { toast } = useToast();

  const queryClient = useQueryClient();

  const createShift = api.shift.create.useMutation({
    onSuccess: () => {
      setShowAddShift(false);
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

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!end || !start) {
      return toast({
        title: "Please select a start and end time.",
      });
    }

    createShift.mutate({
      end: end,
      start: start,
      roleId: role.id,
      date: data.date!,
      employeeId: employee.id,
    });
  }

  return (
    <AlertDialog open>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Add a new shift {employee.name && "for"}{" "}
            <Link href={`/staff/${employee.id}`} className="hover:text-primary">
              {employee.name}
            </Link>
          </AlertDialogTitle>
        </AlertDialogHeader>
        <div className="mt-4 flex flex-col space-y-4">
          <SelectEmployee
            employee={employee}
            employees={employees}
            setEmployee={setEmployee}
          />
          {employee.roles?.length > 0 && (
            <RolesDropdown
              role={role}
              setRole={setRole}
              roles={employee.roles}
            />
          )}
          <div>
            <Label>Start Time</Label>
            <Input
              type="text"
              value={formatTime(start)}
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
            <Label>End Time</Label>
            <Input
              type="text"
              value={formatTime(end)}
              onKeyDown={(e) => {
                if (e.key === "Backspace") {
                  e.currentTarget.select();
                  handleTimeChange("", "end");
                }
              }}
              onChange={(e) => handleTimeChange(e.target.value, "end")}
            />
          </div>

          <Heading size={"xxs"} className="font-normal">
            Total hours:{" "}
            <span className="font-semibold">{formatTotal(start, end)}</span>
          </Heading>
          {data.shiftModels.length > 1 && (
            <div>
              <Heading size={"xxs"}>Select a shift:</Heading>
              <div className="flex flex-col">
                {data.shiftModels
                  .sort((a, b) => a.start - b.start)
                  .map((shift) => (
                    <Heading
                      size={"xxs"}
                      onClick={() => {
                        handleTimeChange(formatTime(shift.start)!!, "start");
                        handleTimeChange(
                          formatTime(shift.end) === "00:00"
                            ? "24:00"
                            : formatTime(shift.end)!!,
                          "end"
                        );
                      }}
                      className="mt-2 cursor-pointer font-normal hover:text-primary"
                    >
                      {formatTime(shift.start)} - {formatTime(shift.end)}
                    </Heading>
                  ))}
              </div>
            </div>
          )}

          {isSick && (
            <Heading
              size={"xxs"}
              className="mt-4 font-normal text-rose-700 dark:text-rose-400"
            >
              {employee.name} is on sick leave untill{" "}
              {new Date(endDate).toLocaleDateString("en-GB", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
              . Ends in {remainingDays} days.
            </Heading>
          )}

          {isOnVacation && (
            <>
              <Heading
                size={"xxs"}
                className="mt-4 font-normal text-rose-700 dark:text-rose-400"
              >
                {employee.name} is on vacation untill{" "}
                {new Date(endDate).toLocaleDateString("en-GB", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
                .
              </Heading>
              <Heading size={"xxs"} className="mt-2 font-normal">
                Ends in {remainingDays} days.
              </Heading>
            </>
          )}
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setShowAddShift(false)}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleSubmit}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
