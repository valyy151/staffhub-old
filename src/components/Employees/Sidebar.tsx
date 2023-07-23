import {
  User2,
  Sticker,
  Palmtree,
  ArrowLeft,
  ScrollText,
  CalendarSearch,
} from "lucide-react";
import { useRouter } from "next/router";
import { Employee } from "@prisma/client";

interface SidebarProps {
  employee: Employee;
}

export default function Sidebar({ employee }: SidebarProps) {
  const router = useRouter();
  const path = router.asPath.split("/")[3];

  return (
    <div className="fixed left-0">
      <ul className="h-screen border-r border-slate-400 text-2xl dark:border-slate-500">
        <li
          onClick={() => router.push(`/employees/${employee?.id}`)}
          className="flex w-96 cursor-pointer items-center p-4 hover:bg-slate-200 dark:hover:bg-slate-700"
        >
          <ArrowLeft className="mr-2" /> Back
        </li>
        <li
          onClick={() => router.push(`/employees/${employee?.id}/personal`)}
          className={`flex w-96 cursor-pointer items-center p-4 hover:bg-slate-200 dark:hover:bg-slate-700 ${
            path === "personal"
              ? "bg-slate-200 text-sky-500 dark:bg-slate-700 dark:text-sky-400"
              : ""
          }`}
        >
          <User2 className="mr-2" /> Personal Info
        </li>
        <li
          onClick={() => router.push(`/employees/${employee?.id}/notes`)}
          className={`flex w-96 cursor-pointer items-center p-4 hover:bg-slate-200 dark:hover:bg-slate-700 ${
            path === "notes"
              ? "bg-slate-200 text-sky-500 dark:bg-slate-700 dark:text-sky-400"
              : ""
          }`}
        >
          <ScrollText className="mr-2" /> Notes
        </li>
        <li
          onClick={() => router.push(`/employees/${employee?.id}/vacation`)}
          className={`flex w-96 cursor-pointer items-center p-4 hover:bg-slate-200 dark:hover:bg-slate-700 ${
            path === "vacation"
              ? "bg-slate-200 text-sky-500 dark:bg-slate-700 dark:text-sky-400"
              : ""
          }`}
        >
          <Palmtree className="mr-2" /> Vacation
        </li>
        <li
          onClick={() => router.push(`/employees/${employee?.id}/preferences`)}
          className={`flex w-96 cursor-pointer items-center p-4 hover:bg-slate-200 dark:hover:bg-slate-700 ${
            path === "preferences"
              ? "bg-slate-200 text-sky-500 dark:bg-slate-700 dark:text-sky-400"
              : ""
          }`}
        >
          <Sticker className="mr-2" /> Shift Preferences
        </li>
        <li
          onClick={() => router.push(`/employees/${employee?.id}/schedule`)}
          className={`flex w-96 cursor-pointer items-center p-4 hover:bg-slate-200 dark:hover:bg-slate-700 ${
            path === "schedule"
              ? "bg-slate-200 text-sky-500 dark:bg-slate-700 dark:text-sky-400"
              : ""
          }`}
        >
          <CalendarSearch className="mr-2" /> Work Schedules
        </li>
      </ul>
    </div>
  );
}
