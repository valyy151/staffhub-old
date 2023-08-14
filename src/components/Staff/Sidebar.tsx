import {
  User2,
  Sticker,
  Palmtree,
  ArrowLeft,
  ScrollText,
  CalendarSearch,
  HeartPulse,
  UserCog,
} from "lucide-react";
import { useRouter } from "next/router";
import { type EmployeeProfile } from "~/utils/api";

interface SidebarProps {
  employee?: EmployeeProfile;
}

export default function Sidebar({ employee }: SidebarProps) {
  const router = useRouter();
  const path = router.asPath.split("/")[3];

  return (
    <div className="mr-[26rem]">
      <ul className="fixed h-full w-fit border-r border-slate-500 text-2xl">
        <li
          onClick={() => employee?.id && router.push(`/staff/${employee?.id}`)}
          className="flex w-96 cursor-pointer items-center p-4 hover:bg-slate-150 dark:hover:bg-slate-750"
        >
          <ArrowLeft className="mr-2" /> Back
        </li>
        <li
          onClick={() =>
            employee?.id && router.push(`/staff/${employee?.id}/personal`)
          }
          className={`flex w-96 cursor-pointer items-center p-4 ${
            path === "personal"
              ? "bg-slate-200 text-sky-600 dark:bg-slate-700 dark:text-sky-400"
              : "hover:bg-slate-150 dark:hover:bg-slate-750"
          }`}
        >
          <User2 className="mr-2" /> Personal Info
        </li>
        <li
          onClick={() =>
            employee?.id && router.push(`/staff/${employee?.id}/roles`)
          }
          className={`flex w-96 cursor-pointer items-center p-4 ${
            path === "roles"
              ? "bg-slate-200 text-sky-600 dark:bg-slate-700 dark:text-sky-400"
              : "hover:bg-slate-150 dark:hover:bg-slate-750"
          }`}
        >
          <UserCog className="mr-2" /> Roles
        </li>
        <li
          onClick={() =>
            employee?.id && router.push(`/staff/${employee?.id}/notes`)
          }
          className={`flex w-96 cursor-pointer items-center p-4 ${
            path === "notes"
              ? "bg-slate-200 text-sky-600 dark:bg-slate-700 dark:text-sky-400"
              : "hover:bg-slate-150 dark:hover:bg-slate-750"
          }`}
        >
          <ScrollText className="mr-2" /> Notes
        </li>
        <li
          onClick={() =>
            employee?.id && router.push(`/staff/${employee?.id}/sick-leave`)
          }
          className={`flex w-96 cursor-pointer items-center p-4 ${
            path === "sick-leave"
              ? "bg-slate-200 text-sky-600 dark:bg-slate-700 dark:text-sky-400"
              : "hover:bg-slate-150 dark:hover:bg-slate-750"
          }`}
        >
          <HeartPulse className="mr-2" /> SickLeave
        </li>
        <li
          onClick={() =>
            employee?.id && router.push(`/staff/${employee?.id}/vacation`)
          }
          className={`flex w-96 cursor-pointer items-center p-4 ${
            path === "vacation"
              ? "bg-slate-200 text-sky-600 dark:bg-slate-700 dark:text-sky-400"
              : "hover:bg-slate-150 dark:hover:bg-slate-750"
          }`}
        >
          <Palmtree className="mr-2" /> Vacation
        </li>
        <li
          onClick={() =>
            employee?.id && router.push(`/staff/${employee?.id}/preferences`)
          }
          className={`flex w-96 cursor-pointer items-center p-4 ${
            path === "preferences"
              ? "bg-slate-200 text-sky-600 dark:bg-slate-700 dark:text-sky-400"
              : "hover:bg-slate-150 dark:hover:bg-slate-750"
          }`}
        >
          <Sticker className="mr-2" /> Shift Preferences
        </li>
        <li
          onClick={() =>
            employee?.id && router.push(`/staff/${employee?.id}/schedule`)
          }
          className={`flex w-96 cursor-pointer items-center p-4 ${
            path === "schedule"
              ? "bg-slate-200 text-sky-600 dark:bg-slate-700 dark:text-sky-400"
              : "hover:bg-slate-150 dark:hover:bg-slate-750"
          }`}
        >
          <CalendarSearch className="mr-2" /> Work Schedules
        </li>
      </ul>
    </div>
  );
}
