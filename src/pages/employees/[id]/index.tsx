import { useEffect, useState } from "react";
import Spinner from "~/components/ui/Spinner";
import EmployeeProfile from "~/components/Employees/EmployeeProfile";

import { api } from "~/utils/api";

interface EmployeeProfileProps {
  query: { id: string };
}

EmployeeProfilePage.getInitialProps = ({ query }: EmployeeProfileProps) => {
  return { query };
};

export default function EmployeeProfilePage({ query }: EmployeeProfileProps) {
  const { data, isLoading } = api.employee.findOne.useQuery({ id: query.id });

  const [showDropdown, setShowDropdown] = useState<boolean>(false);

  return (
    <main
      onClick={() => showDropdown && setShowDropdown(false)}
      className="flex flex-col px-12 pb-80 pt-24"
    >
      {isLoading ? (
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
