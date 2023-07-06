import { Dispatch, FC, SetStateAction } from "react";
import Input from "../ui/Input";
import { Employee, ShiftPreference } from "@prisma/client";

interface SearchEmployeesProps {
  name: string;
  isOpen: boolean;
  inputSize: string;
  noMargin?: boolean;
  employees: Employee[];
  setId: Dispatch<SetStateAction<string>>;
  setName: Dispatch<SetStateAction<string>>;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  setShiftPreferences?: Dispatch<SetStateAction<string[]>>;
}

export default function SearchEmployees({
  name,
  setId,
  isOpen,
  setName,
  setIsOpen,
  employees,
  setShiftPreferences,
}: SearchEmployeesProps) {
  const handleSelect = (option: string, id: string) => {
    setId(id);
    setName(option);
    setIsOpen(false);
  };

  return (
    <main className={`relative mt-12 p-0 pt-0.5 text-lg`}>
      <div
        className="group w-full cursor-pointer rounded bg-white shadow hover:shadow-md dark:bg-slate-700 dark:shadow-slate-950 "
        onClick={() => setIsOpen(!isOpen)}
      >
        <Input
          readOnly
          type="text"
          value={name}
          placeholder={"Choose an Employee..."}
          className="group m-0 cursor-pointer px-4 caret-transparent focus:ring-0 dark:placeholder:text-slate-400"
        />
      </div>
      {isOpen && (
        <div
          className={`absolute left-0 top-10 z-10 w-full rounded bg-white shadow-md dark:bg-slate-600 dark:text-slate-300`}
        >
          <ul>
            {employees.map((employee) => (
              <li
                className="cursor-pointer px-4 py-3 hover:bg-gray-100 dark:hover:bg-slate-500"
                key={employee.id}
                onClick={() => handleSelect(employee.name, employee.id)}
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
