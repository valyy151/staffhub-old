import {
    BarChart3,
    CalendarSearch,
    ClipboardList,
    HeartPulse,
    Palmtree,
    Sticker,
    User2,
    UserCog
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Employee, EmployeeProfile } from "~/utils/api";

import SelectEmployee from "../Schedule/SelectEmployee";

type SidebarProps = {
  employee?: EmployeeProfile;
  employees?: Employee[];
};

export default function Sidebar({ employee, employees }: SidebarProps) {
  const router = useRouter();
  const path = router.asPath.split("/")[3];

  return (
    <aside className="sticky top-0 mr-4 h-screen w-60 border-r p-4">
      <nav className="space-y-2">
        <Link
          href={`/staff/${employee?.id}`}
          className={`flex w-full items-center space-x-2 rounded-lg px-2 py-2 hover:bg-accent ${
            path === undefined && "bg-secondary"
          }`}
        >
          <BarChart3 />
          <span className="text-sm font-medium">Overview</span>
        </Link>
        <Link
          href={`/staff/${employee?.id}/personal`}
          className={`flex w-full items-center space-x-2 rounded-lg px-2 py-2 hover:bg-accent ${
            path === "personal" && "bg-secondary"
          }`}
        >
          <User2 />
          <span className="text-sm font-medium">Personal Info</span>
        </Link>
        <Link
          href={`${employee?.id && `/staff/${employee?.id}/notes`}`}
          className={`flex w-full items-center space-x-2 rounded-lg px-2 py-2 hover:bg-accent ${
            path === "notes" && "bg-secondary"
          }`}
        >
          <ClipboardList />
          <span className="text-sm font-medium">Notes</span>
        </Link>
        <Link
          href={`${employee?.id && `/staff/${employee?.id}/roles`}`}
          className={`flex w-full items-center space-x-2 rounded-lg px-2 py-2 hover:bg-accent ${
            path === "roles" && "bg-secondary"
          }`}
        >
          <UserCog />
          <span className="text-sm font-medium">Roles</span>
        </Link>
        <Link
          href={`${employee?.id && `/staff/${employee?.id}/sick-leave`}`}
          className={`flex w-full items-center space-x-2 rounded-lg px-2 py-2 hover:bg-accent ${
            path === "sick-leave" && "bg-secondary"
          }`}
        >
          <HeartPulse />
          <span className="text-sm font-medium">Sick Leave</span>
        </Link>
        <Link
          href={`${employee?.id && `/staff/${employee?.id}/vacation`}`}
          className={`flex w-full items-center space-x-2 rounded-lg px-2 py-2 hover:bg-accent ${
            path === "vacation" && "bg-secondary"
          }`}
        >
          <Palmtree />
          <span className="text-sm font-medium">Vacation</span>
        </Link>
        <Link
          href={`${employee?.id && `/staff/${employee?.id}/preferences`}`}
          className={`flex w-full items-center space-x-2 rounded-lg px-2 py-2 hover:bg-accent ${
            path === "preferences" && "bg-secondary"
          }`}
        >
          <Sticker />
          <span className="text-sm font-medium">Schedule Preferences</span>
        </Link>
        <Link
          href={`${employee?.id && `/staff/${employee?.id}/schedule`}`}
          className={`flex w-full items-center space-x-2 rounded-lg px-2 py-2 hover:bg-accent ${
            path === "schedule" && "bg-secondary"
          }`}
        >
          <CalendarSearch />
          <span className="text-sm font-medium">Monthly Schedules</span>
        </Link>
        <div className="border-t pt-4">
          <SelectEmployee links name={employee?.name} employees={employees} />
        </div>
      </nav>
    </aside>
  );
}
