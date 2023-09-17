import router from "next/router";
import { api } from "~/utils/api";
import { useEffect, useState } from "react";
import Note from "~/components/WorkDay/Note";
import Spinner from "~/components/ui/Spinner";
import Heading from "~/components/ui/Heading";
import Shift from "~/components/WorkDay/Shift";
import AddNote from "~/components/WorkDay/AddNote";
import AddShift from "~/components/WorkDay/AddShift";
import {
  formatDateLong,
  formatDay,
  formatTime,
  formatTotal,
} from "~/utils/dateFormatting";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  ClipboardEdit,
  ClipboardList,
  Clock,
  MoreVertical,
  Trash2,
  UserCog,
} from "lucide-react";
import Link from "next/link";

type WorkDayPageProps = {
  query: { id: string };
};

WorkDayPage.getInitialProps = ({ query }: WorkDayPageProps) => {
  return { query };
};

export default function WorkDayPage({ query }: WorkDayPageProps) {
  const [showAddShift, setShowAddShift] = useState(false);

  const { data, failureReason } = api.workDay.findOne.useQuery({
    id: query.id,
  });

  if (failureReason?.data?.httpStatus === 401) {
    router.push("/");
  }

  const [workDay, setWorkDay] = useState(data);

  useEffect(() => {
    setWorkDay(data);
  }, [data]);

  if (!data) {
    return <Spinner />;
  }

  if (!workDay || !workDay.date) {
    return null;
  }

  function checkRoles() {
    const roles: JSX.Element[] = [];

    workDay?.roles
      .sort((a, b) => a.numberPerDay! - b.numberPerDay!)
      .forEach((role) => {
        const minRequired = role.numberPerDay;

        const shifts = workDay?.shifts.filter(
          (shift) => shift.roleId === role.id
        );

        const employees = shifts?.map((shift) => shift.employeeId);
        const uniqueEmployees = [...new Set(employees)];

        return roles.push(
          <TableHead
            className={`font-medium ${
              uniqueEmployees.length < minRequired!!
                ? "text-red-500"
                : "text-green-500"
            }`}
          >
            {uniqueEmployees.length} / {minRequired} {role.name}s
          </TableHead>
        );
      });

    if (roles.length === 0) {
      return;
    }

    return roles;
  }

  return (
    <div className="flex">
      <aside className="sticky top-0 h-screen w-56 bg-gray-100 p-4 text-gray-800 dark:bg-gray-800">
        <nav className="space-y-2">
          <Link
            href={`/days/${workDay.id}/shifts`}
            className="flex w-full items-center space-x-2 rounded-lg px-2 py-2 text-gray-500 hover:bg-gray-200 active:bg-gray-300  dark:text-gray-400 dark:hover:bg-gray-700"
          >
            <Clock />
            <span className="text-sm font-medium">Shifts</span>
          </Link>
          <Link
            href={`/days/${workDay.id}/notes`}
            className="flex w-full items-center space-x-2 rounded-lg px-2 py-2 text-gray-500 hover:bg-gray-200 active:bg-gray-300  dark:text-gray-400 dark:hover:bg-gray-700"
          >
            <ClipboardList />
            <span className="text-sm font-medium">Notes</span>
          </Link>
          <button className="flex w-full items-center space-x-2 rounded-lg bg-gray-200 px-2 py-2 text-gray-800 active:bg-gray-300 dark:bg-gray-700 dark:text-gray-200">
            <UserCog />
            <span className="text-sm font-medium">Roles</span>
          </button>
        </nav>
      </aside>
      <main className="flex-grow p-6">
        <h1 className="pb-1 text-xl font-semibold">
          {formatDay(workDay.date)}, {formatDateLong(workDay.date)}
        </h1>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-medium">Roles</h2>
          <Link href={`/settings/roles`} className={buttonVariants()}>
            <UserCog className="mr-2" size={16} />
            New Role
          </Link>
        </div>

        {/* Table that has the name of the roles as the headers and all the employees are sorted in the column of the role that they have */}
        <Table>
          <TableHeader>
            <TableRow className="dark:border-slate-700">
              {checkRoles()}
            </TableRow>
          </TableHeader>
        </Table>
      </main>
      {showAddShift && (
        <AddShift
          data={workDay}
          showAddShift={showAddShift}
          setShowAddShift={setShowAddShift}
        />
      )}
    </div>
  );
}
