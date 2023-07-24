import { Employee, EmployeeNote, Vacation, WorkDay } from "@prisma/client";
import { useEffect, useState } from "react";
import EmployeeProfile from "~/components/Employees/EmployeeProfile";
import Spinner from "~/components/ui/Spinner";

import { api } from "~/utils/api";

interface EmployeeProfileProps {
  query: { id: string };
}

EmployeeProfilePage.getInitialProps = ({ query }: EmployeeProfileProps) => {
  return { query };
};

export default function EmployeeProfilePage({ query }: EmployeeProfileProps) {
  const [loading, setLoading] = useState<boolean>(true);

  const { data }: any = api.employee.findOne.useQuery({ id: query.id });

  const [showDropdown, setShowDropdown] = useState<boolean>(false);

  useEffect(() => {
    if (data) {
      setLoading(false);
    }
  }, [data]);

  return (
    <main
      onClick={() => showDropdown && setShowDropdown(false)}
      className="flex flex-col px-12 pb-80 pt-24"
    >
      {loading ? (
        <Spinner />
      ) : (
        <>
          {data && (
            <EmployeeProfile
              employee={data}
              showDropdown={showDropdown}
              setShowDropdown={setShowDropdown}
            />
          )}
        </>
      )}
    </main>
  );
}
