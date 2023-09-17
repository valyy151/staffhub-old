import { Input } from "@/components/ui/input";
import { type Employee } from "~/utils/api";

type SearchEmployeesProps = {
  isOpen: boolean;
  employee: Employee;
  employees: Employee[];
  setIsOpen: (isOpen: boolean) => void;
  setEmployee: (employee: Employee) => void;
};

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
    <main className="text-md relative mb-2 w-fit">
      <div
        className="group cursor-pointer rounded bg-white shadow hover:shadow-md dark:bg-slate-800 dark:shadow-slate-950 "
        onClick={() => setIsOpen(!isOpen)}
      >
        <Input
          readOnly
          type="text"
          value={employee.name}
          placeholder={"Choose an Employee..."}
          className="text-md group m-0 cursor-pointer caret-transparent ring-offset-0 focus:ring-0 focus:ring-offset-0 dark:placeholder:text-slate-400"
        />
      </div>
      {isOpen && (
        <div className="animate-slideDown rounded-md">
          <div className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-md dark:bg-slate-800 dark:text-slate-300 dark:shadow-slate-800">
            <ul
              className={`${
                employees.length > 8 && "h-[28.5rem] overflow-y-scroll"
              } p-1`}
            >
              {employees
                ?.sort((a, b) => a.name.localeCompare(b.name))
                .map((employee: Employee) => (
                  <li
                    className="flex cursor-pointer items-center rounded-md px-2 py-2 hover:bg-gray-100 dark:hover:bg-slate-700"
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
