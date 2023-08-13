import Input from "../ui/Input";

interface SearchEmployeesProps {
  name: string;
  isOpen: boolean;
  employees: any;
  setId: (id: string) => void;
  setRoles: (roles: any) => void;
  setRole: (role: string) => void;
  setName: (name: string) => void;
  setIsOpen: (isOpen: boolean) => void;
  setIsSick: (isSick: boolean) => void;
  setEndDate: (endDate: number) => void;
  setOpenRoles: (openRoles: boolean) => void;
  setIsOnVacation: (isOnVacation: boolean) => void;
  setRemainingDays: (remainingDays: number) => void;
}

export default function SearchEmployees({
  name,
  setId,
  isOpen,
  setName,
  setRole,
  setIsOpen,
  setRoles,
  employees,
  setIsSick,
  setEndDate,
  setOpenRoles,
  setIsOnVacation,
  setRemainingDays,
}: SearchEmployeesProps) {
  const handleSelect = (
    id: string,
    name: string,
    roles: { name: string; id: string }
  ) => {
    setId(id);
    setRole("");
    setName(name);
    setRoles(roles);
    setIsOpen(false);
  };

  function checkIfSickOrVacation(employee: any) {
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
        className="group cursor-pointer rounded bg-white shadow hover:shadow-md dark:bg-slate-750 dark:shadow-slate-950 "
        onClick={() => {
          setIsOpen(!isOpen);
          setOpenRoles(false);
        }}
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
          className={`absolute z-10 mt-1 w-full rounded-md bg-white shadow-md dark:bg-slate-700 dark:text-slate-300`}
        >
          <ul
            className={`${
              employees?.length > 8 && "h-[28.5rem] overflow-y-scroll"
            } p-1`}
          >
            {employees.map((employee: any) => (
              <li
                className="flex h-14 cursor-pointer items-center rounded-md px-4 py-2 text-xl hover:bg-gray-100 dark:hover:bg-slate-600"
                key={employee.id}
                onClick={() => {
                  checkIfSickOrVacation(employee);
                  handleSelect(employee.id, employee.name, employee.roles);
                }}
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
