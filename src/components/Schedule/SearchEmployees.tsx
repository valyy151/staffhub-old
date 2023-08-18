import Input from "../ui/Input";
import { type Employee } from "~/utils/api";
import { useState } from "react";

interface SearchEmployeesProps {
  name: string;
  isOpen: boolean;
  employees: Employee[];
  setName: (name: string) => void;
  setEmployeeId: (id: string) => void;
  setIsOpen: (isOpen: boolean) => void;
}

export default function SearchEmployees({
  name,
  isOpen,
  setName,
  setIsOpen,
  employees,
  setEmployeeId,
}: SearchEmployeesProps) {
  const [searchValue, setSearchValue] = useState<string>("");
  function handleSelect(id: string, name: string) {
    setName(name);
    setIsOpen(false);
    setEmployeeId(id);
  }

  return (
    <main className="relative mb-2 w-full">
      <div
        className="group cursor-pointer rounded bg-white shadow hover:shadow-md dark:bg-slate-700 dark:shadow-slate-950 "
        onClick={() => setIsOpen(!isOpen)}
      >
        <Input
          type="text"
          value={name}
          placeholder={"Choose an Employee..."}
          className="group m-0 h-14 cursor-pointer text-xl caret-transparent ring-offset-0 focus:ring-0 focus:ring-offset-0 dark:placeholder:text-slate-400"
        />
      </div>
      {isOpen && (
        <div className="animate-slideDown rounded-md">
          <div className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-md dark:bg-slate-700 dark:text-slate-300">
            <ul
              className={`${
                employees.length > 8 && "h-[28.5rem] overflow-y-scroll"
              } p-1`}
            >
              {employees?.map((employee: Employee) => (
                <li
                  className="flex h-14 cursor-pointer items-center rounded-md px-4 py-2 text-xl hover:bg-gray-100 dark:hover:bg-slate-600"
                  key={employee.id}
                  onClick={() => handleSelect(employee.id, employee.name)}
                >
                  {employee.name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </main>
  );
}
