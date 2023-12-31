import { ClipboardList, Clock, UserCog } from "lucide-react";
import Link from "next/link";
import router from "next/router";
import { useEffect, useState } from "react";
import { api } from "~/utils/api";
import { formatDateLong, formatDay } from "~/utils/dateFormatting";

import { buttonVariants } from "@/components/ui/button";
import Spinner from "@/components/ui/spinner";
import { Table, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import AddShift from "@/components/WorkDay/AddShift";

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
      <aside className="sticky top-0 h-screen w-56 border-r p-4">
        <nav className="space-y-2">
          <Link
            href={`/days/${workDay.id}/shifts`}
            className="flex w-full items-center space-x-2 rounded-lg px-2 py-2 hover:bg-accent"
          >
            <Clock />
            <span className="text-sm font-medium">
              Shifts {workDay.shifts.length > 0 && `(${workDay.shifts.length})`}
            </span>
          </Link>
          <Link
            href={`/days/${workDay.id}/notes`}
            className="flex w-full items-center space-x-2 rounded-lg px-2 py-2 hover:bg-accent"
          >
            <ClipboardList />
            <span className="text-sm font-medium">
              Notes{workDay.notes.length > 0 && ` (${workDay.notes.length})`}
            </span>
          </Link>
          <button className="flex w-full items-center space-x-2 rounded-lg bg-accent px-2 py-2">
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
          {workDay.roles.length > 0 ? (
            <h2 className="text-lg font-medium">Roles</h2>
          ) : (
            <h2 className="text-lg font-medium">No Roles</h2>
          )}
          <Link href={`/settings/roles`} className={buttonVariants()}>
            <UserCog className="mr-2" size={16} />
            New Role
          </Link>
        </div>

        <Table>
          <TableHeader>
            <TableRow>{checkRoles()}</TableRow>
          </TableHeader>
        </Table>
      </main>
      {showAddShift && (
        <AddShift data={workDay} setShowAddShift={setShowAddShift} />
      )}
    </div>
  );
}
