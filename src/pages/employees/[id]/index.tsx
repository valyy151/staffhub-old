import { Employee, WorkDay } from "@prisma/client";
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
  const { data } = api.employee.findOne.useQuery({ id: query.id });

  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [workDays, setWorkDays] = useState<WorkDay[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [month, setMonth] = useState<string | null>(null);

  const [value, setValue] = useState<Date | null>(null);

  // const location = useLocation();

  const isNotes: boolean = location.pathname.includes("/notes");
  const isAbout: boolean = location.pathname.includes("/about");
  const isVacation: boolean = location.pathname.includes("/vacation");
  const isSchedule: boolean = location.pathname.includes("/schedule");
  const isPreferences: boolean = location.pathname.includes("/preferences");

  return (
    <div
      className="h-screen overflow-y-hidden p-4"
      onClick={() => showDropdown && setShowDropdown(false)}
    >
      {/* {employee && isAbout && (
        <PersonalInfo
          loading={loading}
          employee={employee}
          setError={setError}
          setLoading={setLoading}
          setMessage={setMessage}
          showDropdown={showDropdown}
          setShowDropdown={setShowDropdown}
        />
      )}
      {employee && isPreferences && (
        <ShiftPreferencesList
          loading={loading}
          setError={setError}
          employee={employee}
          setMessage={setMessage}
          setLoading={setLoading}
          showDropdown={showDropdown}
          setShowDropdown={setShowDropdown}
        />
      )}
      {employee && isNotes && (
        <NotesList
          loading={loading}
          setError={setError}
          employee={employee}
          setLoading={setLoading}
          setMessage={setMessage}
          showDropdown={showDropdown}
          setShowDropdown={setShowDropdown}
        />
      )}
      {employee && isVacation && (
        <VacationList
          loading={loading}
          setError={setError}
          employee={employee}
          setMessage={setMessage}
          setLoading={setLoading}
          showDropdown={showDropdown}
          setShowDropdown={setShowDropdown}
        />
      )}
      {employee && isSchedule && (
        <Schedule
          value={value}
          month={month}
          workDays={workDays}
          loading={loading}
          setValue={setValue}
          setError={setError}
          employee={employee}
          setMessage={setMessage}
          setLoading={setLoading}
          showDropdown={showDropdown}
          setShowDropdown={setShowDropdown}
        />
      )} */}
      {employee &&
        !isNotes &&
        !isAbout &&
        !isPreferences &&
        !isVacation &&
        !isSchedule && (
          <EmployeeProfile
            workDays={workDays}
            employee={employee}
            showDropdown={showDropdown}
            setShowDropdown={setShowDropdown}
          />
        )}
    </div>
  );
}
