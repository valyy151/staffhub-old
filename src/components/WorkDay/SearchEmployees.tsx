import Input from "../ui/Input";
import { type Employee } from "@prisma/client";

interface SearchEmployeesProps {
  name: string;
  isOpen: boolean;
  employees: any;
  setId: (id: string) => void;
  setName: (name: string) => void;
  setIsOpen: (isOpen: boolean) => void;
}

export default function SearchEmployees({
  name,
  setId,
  isOpen,
  setName,
  setIsOpen,
  employees,
}: SearchEmployeesProps) {
  const handleSelect = (option: string, id: string) => {
    setId(id);
    setName(option);
    setIsOpen(false);
  };

  return (
    <main className="relative w-full">
      <div
        className="group cursor-pointer rounded bg-white shadow hover:shadow-md dark:bg-slate-700 dark:shadow-slate-950 "
        onClick={() => setIsOpen(!isOpen)}
      >
        <Input
          readOnly
          type="text"
          value={name}
          placeholder={"Choose an Employee..."}
          className="group m-0 h-14 cursor-pointer text-xl caret-transparent ring-offset-0 focus:ring-0 focus:ring-offset-0 dark:placeholder:text-slate-400"
        />
      </div>
      {isOpen && (
        <div
          className={`absolute z-10 mt-1 w-full rounded-md bg-white shadow-md dark:bg-slate-600 dark:text-slate-300`}
        >
          <ul>
            {employees?.map((employee: Employee) => (
              <li
                className="flex h-14 cursor-pointer items-center rounded-md px-4 py-2 text-xl hover:bg-gray-100 dark:hover:bg-slate-500"
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
