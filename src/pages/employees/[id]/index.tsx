import { Employee, EmployeeNote, Vacation, WorkDay } from "@prisma/client";
import { useState } from "react";
import EmployeeProfile from "~/components/Employees/EmployeeProfile";

import { api } from "~/utils/api";

interface EmployeeProfileProps {
  query: { id: string };
}

EmployeeProfilePage.getInitialProps = ({ query }: EmployeeProfileProps) => {
  return { query };
};

export default function EmployeeProfilePage({ query }: EmployeeProfileProps) {
  const { data }: any = api.employee.findOne.useQuery({ id: query.id });

  const [showDropdown, setShowDropdown] = useState<boolean>(false);

  return (
    <main
      className="px-12 pb-80 pt-24"
      onClick={() => showDropdown && setShowDropdown(false)}
    >
      {data && (
        <EmployeeProfile
          employee={data}
          showDropdown={showDropdown}
          setShowDropdown={setShowDropdown}
        />
      )}
    </main>
  );
}
