import Input from "../ui/Input";
import { useState } from "react";
import toast from "react-hot-toast";
import Heading from "../ui/Heading";
import { Button } from "../ui/Button";
import Paragraph from "../ui/Paragraph";
import { WorkDay, api } from "~/utils/api";
import SearchEmployees from "./SearchEmployees";
import { ArrowLeft, Clock8 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { formatTime, formatTotal } from "~/utils/dateFormatting";

interface AddShiftProps {
  data: WorkDay;
  setShowAddShift: (showAddShift: boolean) => void;
}

export default function AddShift({ data, setShowAddShift }: AddShiftProps) {
  const [name, setName] = useState<string>("");

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const [employeeId, setEmployeeId] = useState<string>("");

  const [end, setEnd] = useState<number>(0);
  const [start, setStart] = useState<number>(0);

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
      setShowAddShift(false);
      queryClient.invalidateQueries();
      toast.success("Shift created successfully.");
    },
    onError: () => {
      toast.error("There was an error creating the shift.");
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!end || !start) {
      return toast.error("Please fill the start and end time.");
    }

    if (data.date) {
      createShift.mutate({
        end: end,
        start: start,
        date: data.date,
        employeeId: employeeId,
      });
    }
  };

  return (
    <div className="mx-auto">
      <Heading size={"sm"}>
        Add a new shift {name && "for"} {name}
      </Heading>

      <form onSubmit={handleSubmit} className="mt-2 flex flex-col items-center">
        <div className="flex space-x-8">
          <div className="mt-auto flex w-96 flex-col">
            <label className="ml-2 text-xl">Employee</label>

            <SearchEmployees
              name={name}
              isOpen={isOpen}
              setName={setName}
              employees={employees}
              setIsOpen={setIsOpen}
              setId={setEmployeeId}
            />

            <div className="mr-auto mt-2 flex w-full space-x-1">
              <Button
                size={"lg"}
                title="Create shift"
                className="h-14 w-full text-xl"
              >
                {<Clock8 className="mr-2" />} Create
              </Button>

              <Button
                title="Cancel shift creation"
                size={"lg"}
                type="button"
                variant={"subtle"}
                className="h-14 w-full text-xl"
                onClick={() => setShowAddShift(false)}
              >
                {<ArrowLeft className="mr-2" />} Cancel
              </Button>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="mb-auto flex space-x-3">
              <div className="mt-auto flex flex-col">
                <label htmlFor="start" className="ml-2 text-xl">
                  Start
                </label>

                <Input
                  type="text"
                  name="start"
                  placeholder="Start time"
                  value={formatTime(start)}
                  className="m-0 h-14 w-32 text-xl"
                  onChange={(e) => handleTimeChange(e.target.value, "start")}
                />
              </div>

              <div className="mb-auto flex flex-col">
                <label htmlFor="end" className="ml-2 text-xl">
                  End
                </label>

                <Input
                  name="end"
                  type="text"
                  placeholder="End time"
                  value={formatTime(end)}
                  className="m-0 h-14 w-32 text-xl"
                  onChange={(e) => handleTimeChange(e.target.value, "end")}
                />
              </div>
            </div>

            <Heading size={"sm"} className="font-normal">
              Total hours:{" "}
              <span className="font-semibold">{formatTotal(start, end)}</span>
            </Heading>
          </div>
        </div>
      </form>
    </div>
  );
}
