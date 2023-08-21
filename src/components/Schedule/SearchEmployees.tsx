import Input from "../ui/Input";
import { type Employee } from "~/utils/api";

interface SearchEmployeesProps {
  isOpen: boolean;
  employee: Employee;
  employees: Employee[];
  setIsOpen: (isOpen: boolean) => void;
  setEmployee: (employee: Employee) => void;
}

export default function SearchEmployees({
  isOpen,
  setIsOpen,
  employee,
  employees,
  setEmployee,
}: SearchEmployeesProps) {
  function handleSelect(employee: Employee) {
    setIsOpen(false);
    setEmployee(employee);
  }

  return (
    <main className="relative mb-2 w-full">
      <div
        className="group cursor-pointer rounded bg-white shadow hover:shadow-md dark:bg-slate-700 dark:shadow-slate-950 "
        onClick={() => setIsOpen(!isOpen)}
      >
        <Input
          readOnly
          type="text"
          value={employee.name}
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
              {employees
                ?.sort((a, b) => a.name.localeCompare(b.name))
                .map((employee: Employee) => (
                  <li
                    className="flex h-14 cursor-pointer items-center rounded-md px-4 py-2 text-xl hover:bg-gray-100 dark:hover:bg-slate-600"
                    key={employee.id}
                    onClick={() => handleSelect(employee)}
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
