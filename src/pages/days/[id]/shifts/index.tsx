import { ClipboardList, Clock, UserCog } from "lucide-react";
import Link from "next/link";
import router from "next/router";
import { useEffect, useState } from "react";
import { api } from "~/utils/api";
import { formatDateLong, formatDay } from "~/utils/dateFormatting";

import { Button } from "@/components/ui/button";
import Spinner from "@/components/ui/spinner";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
} from "@/components/ui/table";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import AddShift from "@/components/WorkDay/AddShift";
import Shift from "@/components/WorkDay/Shift";

type WorkDayPageProps = {
  query: { id: string };
};

WorkDayPage.getInitialProps = ({ query }: WorkDayPageProps) => {
  return { query };
};

export default function WorkDayPage({ query }: WorkDayPageProps) {
  const [showAddShift, setShowAddShift] = useState(false);
  const { toast } = useToast();

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

  // function checkRoles() {
  //   const roles: JSX.Element[] = [];

  //   workDay?.roles.forEach((role) => {
  //     const minRequired = role.numberPerDay;

  //     const shifts = workDay?.shifts.filter(
  //       (shift) => shift.roleId === role.id
  //     );

  //     const employees = shifts?.map((shift) => shift.employeeId);
  //     const uniqueEmployees = [...new Set(employees)];

  //     return roles.push(
  //       <div className="flex flex-col ">
  //         <Heading
  //           size={"xxs"}
  //           className={`font-medium ${
  //             uniqueEmployees.length < minRequired!!
  //               ? "text-red-500"
  //               : "text-green-500"
  //           }`}
  //         >
  //           {uniqueEmployees.length} / {minRequired} {role.name}s
  //         </Heading>
  //       </div>
  //     );
  //   });

  //   if (roles.length === 0) {
  //     return;
  //   }

  //   return roles;
  // }

  const handleNewShift = () => {
    if (!data?.hasEmployees) {
      return toast({
        title: "You need to add employees before you can add shifts.",
        action: (
          <ToastAction altText="Add employees">
            <Link href={`/staff/new`}>Add employees</Link>
          </ToastAction>
        ),
      });
    }
    setShowAddShift(true);
  };

  return (
    <div className="flex">
      <aside className="sticky top-0 h-screen w-56 border-r p-4">
        <nav className="space-y-2">
          <button className="flex w-full items-center space-x-2 rounded-lg bg-accent px-2 py-2">
            <Clock />
            <span className="text-sm font-medium">
              Shifts {workDay.shifts.length > 0 && `(${workDay.shifts.length})`}
            </span>
          </button>
          <Link
            href={`/days/${workDay.id}/notes`}
            className="flex w-full items-center space-x-2 rounded-lg px-2 py-2 hover:bg-accent"
          >
            <ClipboardList />
            <span className="text-sm font-medium">
              Notes {workDay.notes.length > 0 && `(${workDay.notes.length})`}
            </span>
          </Link>
          <Link
            href={`/days/${workDay.id}/roles`}
            className="flex w-full items-center space-x-2 rounded-lg px-2 py-2 hover:bg-accent"
          >
            <UserCog />
            <span className="text-sm font-medium">Roles</span>
          </Link>
        </nav>
      </aside>
      <main className="flex-grow p-6">
        <h1 className="pb-1 text-xl font-semibold">
          {formatDay(workDay.date)}, {formatDateLong(workDay.date)}
        </h1>
        <div className="mb-4 flex items-center justify-between">
          {workDay.shifts.length > 0 ? (
            <h2 className="text-lg font-medium">Shifts</h2>
          ) : (
            <h2 className="text-lg font-medium">No shifts</h2>
          )}
          <Button onClick={handleNewShift}>
            <Clock className="mr-2" size={16} />
            New Shift
          </Button>
        </div>

        {workDay.shifts.length > 0 && (
          <Table>
            <TableHeader>
              <TableHead>Employee</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Hours</TableHead>
              <TableHead className="text-right">Absence</TableHead>
            </TableHeader>
            <TableBody>
              {workDay.shifts
                .sort((a, b) => a.start - b.start)
                .map((shift) => (
                  <Shift shift={shift} shiftModels={workDay.shiftModels} />
                ))}
            </TableBody>
          </Table>
        )}
      </main>
      {showAddShift && (
        <AddShift data={workDay} setShowAddShift={setShowAddShift} />
      )}
    </div>
  );
}
