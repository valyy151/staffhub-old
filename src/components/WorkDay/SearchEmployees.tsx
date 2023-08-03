import Input from "../ui/Input";
import { useState } from "react";
import { type Employee } from "@prisma/client";

interface SearchEmployeesProps {
  name: string;
  isOpen: boolean;
  employees: any;
  setId: (id: string) => void;
  setName: (name: string) => void;
  setIsOpen: (isOpen: boolean) => void;
  setIsSick: (isSick: boolean) => void;
  setEndDate: (endDate: number) => void;
  setRemainingDays: (remainingDays: number) => void;
}

export default function SearchEmployees({
  name,
  setId,
  isOpen,
  setName,
  setIsOpen,
  employees,
  setIsSick,
  setEndDate,
  setRemainingDays,
}: SearchEmployeesProps) {
  const handleSelect = (name: string, id: string) => {
    setId(id);
    setName(name);
    setIsOpen(false);
  };

  function checkIfSick(sickLeaves: any) {
    const currentDate = Date.now();

    for (const sickLeave of sickLeaves) {
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
    return setIsSick(false);
  }

  return (
    <main className="relative w-full">
      <div
        className="group cursor-pointer rounded bg-white shadow hover:shadow-md dark:bg-slate-750 dark:shadow-slate-950 "
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
          className={`absolute z-10 mt-1 w-full rounded-md bg-white shadow-md dark:bg-slate-700 dark:text-slate-300`}
        >
          <ul
            className={`${
              employees.length > 8 && "h-[28.5rem] overflow-y-scroll"
            } p-1`}
          >
            {employees.map((employee: any) => (
              <li
                className="flex h-14 cursor-pointer items-center rounded-md px-4 py-2 text-xl hover:bg-gray-100 dark:hover:bg-slate-600"
                key={employee.id}
                onClick={() => {
                  checkIfSick(employee.sickLeaves);
                  handleSelect(employee.name, employee.id);
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
