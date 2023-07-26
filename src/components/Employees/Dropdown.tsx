import {
  User2,
  Trash2,
  Sticker,
  Calendar,
  Palmtree,
  ScrollText,
} from "lucide-react";

interface DropdownProps {
  showDelete?: boolean;
  navigate: (path: string) => void;
  setShowModal: (showModal: boolean) => void;
  setShowDropdown: (showDropdown: boolean) => void;
}

export default function Dropdown({
  navigate,
  setShowModal,
  setShowDropdown,
  showDelete,
}: DropdownProps) {
  return (
    <div className="absolute right-0 z-50 w-[30rem] rounded-md border border-slate-300 bg-white text-xl  shadow-lg ring-1 ring-black ring-opacity-5 dark:border-slate-500 dark:bg-slate-600 dark:shadow-slate-900">
      <ul>
        <li
          onClick={() => {
            setShowDropdown(false);
            navigate("notes");
          }}
          className="flex cursor-pointer items-center justify-between rounded-md px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-500"
        >
          Notes
          <ScrollText className="ml-2" />
        </li>

        <li
          onClick={() => {
            setShowDropdown(false);
            navigate("vacation");
          }}
          className="flex cursor-pointer items-center justify-between rounded-md px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-500"
        >
          Vacation
          <Palmtree className="ml-2" />
        </li>

        <li
          onClick={() => {
            setShowDropdown(false);
            navigate("schedule");
          }}
          className="flex cursor-pointer items-center justify-between rounded-md px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-500"
        >
          Schedule
          <Calendar className="ml-2" />
        </li>

        <li
          onClick={() => {
            setShowDropdown(false);
            navigate("preferences");
          }}
          className="flex cursor-pointer items-center justify-between rounded-md px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-500"
        >
          Shift Preferences
          <Sticker className="ml-2" />
        </li>
        <li
          onClick={() => navigate("personal")}
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
}
