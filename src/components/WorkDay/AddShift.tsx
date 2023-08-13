import Input from "../ui/Input";
import { useState } from "react";
import toast from "react-hot-toast";
import Heading from "../ui/Heading";
import { Button } from "../ui/Button";
import { type WorkDay, api } from "~/utils/api";
import SearchEmployees from "./SearchEmployees";
import { ArrowLeft, Clock8 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { formatTime, formatTotal } from "~/utils/dateFormatting";
import Link from "next/link";
import RolesDropdown from "./RolesDropdown";

interface AddShiftProps {
  data: WorkDay;
  setShowAddShift: (showAddShift: boolean) => void;
}

export default function AddShift({ data, setShowAddShift }: AddShiftProps) {
  const [name, setName] = useState<string>("");
  const [role, setRole] = useState<string>("");

  const [openStaff, setOpenStaff] = useState<boolean>(false);
  const [openRoles, setOpenRoles] = useState<boolean>(false);

  const [roles, setRoles] = useState([]);
  const [employeeId, setEmployeeId] = useState<string>("");

  const [end, setEnd] = useState<number>(0);
  const [start, setStart] = useState<number>(0);

  const [endDate, setEndDate] = useState<number>(0);
  const [isSick, setIsSick] = useState<boolean>(false);
  const [remainingDays, setRemainingDays] = useState<number>(0);
  const [isOnVacation, setIsOnVacation] = useState<boolean>(false);

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
      void queryClient.invalidateQueries();
      toast.success("Shift created successfully.", {
        className: "text-xl text-center",
      });
    },
    onError: () => {
      toast.error("There was an error creating the shift.", {
        className: "text-xl text-center",
      });
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!end || !start) {
      return toast("Please fill the start and end time.", {
        className: "text-xl text-center",
      });
    }

    if (data.date) {
      createShift.mutate({
        end: end,
        role: role,
        start: start,
        date: data.date,
        employeeId: employeeId,
      });
    }
  }

  return (
    <div className="flex flex-col items-start">
      <Heading size={"sm"} className="mt-8">
        Add a new shift {name && "for"}{" "}
        <Link href={`/employees/${employeeId}`} className="hover:text-sky-500">
          {name}
        </Link>
      </Heading>

      <form onSubmit={handleSubmit} className="mt-2 flex flex-col items-center">
        <div className="flex space-x-8">
          <div className="mt-auto flex flex-col">
            <label className="ml-2 text-xl">Employee</label>

            <SearchEmployees
              name={name}
              setRole={setRole}
              setName={setName}
              isOpen={openStaff}
              setRoles={setRoles}
              setIsSick={setIsSick}
              employees={employees}
              setId={setEmployeeId}
              setEndDate={setEndDate}
              setIsOpen={setOpenStaff}
              setOpenRoles={setOpenRoles}
              setIsOnVacation={setIsOnVacation}
              setRemainingDays={setRemainingDays}
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
                  className="m-0 h-14 w-44 text-xl"
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
                  className="m-0 h-14 w-44 text-xl"
                  onChange={(e) => handleTimeChange(e.target.value, "end")}
                />
              </div>
              {roles.length > 0 && (
                <div className="mb-auto flex flex-col">
                  <label htmlFor="end" className="ml-2 text-xl">
                    Role
                  </label>

                  <RolesDropdown
                    role={role}
                    roles={roles}
                    setRole={setRole}
                    isOpen={openRoles}
                    setIsOpen={setOpenRoles}
                    setOpenStaff={setOpenStaff}
                  />
                </div>
              )}
            </div>

            <Heading size={"sm"} className="font-normal">
              Total hours:{" "}
              <span className="font-semibold">{formatTotal(start, end)}</span>
            </Heading>
          </div>
        </div>
      </form>
      {isSick && (
        <>
          <Heading
            size={"sm"}
            className="mt-4 font-normal text-rose-700 dark:text-rose-400"
          >
            {name} is on sick leave untill{" "}
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
            {name} is on vacation untill{" "}
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
  );
}
