import { Employee } from '~/utils/api';

import { Input } from '@/components/ui/input';

type SearchEmployeesProps = {
  isOpen: boolean;
  employee: Employee;
  employees: Employee[] | undefined;
  setIsOpen: (isOpen: boolean) => void;
  setIsSick: (isSick: boolean) => void;
  setEndDate: (endDate: number) => void;
  setEmployee: (employee: Employee) => void;
  setOpenRoles: (openRoles: boolean) => void;
  setIsOnVacation: (isOnVacation: boolean) => void;
  setRemainingDays: (remainingDays: number) => void;
};

export default function SearchEmployees({
  isOpen,
  setIsOpen,
  employee,
  setEmployee,
  employees,
  setIsSick,
  setEndDate,
  setOpenRoles,
  setIsOnVacation,
  setRemainingDays,
}: SearchEmployeesProps) {
  const handleSelect = (employee: Employee) => {
    setIsOpen(false);
    setEmployee(employee);
    checkIfSickOrVacation(employee);
  };

  function checkIfSickOrVacation(employee: any) {
    setIsSick(false);
    setIsOnVacation(false);
    const currentDate = Date.now();

    for (const sickLeave of employee.sickLeaves) {
      const startDate: Date = new Date(Number(sickLeave.start));
      const endDate: Date = new Date(Number(sickLeave.end));

      if (
        Number(currentDate) >= Number(startDate) &&
        Number(currentDate) <= Number(endDate)
      ) {
        const remainingDays = Math.ceil(
          (Number(endDate) - currentDate) / (1000 * 60 * 60 * 24)
        );

        setIsSick(true);
        setEndDate(Number(endDate));
        setRemainingDays(remainingDays);
        return;
      }
    }

    for (const vacation of employee.vacations) {
      const startDate: Date = new Date(Number(vacation.start));
      const endDate: Date = new Date(Number(vacation.end));

      if (
        Number(currentDate) >= Number(startDate) &&
        Number(currentDate) <= Number(endDate)
      ) {
        const remainingDays = Math.ceil(
          (Number(endDate) - currentDate) / (1000 * 60 * 60 * 24)
        );

        setIsOnVacation(true);
        setEndDate(Number(endDate));
        setRemainingDays(remainingDays);
        return;
      }
    }
  }

  return (
    <main className="relative w-full">
      <div
        className="group cursor-pointer rounded bg-white shadow hover:shadow-md dark:bg-gray-800 dark:shadow-gray-950 "
        onClick={() => {
          setIsOpen(!isOpen);
          setOpenRoles(false);
        }}
      >
        <Input
          readOnly
          type="text"
          value={employee.name}
          placeholder={"Choose an Employee..."}
          className="text-md group m-0 cursor-pointer caret-transparent focus:border-background dark:placeholder:text-gray-400  dark:focus:border-background"
        />
      </div>
      {isOpen && (
        <div
          className={`animate-slideDown absolute z-10 mt-1 w-full rounded-md bg-white shadow-md dark:bg-gray-800 dark:text-gray-300`}
        >
          <ul
            className={`${
              employees &&
              employees.length > 8 &&
              "h-[28.5rem] overflow-y-scroll"
            } p-1`}
          >
            {employees
              ?.sort((a, b) => a.name.localeCompare(b.name))
              .map((employee) => (
                <li
                  className="flex cursor-pointer items-center rounded-md px-2 py-2 text-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  key={employee.id}
                  onClick={() => handleSelect(employee)}
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
