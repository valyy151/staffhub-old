import { Dispatch, SetStateAction, useEffect, useState } from "react";
import Heading from "../ui/Heading";
import Input from "../ui/Input";
import { formatTime, formatTotal } from "~/utils/dateFormatting";
import Paragraph from "../ui/Paragraph";
import { Button } from "../ui/Button";
import { Check, X } from "lucide-react";

import { Employee, Shift, WorkDay, WorkDayNote } from "@prisma/client";
import SearchEmployees from "./SearchEmployees";
import { api } from "~/utils/api";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface AddShiftProps {
  setShowAddShift: (showAddShift: boolean) => void;
  data: WorkDay & { shifts: Shift[]; notes: WorkDayNote[] };
}

export default function AddShift({ data, setShowAddShift }: AddShiftProps) {
  const [name, setName] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [employeeId, setEmployeeId] = useState<string>("");
  const [end, setEnd] = useState<number | undefined>(undefined);
  const [start, setStart] = useState<number | undefined>(undefined);

  const handleTimeChange = (newTime: string, field: "start" | "end") => {
    // convert the new time into Unix timestamp
    if (data) {
      const [hour, minute]: string[] = newTime.split(":");
      const newDate: any = new Date(data.date * 1000);
      newDate.setHours(hour);
      newDate.setMinutes(minute);
      const newUnixTime = Math.floor(newDate.getTime() / 1000);

      field === "start" ? setStart(newUnixTime) : setEnd(newUnixTime);
    }
  };

  const { data: employees } = api.employee.find.useQuery();

  const queryClient = useQueryClient();

  const createShift = api.shift.create.useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries();
      toast.success("Shift created successfully.");
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (end && start && employeeId) {
      createShift.mutate({
        end: end,
        start: start,
        date: data.date,
        employeeId: employeeId,
      });
    }

    setShowAddShift(false);
  };

  return (
    <>
      {employees && (
        <div className="mx-auto w-10/12">
          <Heading size={"sm"} className="text-center">
            Add a New Shift
          </Heading>
          <form
            onSubmit={handleSubmit}
            className="mt-2 flex justify-center space-x-12"
          >
            <div className="mt-auto flex flex-col">
              <label className="text-center">Employee</label>

              <SearchEmployees
                name={name}
                isOpen={isOpen}
                setName={setName}
                employees={employees}
                setIsOpen={setIsOpen}
                setId={setEmployeeId}
              />
            </div>
            <div className="flex space-x-3">
              <div className="mt-auto flex flex-col">
                <label htmlFor="start" className="text-center">
                  Start
                </label>
                <Input
                  type="text"
                  name="start"
                  placeholder="Start time"
                  value={formatTime(start)}
                  className="m-0 text-center text-lg"
                  onChange={(e) => handleTimeChange(e.target.value, "start")}
                />
              </div>

              <div className="mt-auto flex flex-col">
                <label htmlFor="end" className="text-center">
                  End
                </label>
                <Input
                  name="end"
                  type="text"
                  placeholder="End time"
                  value={formatTime(end)}
                  className="m-0 text-center text-lg"
                  onChange={(e) => handleTimeChange(e.target.value, "end")}
                />
              </div>
            </div>
            <div className="mt-auto flex w-48 flex-col">
              <label className="text-center">Total</label>
              <Paragraph className="mb-2 mt-auto font-semibold">
                {formatTotal(start, end)}
              </Paragraph>
            </div>
            <div className="mb-1 mt-auto flex space-x-2">
              <Button
                size={"sm"}
                type="button"
                variant={"subtle"}
                onClick={() => setShowAddShift(false)}
              >
                Cancel {<X className="ml-1 h-4 w-4" />}
              </Button>
              <Button size={"sm"} title="Create shift">
                Create {<Check className="ml-1 h-4 w-4" />}
              </Button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
