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
    <div className="absolute right-0 z-50 w-[30rem] rounded-md border border-slate-300 bg-white text-xl  shadow-lg ring-1 ring-black ring-opacity-5 dark:border-slate-500 dark:bg-slate-600 dark:shadow-slate-900">
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
