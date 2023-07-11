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
  const { data } = api.employee.findOne.useQuery({ id: query.id });

  const [value, setValue] = useState<Date | null>(null);
  const [month, setMonth] = useState<string | null>(null);
  const [workDays, setWorkDays] = useState<WorkDay[]>([]);

  const [showDropdown, setShowDropdown] = useState<boolean>(false);

  return (
    <main
      className="px-12 pb-80 pt-24"
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
      {data && (
        <EmployeeProfile
          employee={data}
          workDays={workDays}
          showDropdown={showDropdown}
          setShowDropdown={setShowDropdown}
        />
      )}
    </main>
  );
}
