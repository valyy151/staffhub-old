import { TableCell } from "@/components/ui/table";
import { useState } from "react";
import { formatTime, formatTotal } from "~/utils/dateFormatting";
import EditShift from "./EditShift";
import { EmployeeProfile } from "~/utils/api";

type Props = {
  employee: EmployeeProfile;
  day: {
    vacation: boolean;
    sickLeave: boolean;
    shift?: {
      id: string;
      start: number;
      end: number;
      employeeId: string;
      userId: string;
      date: number;
      roleId: string | null;
      absenceId: string | null;
    };
    shiftModels: {
      id: string;
      end: number;
      start: number;
    }[];
    id: string;
    date: number;
  };
};

export default function Shift({ day, employee }: Props) {
  const isVacation = !day.shift?.start && day.vacation;
  const isSick = !day.shift?.start && day.sickLeave;

  const hasShift = day.shift?.start;

  const [edit, setEdit] = useState<boolean>(false);

  const renderShift = () => {
    if (isSick) {
      return (
        <span className="py-3 pl-2 italic group-hover:text-gray-800 dark:group-hover:text-gray-300">
          Sick
        </span>
      );
    }

    if (isVacation) {
      return (
        <span className="py-3 pl-2 italic group-hover:text-gray-800 dark:group-hover:text-gray-300">
          Vacation
        </span>
      );
    }

    if (hasShift) {
      return (
        <span className="py-3 pl-2">
          {formatTime(day.shift?.start!)} - {formatTime(day.shift?.end!)}{" "}
          <span className="font-medium">
            [{formatTotal(day.shift?.start!, day.shift?.end!)}]
          </span>
        </span>
      );
    }
  };

  return (
    <>
      <TableCell
        title="Click to edit shift"
        onClick={() => setEdit(!edit)}
        className={`cursor-pointer text-right hover:bg-muted/50 ${
          (new Date(day.date * 1000).toLocaleDateString("en-GB", {
            weekday: "short",
          }) === "Sat" &&
            "font-bold text-rose-500") ||
          (new Date(day.date * 1000).toLocaleDateString("en-GB", {
            weekday: "short",
          }) === "Sun" &&
            "font-bold text-rose-500")
        }`}
      >
        {renderShift()}
      </TableCell>
      {edit && (
        <EditShift
          date={day.date}
          shift={day.shift}
          setEdit={setEdit}
          employee={employee}
          shiftModels={day.shiftModels}
        />
      )}
    </>
  );
}
