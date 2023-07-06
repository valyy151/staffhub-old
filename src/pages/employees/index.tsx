import Link from "next/link";
import { api } from "~/utils/api";
import { UserPlus } from "lucide-react";
import { useEffect, useState } from "react";
import Spinner from "~/components/ui/Spinner";
import { buttonVariants } from "~/components/ui/Button";
import EmployeesTable from "~/components/Employees/EmployeesTable";
import Heading from "~/components/ui/Heading";

interface Employee {
  id: string;
  name: string;
  email: string;
  address: string;
  phoneNumber: string;
}

export default function EmployeesListPage() {
  const [loading, setLoading] = useState<boolean>(true);
  const [employees, setEmployees] = useState<Employee[]>([]);

  const { data } = api.employee.getAllEmployees.useQuery();

  useEffect(() => {
    if (data) {
      setEmployees(data);
    }
    setLoading(false);
  }, [data]);

  return (
    <main className="flex flex-col items-center">
      {loading ? (
        <Spinner />
      ) : employees?.length > 0 ? (
        <EmployeesTable data={employees} />
      ) : (
        <>
          <Heading size={"sm"} className="mt-6">
            You do not currently have any employees on your account.
          </Heading>
          <Heading size={"xs"} className="mt-2">
            Click below if you wish to create an employee.
          </Heading>{" "}
          <Link href="/employees/new" className={`${buttonVariants({})} mt-4`}>
            New Employee {<UserPlus className="ml-2" />}
          </Link>
        </>
      )}
    </main>
  );
}
