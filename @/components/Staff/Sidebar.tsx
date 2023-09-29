import {
  CalendarSearch,
  ClipboardList,
  Clock,
  HeartPulse,
  Palmtree,
  Sticker,
  UserCog,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { EmployeeProfile } from "~/utils/api";

type SidebarProps = {
  employee?: EmployeeProfile;
};

export default function Sidebar({ employee }: SidebarProps) {
  const router = useRouter();
  const path = router.asPath.split("/")[3];

  return (
    <aside className="sticky top-0 mr-4 h-screen w-60 border-r p-4">
      <nav className="space-y-2">
        <Link
          href={`/staff/${employee?.id!}/personal`}
          className={`flex w-full items-center space-x-2 rounded-lg px-2 py-2 hover:bg-accent ${
            path === "personal" && "bg-secondary"
          }`}
        >
          <Clock />
          <span className="text-sm font-medium">Personal Info</span>
        </Link>
        <Link
          href={`/staff/${employee?.id!}/notes`}
          className={`flex w-full items-center space-x-2 rounded-lg px-2 py-2 hover:bg-accent ${
            path === "notes" && "bg-secondary"
          }`}
        >
          <ClipboardList />
          <span className="text-sm font-medium">Notes</span>
        </Link>
        <Link
          href={`/staff/${employee?.id!}/roles`}
          className={`flex w-full items-center space-x-2 rounded-lg px-2 py-2 hover:bg-accent ${
            path === "roles" && "bg-secondary"
          }`}
        >
          <UserCog />
          <span className="text-sm font-medium">Roles</span>
        </Link>
        <Link
          href={`/staff/${employee?.id!}/sick-leave`}
          className={`flex w-full items-center space-x-2 rounded-lg px-2 py-2 hover:bg-accent ${
            path === "sick-leave" && "bg-secondary"
          }`}
        >
          <HeartPulse />
          <span className="text-sm font-medium">Sick Leave</span>
        </Link>
        <Link
          href={`/staff/${employee?.id!}/vacation`}
          className={`flex w-full items-center space-x-2 rounded-lg px-2 py-2 hover:bg-accent ${
            path === "vacation" && "bg-secondary"
          }`}
        >
          <Palmtree />
          <span className="text-sm font-medium">Vacation</span>
        </Link>
        <Link
          href={`/staff/${employee?.id!}/preferences`}
          className={`flex w-full items-center space-x-2 rounded-lg px-2 py-2 hover:bg-accent ${
            path === "preferences" && "bg-secondary"
          }`}
        >
          <Sticker />
          <span className="text-sm font-medium">Schedule Preferences</span>
        </Link>
        <Link
          href={`/staff/${employee?.id!}/schedule`}
          className={`flex w-full items-center space-x-2 rounded-lg px-2 py-2 hover:bg-accent ${
            path === "schedule" && "bg-secondary"
          }`}
        >
          <CalendarSearch />
          <span className="text-sm font-medium">Monthly Schedules</span>
        </Link>
      </nav>
    </aside>
  );
}
