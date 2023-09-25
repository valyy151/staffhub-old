import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import Heading from "../ui/heading";

import { type WorkDay, api, Employee } from "~/utils/api";
import SearchEmployees from "./SearchEmployees";
import { ArrowLeft, Clock8 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { formatTime, formatTotal } from "~/utils/dateFormatting";
import Link from "next/link";
import RolesDropdown from "./RolesDropdown";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ReactModal from "react-modal";

type AddShiftProps = {
  data: WorkDay;
  showAddShift: boolean;
  setShowAddShift: (showAddShift: boolean) => void;
};

export default function AddShift({
  data,
  setShowAddShift,
  showAddShift,
}: AddShiftProps) {
  const [openStaff, setOpenStaff] = useState<boolean>(false);
  const [openRoles, setOpenRoles] = useState<boolean>(false);

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
    <ReactModal
      isOpen={showAddShift}
      className="fixed inset-0 flex items-center justify-center bg-[rgba(16,17,30,0.7)]"
    >
      <div className="flex flex-col items-start rounded-lg bg-background p-8">
        <Heading size={"sm"}>
          Add a new shift {employee.name && "for"}{" "}
          <Link href={`/staff/${employee.id}`} className="hover:text-sky-500">
            {employee.name}
          </Link>
        </Heading>

        <form
          onSubmit={handleSubmit}
          className="mt-2 flex flex-col items-center"
        >
          <div className="flex space-x-8">
            <div className="mt-auto flex flex-col">
              <Label className="mb-1">Employee</Label>

              <SearchEmployees
                isOpen={openStaff}
                setIsSick={setIsSick}
                employee={employee}
                employees={employees}
                setEmployee={setEmployee}
                setEndDate={setEndDate}
                setIsOpen={setOpenStaff}
                setOpenRoles={setOpenRoles}
                setIsOnVacation={setIsOnVacation}
                setRemainingDays={setRemainingDays}
              />

              <div className="mr-auto mt-2 flex w-full space-x-1">
                <Button size={"lg"} title="Create shift">
                  {<Clock8 className="mr-2" />} Create
                </Button>

                <Button
                  title="Cancel shift creation"
                  size={"lg"}
                  type="button"
                  variant={"subtle"}
                  onClick={() => setShowAddShift(false)}
                >
                  {<ArrowLeft className="mr-2" />} Cancel
                </Button>
              </div>
            </div>
            <div className="flex flex-col">
              <div className="mb-auto flex space-x-3">
                <div className="mt-auto flex flex-col">
                  <Label className="mb-1" htmlFor="start">
                    Start
                  </Label>

                  <Input
                    type="text"
                    name="start"
                    placeholder="Start time"
                    value={formatTime(start)}
                    className="m-0 w-44 text-xl"
                    onChange={(e) => handleTimeChange(e.target.value, "start")}
                  />
                </div>

                <div className="mb-auto flex flex-col">
                  <Label className="mb-1" htmlFor="end">
                    End
                  </Label>

                  <Input
                    name="end"
                    type="text"
                    placeholder="End time"
                    value={formatTime(end)}
                    className="m-0 w-44 text-xl"
                    onChange={(e) => handleTimeChange(e.target.value, "end")}
                  />
                </div>
                {employee.roles?.length > 0 && (
                  <div className="mb-auto flex flex-col">
                    <Label className="mb-1" htmlFor="end">
                      Role
                    </Label>

                    <RolesDropdown
                      role={role}
                      setRole={setRole}
                      isOpen={openRoles}
                      roles={employee.roles}
                      setIsOpen={setOpenRoles}
                      setOpenStaff={setOpenStaff}
                    />
                  </div>
                )}
              </div>

              <Heading size={"xs"} className="font-normal">
                Total hours:{" "}
                <span className="font-semibold">{formatTotal(start, end)}</span>
              </Heading>
            </div>
          </div>
        </form>
        {data.shiftModels.length > 1 && (
          <div className="pt-8">
            <Heading size={"xs"}>Select a shift:</Heading>
            <div className="grid grid-cols-2 gap-8">
              {data.shiftModels
                .sort((a, b) => a.start - b.start)
                .map((shift) => (
                  <Heading
                    size={"xs"}
                    onClick={() => {
                      handleTimeChange(formatTime(shift.start)!!, "start");
                      handleTimeChange(
                        formatTime(shift.end) === "00:00"
                          ? "24:00"
                          : formatTime(shift.end)!!,
                        "end"
                      );
                    }}
                    className="mt-2 cursor-pointer font-normal underline-offset-8 hover:text-sky-500 hover:underline"
                  >
                    {formatTime(shift.start)} - {formatTime(shift.end)}
                  </Heading>
                ))}
            </div>
          </div>
        )}

        {isSick && (
          <>
            <Heading
              size={"sm"}
              className="mt-4 font-normal text-rose-700 dark:text-rose-400"
            >
              {employee.name} is on sick leave untill{" "}
              {new Date(endDate).toLocaleDateString("en-GB", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
              .
            </Heading>
            <Heading size={"sm"} className="mt-2 font-normal">
              Ends in {remainingDays} days.
            </Heading>
          </>
        )}

        {isOnVacation && (
          <>
            <Heading
              size={"sm"}
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
            <Heading size={"sm"} className="mt-2 font-normal">
              Ends in {remainingDays} days.
            </Heading>
          </>
        )}
      </div>
    </ReactModal>
  );
}