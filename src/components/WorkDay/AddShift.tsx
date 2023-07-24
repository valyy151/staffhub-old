import { Dispatch, SetStateAction, useEffect, useState } from "react";
import Heading from "../ui/Heading";
import Input from "../ui/Input";
import { formatTime, formatTotal } from "~/utils/dateFormatting";
import Paragraph from "../ui/Paragraph";
import { Button } from "../ui/Button";
import { ArrowLeft, Check, Clock, Clock10, Clock8, X } from "lucide-react";

import SearchEmployees from "./SearchEmployees";
import { WorkDay, api } from "~/utils/api";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface AddShiftProps {
  data: WorkDay;
  setShowAddShift: (showAddShift: boolean) => void;
}

export default function AddShift({ data, setShowAddShift }: AddShiftProps) {
  const [name, setName] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [employeeId, setEmployeeId] = useState<string>("");
  const [end, setEnd] = useState<number | undefined>(undefined);
  const [start, setStart] = useState<number | undefined>(undefined);

  const handleTimeChange = (newTime: string, field: "start" | "end") => {
    // convert the new time into Unix timestamp
    if (data.date) {
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

    if (data.date && end && start && employeeId) {
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
      <div className="mx-auto">
        <Heading size={"sm"}>
          Add a new shift {name && "for"} {name}
        </Heading>
        <form
          onSubmit={handleSubmit}
          className="mt-4 flex flex-col items-center"
        >
          <div className="flex space-x-8">
            <div className="mt-auto flex flex-col">
              <label className="ml-2 text-lg">Employee</label>

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
                <label htmlFor="start" className="ml-2 text-lg">
                  Start
                </label>
                <Input
                  type="text"
                  name="start"
                  placeholder="Start time"
                  value={formatTime(start)}
                  className="m-0 h-14 text-xl"
                  onChange={(e) => handleTimeChange(e.target.value, "start")}
                />
              </div>

              <div className="mt-auto flex flex-col">
                <label htmlFor="end" className="ml-2 text-lg">
                  End
                </label>
                <Input
                  name="end"
                  type="text"
                  placeholder="End time"
                  value={formatTime(end)}
                  className="m-0 h-14 text-xl"
                  onChange={(e) => handleTimeChange(e.target.value, "end")}
                />
              </div>
            </div>
            <div className="mt-auto flex flex-col">
              <label className="text-lg">Total Hours</label>
              <Paragraph
                size={"lg"}
                className="m-0 flex h-14 items-center text-3xl font-bold"
              >
                {formatTotal(start, end)}
              </Paragraph>
            </div>
          </div>
          <div className="mb-1 mt-6 flex space-x-1">
            <Button size={"lg"} title="Create shift" className="h-14 text-xl">
              {<Clock8 className="mr-2" />} Create
            </Button>
            <Button
              title="Cancel shift creation"
              size={"lg"}
              type="button"
              variant={"subtle"}
              className="h-14 text-xl"
              onClick={() => setShowAddShift(false)}
            >
              {<ArrowLeft className="mr-2" />} Cancel
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
