import { type ShiftPreference } from "@prisma/client";
import { UserPlus } from "lucide-react";
import router from "next/router";
import { useState } from "react";
import ScheduleMaker from "~/components/Schedule/ScheduleMaker";
import { Button } from "~/components/ui/Button";
import Heading from "~/components/ui/Heading";
import Spinner from "~/components/ui/Spinner";
import { api } from "~/utils/api";

export default function NewSchedulePage() {
  const [name, setName] = useState<string>("");
  const [employeeId, setEmployeeId] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [shiftPreferences, setShiftPreferences] = useState<ShiftPreference[]>(
    []
  );

  const { data } = api.employee.find.useQuery();

  if (!data) {
    return <Spinner />;
  }

  if (data.length === 0) {
    return (
      <main className="flex flex-col items-center">
        <Heading className="mt-6" size={"sm"}>
          You do not currently have any employees on your account to create a
          schedule.
        </Heading>
        <Heading size={"xs"} className="mt-2">
          Click below if you wish to create an employee.
        </Heading>
        <Button
          size={"lg"}
          className="mt-4 h-14 text-2xl"
          onClick={() => router.push("/employees/new")}
        >
          <UserPlus size={30} className="mr-2" /> New Employee
        </Button>
      </main>
    );
  }

  return (
    <main
      className="flex flex-col items-center"
      onClick={() => isOpen && setIsOpen(false)}
    >
      <ScheduleMaker
        name={name}
        isOpen={isOpen}
        employees={data}
        setName={setName}
        setIsOpen={setIsOpen}
        employeeId={employeeId}
        setEmployeeId={setEmployeeId}
        shiftPreferences={shiftPreferences}
        setShiftPreferences={setShiftPreferences}
      />
    </main>
  );
}
