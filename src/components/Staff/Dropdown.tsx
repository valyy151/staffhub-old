import {
  User2,
  Trash2,
  Sticker,
  Calendar,
  Palmtree,
  ScrollText,
  UserCog,
} from "lucide-react";

import router from "next/router";
import { type EmployeeProfile } from "~/utils/api";

interface DropdownProps {
  showDelete?: boolean;
  employee: EmployeeProfile;
  setShowModal: (showModal: boolean) => void;
  setShowDropdown: (showDropdown: boolean) => void;
}

export default function Dropdown({
  employee,
  showDelete,
  setShowModal,
  setShowDropdown,
}: DropdownProps) {
  return (
    <div className="absolute right-0 z-50 w-[30rem] rounded-md border border-slate-300 bg-white p-1 text-xl  shadow-lg ring-1 ring-black ring-opacity-5 dark:border-slate-600 dark:bg-slate-700 dark:shadow-slate-900">
      <ul>
        <li
          onClick={() => router.push(`/staff/${employee.id}/personal`)}
          className="flex cursor-pointer items-center justify-between rounded-md px-4 py-3 hover:bg-slate-100  dark:hover:bg-slate-600"
        >
          Personal Information
          <User2 className="ml-2" />
        </li>

        <li
          onClick={() => {
            setShowDropdown(false);
            router.push(`/staff/${employee.id}/notes`);
          }}
          className="flex cursor-pointer items-center justify-between rounded-md px-4 py-3 hover:bg-slate-100 dark:hover:bg-slate-600"
        >
          Notes
          <ScrollText className="ml-2" />
        </li>

        <li
          onClick={() => {
            setShowDropdown(false);
            router.push(`/staff/${employee.id}/roles`);
          }}
          className="flex cursor-pointer items-center justify-between rounded-md px-4 py-3 hover:bg-slate-100 dark:hover:bg-slate-600"
        >
          Roles
          <UserCog className="ml-2" />
        </li>

        <li
          onClick={() => {
            setShowDropdown(false);
            router.push(`/staff/${employee.id}/vacation`);
          }}
          className="flex cursor-pointer items-center justify-between rounded-md px-4 py-3 hover:bg-slate-100 dark:hover:bg-slate-600"
        >
          Vacation
          <Palmtree className="ml-2" />
        </li>

        <li
          onClick={() => {
            setShowDropdown(false);
            router.push(`/staff/${employee.id}/schedule`);
          }}
          className="flex cursor-pointer items-center justify-between rounded-md px-4 py-3 hover:bg-slate-100 dark:hover:bg-slate-600"
        >
          Schedule
          <Calendar className="ml-2" />
        </li>

        <li
          onClick={() => {
            setShowDropdown(false);
            router.push(`/staff/${employee.id}/preferences`);
          }}
          className="flex cursor-pointer items-center justify-between rounded-md px-4 py-3 hover:bg-slate-100 dark:hover:bg-slate-600"
        >
          Schedule Preferences
          <Sticker className="ml-2" />
        </li>

        {showDelete && (
          <li
            onClick={() => {
              setShowModal(true);
              setShowDropdown(false);
            }}
            className="flex cursor-pointer items-center justify-between rounded-md px-4 py-3 hover:bg-slate-100 dark:hover:bg-slate-600"
          >
            Delete Employee
            <Trash2 className="ml-2 text-red-500" />
          </li>
        )}
      </ul>
    </div>
  );
}
