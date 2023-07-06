import { UserPlus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import ScheduleMaker from "~/components/Schedule/ScheduleMaker";
import { buttonVariants } from "~/components/ui/Button";
import Heading from "~/components/ui/Heading";
import Spinner from "~/components/ui/Spinner";
import { api } from "~/utils/api";

interface Employee {
  id: string;
  name: string;
  email: string;
  address: string;
  phoneNumber: string;
}

export default function NewSchedulePage() {
  const [id, setId] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [shiftPreferences, setShiftPreferences] = useState<string[]>([]);

  const { data } = api.employee.getAllEmployees.useQuery();

  useEffect(() => {
    if (data) {
      setEmployees(data);
    }
    setLoading(false);
  }, [data]);

  return (
    <main
      className="flex flex-col items-center"
      onClick={() => (isOpen ? setIsOpen(false) : null)}
    >
      {loading ? (
        <Spinner />
      ) : employees.length > 0 ? (
        <>
          <ScheduleMaker
            id={id}
            name={name}
            setId={setId}
            isOpen={isOpen}
            setName={setName}
            employees={employees}
            setIsOpen={setIsOpen}
            shiftPreferences={shiftPreferences}
            setShiftPreferences={setShiftPreferences}
          />
        </>
      ) : (
        <>
          <Heading className="mt-6" size={"sm"}>
            You do not currently have any employees on your account to create a
            schedule.
          </Heading>
          <Heading size={"xs"} className="mt-2">
            Click below if you wish to create an employee.
          </Heading>
          <Link
            href="/employees/new"
            title="Create a new employee"
            className={`${buttonVariants()} mt-4`}
          >
            New Employee {<UserPlus className="ml-2" />}
          </Link>
        </>
      )}
    </main>
  );
}
