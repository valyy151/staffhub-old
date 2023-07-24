import Input from "../ui/Input";
import { Employee } from "~/utils/api";
import { ShiftPreference } from "@prisma/client";

interface SearchEmployeesProps {
  name: string;
  isOpen: boolean;
  employees: Employee[];
  setName: (name: string) => void;
  setEmployeeId: (id: string) => void;
  setIsOpen: (isOpen: boolean) => void;
  setShiftPreferences: (preferences: ShiftPreference[]) => void;
}

export default function SearchEmployees({
  name,
  isOpen,
  setName,
  setIsOpen,
  employees,
  setEmployeeId,
  setShiftPreferences,
}: SearchEmployeesProps) {
  function handleSelect(
    id: string,
    name: string,
    shiftPreferences: ShiftPreference[]
  ) {
    setName(name);
    setIsOpen(false);
    setEmployeeId(id);
    setShiftPreferences(shiftPreferences);
  }

  return (
    <main
      className={`group relative mb-2 mt-12 w-full cursor-pointer p-0 pt-0.5 text-lg`}
    >
      <div
        className="rounded bg-white shadow hover:shadow-md dark:bg-slate-700 dark:shadow-slate-950 "
        onClick={() => setIsOpen(!isOpen)}
      >
        <Input
          readOnly
          type="text"
          value={name}
          placeholder={"Choose an Employee..."}
          className="group m-0 h-12 cursor-pointer px-4 text-xl caret-transparent ring-offset-0  duration-150 focus:ring-0 focus:ring-offset-0 dark:placeholder:text-slate-400 dark:hover:placeholder-slate-300"
        />
      </div>
      {isOpen && (
        <div
          className={`absolute z-10 mt-2 w-full rounded bg-white shadow-md dark:bg-slate-600 dark:text-slate-300`}
        >
          <ul>
            {employees.map((employee) => (
              <li
                className="cursor-pointer px-4 py-3 hover:bg-gray-100 dark:hover:bg-slate-500"
                key={employee.id}
                onClick={() =>
                  handleSelect(
                    employee.id,
                    employee.name,
                    employee.shiftPreferences
                  )
                }
              >
                {employee.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </main>
  );
}
