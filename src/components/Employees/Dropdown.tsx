import { Dispatch, FC, SetStateAction } from "react";
import {
  Calendar,
  Palmtree,
  Scroll,
  ScrollText,
  Sticker,
  Trash2,
  User2,
} from "lucide-react";
import { Employee } from "@prisma/client";
import router from "next/router";

interface DropdownProps {
  employee: Employee;
  showDelete?: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
  setShowDropdown: Dispatch<SetStateAction<boolean>>;
}

const Dropdown: FC<DropdownProps> = ({
  employee,
  setShowModal,
  setShowDropdown,
  showDelete,
}) => {
  return (
    <div className="absolute right-2 top-10 z-50 mt-2 w-72 rounded-md bg-white  text-lg shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-slate-600">
      <ul>
        <li
          onClick={() => {
            setShowDropdown(false);
            router.push(`/employees/${employee.id}/notes`);
          }}
          className="flex cursor-pointer items-center justify-between rounded-md px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-500"
        >
          Notes
          <ScrollText className="ml-2" />
        </li>

        <li
          onClick={() => {
            setShowDropdown(false);
            router.push(`/employees/${employee.id}/vacation`);
          }}
          className="flex cursor-pointer items-center justify-between rounded-md px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-500"
        >
          Vacation
          <Palmtree className="ml-2" />
        </li>

        <li
          onClick={() => {
            setShowDropdown(false);
            router.push(`/employees/${employee.id}/schedule`);
          }}
          className="flex cursor-pointer items-center justify-between rounded-md px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-500"
        >
          Schedule
          <Calendar className="ml-2" />
        </li>

        <li
          onClick={() => {
            setShowDropdown(false);
            router.push(`/employees/${employee.id}/preferences`);
          }}
          className="flex cursor-pointer items-center justify-between rounded-md px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-500"
        >
          Shift Preferences
          <Sticker className="ml-2" />
        </li>
        <li
          onClick={() => router.push(`/employees/${employee.id}/about`)}
          className="flex cursor-pointer items-center justify-between rounded-md px-4 py-3 hover:bg-slate-50  dark:hover:bg-slate-500"
        >
          Personal Information
          <User2 className="ml-2" />
        </li>

        {showDelete && (
          <li
            onClick={() => {
              setShowModal(true);
              setShowDropdown(false);
            }}
            className="flex cursor-pointer items-center justify-between rounded-md px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-500"
          >
            Delete Employee
            <Trash2 className="ml-2 text-red-500" />
          </li>
        )}
      </ul>
    </div>
  );
};

export default Dropdown;
