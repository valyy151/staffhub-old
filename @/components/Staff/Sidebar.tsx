import {
  User2,
  Sticker,
  Palmtree,
  ArrowLeft,
  ScrollText,
  CalendarSearch,
  HeartPulse,
  UserCog,
  Clock,
  ClipboardList,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { type EmployeeProfile } from "~/utils/api";

type SidebarProps = {
  employee?: EmployeeProfile;
};

export default function Sidebar({ employee }: SidebarProps) {
  const router = useRouter();
  const path = router.asPath.split("/")[3];

  return (
    <aside className="sticky top-0 mr-4 h-screen w-56 bg-gray-100 p-4 text-gray-800 dark:bg-gray-800">
      <nav className="space-y-2">
        <Link
          href={`/staff/${employee?.id!}/personal`}
          className={`flex w-full items-center space-x-2 rounded-lg px-2 py-2 ${
            path === "personal"
              ? "bg-gray-200 text-gray-800 active:bg-gray-300 dark:bg-gray-700 dark:text-gray-200"
              : "text-gray-500 hover:bg-gray-200 active:bg-gray-300  dark:text-gray-400 dark:hover:bg-gray-700"
          }`}
        >
          <Clock />
          <span className="text-sm font-medium">Personal Info</span>
        </Link>
        <Link
          href={`/staff/${employee?.id!}/notes`}
          className={`flex w-full items-center space-x-2 rounded-lg px-2 py-2 ${
            path === "notes"
              ? "bg-gray-200 text-gray-800 active:bg-gray-300 dark:bg-gray-700 dark:text-gray-200"
              : "text-gray-500 hover:bg-gray-200 active:bg-gray-300  dark:text-gray-400 dark:hover:bg-gray-700"
          }`}
        >
          <ClipboardList />
          <span className="text-sm font-medium">Notes</span>
        </Link>
        <Link
          href={`/staff/${employee?.id!}/roles`}
          className={`flex w-full items-center space-x-2 rounded-lg px-2 py-2 ${
            path === "roles"
              ? "bg-gray-200 text-gray-800 active:bg-gray-300 dark:bg-gray-700 dark:text-gray-200"
              : "text-gray-500 hover:bg-gray-200 active:bg-gray-300  dark:text-gray-400 dark:hover:bg-gray-700"
          }`}
        >
          <UserCog />
          <span className="text-sm font-medium">Roles</span>
        </Link>
        <Link
          href={`/staff/${employee?.id!}/sick-leave`}
          className={`flex w-full items-center space-x-2 rounded-lg px-2 py-2 ${
            path === "sick-leave"
              ? "bg-gray-200 text-gray-800 active:bg-gray-300 dark:bg-gray-700 dark:text-gray-200"
              : "text-gray-500 hover:bg-gray-200 active:bg-gray-300  dark:text-gray-400 dark:hover:bg-gray-700"
          }`}
        >
          <HeartPulse />
          <span className="text-sm font-medium">Sick Leave</span>
        </Link>
        <Link
          href={`/staff/${employee?.id!}/vacation`}
          className={`flex w-full items-center space-x-2 rounded-lg px-2 py-2 ${
            path === "vacation"
              ? "bg-gray-200 text-gray-800 active:bg-gray-300 dark:bg-gray-700 dark:text-gray-200"
              : "text-gray-500 hover:bg-gray-200 active:bg-gray-300  dark:text-gray-400 dark:hover:bg-gray-700"
          }`}
        >
          <Palmtree />
          <span className="text-sm font-medium">Vacation</span>
        </Link>
        <Link
          href={`/staff/${employee?.id!}/preferences`}
          className={`flex w-full items-center space-x-2 rounded-lg px-2 py-2 ${
            path === "preferences"
              ? "bg-gray-200 text-gray-800 active:bg-gray-300 dark:bg-gray-700 dark:text-gray-200"
              : "text-gray-500 hover:bg-gray-200 active:bg-gray-300  dark:text-gray-400 dark:hover:bg-gray-700"
          }`}
        >
          <Sticker />
          <span className="text-sm font-medium">Schedule Preferences</span>
        </Link>
        <Link
          href={`/staff/${employee?.id!}/schedule`}
          className={`flex w-full items-center space-x-2 rounded-lg px-2 py-2 ${
            path === "schedule"
              ? "bg-gray-200 text-gray-800 active:bg-gray-300 dark:bg-gray-700 dark:text-gray-200"
              : "text-gray-500 hover:bg-gray-200 active:bg-gray-300  dark:text-gray-400 dark:hover:bg-gray-700"
          }`}
        >
          <CalendarSearch />
          <span className="text-sm font-medium">Monthly Schedules</span>
        </Link>
      </nav>
    </aside>
  );
}
