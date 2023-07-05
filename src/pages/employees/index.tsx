import Link from "next/link";
import { api } from "~/utils/api";
import { UserPlus } from "lucide-react";
import { useEffect, useState } from "react";
import Spinner from "~/components/ui/Spinner";
import { buttonVariants } from "~/components/ui/Button";
import EmployeesTable from "~/components/Employees/EmployeesTable";

interface Employee {
  name: string;
  email: string;
  phone: string;
  address: string;
}

const EmployeesListPage = () => {
  const [employees, setEmployees] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { data } = api.employee.getAllEmployees.useQuery();

  useEffect(() => {
    if (data) {
      setEmployees(data);
    }
  }, [data]);

  return (
    <main className="flex flex-col items-center">
      {loading ? (
        <Spinner />
      ) : employees?.length > 0 ? (
        <EmployeesTable data={employees} />
      ) : (
        <>
          <h1 className="slide-in-bottom mb-2 mt-6 text-center">
            You do not currently have any employees on your account.
          </h1>
          <h2 className="slide-in-bottom text-center">
            Click below if you wish to create an employee.
          </h2>{" "}
          <Link href="/employees/new" className={`${buttonVariants({})}`}>
            New Employee {<UserPlus className="ml-2" />}
          </Link>
        </>
      )}
    </main>
  );
};

export default EmployeesListPage;
