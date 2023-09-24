import {
  Calendar,
  HeartPulse,
  Mail,
  MapPin,
  MoreVertical,
  Palmtree,
  Phone,
  Scroll,
  Sticker,
  Trash2,
  User,
  UserCog,
} from "lucide-react";
import router from "next/router";
import { useState } from "react";
import { api } from "~/utils/api";
import { useToast } from "@/components/ui/use-toast";

import Heading from "@/components/ui/heading";
import Spinner from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import FormModal from "@/components/ui/form-modal";
import Paragraph from "@/components/ui/paragraph";
import { formatTime } from "~/utils/dateFormatting";
import { checkEmployeeVacation, checkSickLeave } from "~/utils/checkAbsence";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import SelectEmployees from "../../../../@/components/Schedule/SelectEmployee";

type EmployeeProfileProps = {
  query: { id: string };
};

EmployeeProfilePage.getInitialProps = ({ query }: EmployeeProfileProps) => {
  return { query };
};

export default function EmployeeProfilePage({ query }: EmployeeProfileProps) {
  const { data: employee, failureReason } = api.employee.findOne.useQuery({
    id: query.id,
  });

  const { data: employees } = api.employee.find.useQuery();

  if (failureReason?.data?.httpStatus === 401) {
    router.push("/");
  }

  const { toast } = useToast();

  const [showModal, setShowModal] = useState<boolean>(false);

  const [showDropdown] = useState<boolean>(false);

  const deleteEmployee = api.employee.delete.useMutation({
    onSuccess: () => {
      toast({ title: "Employee deleted successfully." });
      router.push("/staff");
    },
  });

  function handleDelete() {
    if (employee?.id) {
      deleteEmployee.mutate({ employeeId: employee.id });
    }
  }

  if (!employee) {
    return <Spinner />;
  }

  return (
    <main className="flex flex-col px-12 pb-80 pt-24">
      <div className="relative mb-2 w-fit">
        <SelectEmployees links employees={employees} />
      </div>
      <div className="flex flex-col rounded-md border border-slate-300 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-800">
        {/* name and button begin */}
        <div className="flex items-center justify-between border-b border-slate-300 py-4 dark:border-slate-600">
          <Heading size={"sm"} className="pl-4 text-left">
            {employee.name}
          </Heading>

          <Link
            href={`/staff/${employee.id}/schedule`}
            className={`ml-auto mr-2 ${buttonVariants({
              size: "lg",
            })}`}
          >
            <Calendar className="mr-4" /> Schedules
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost">
                <MoreVertical />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>View More</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link
                  href={`/staff/${employee.id}/schedule`}
                  className="flex w-full items-center"
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  <span>Monthly Schedules</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link
                  href={`/staff/${employee.id}/notes`}
                  className="flex w-full items-center"
                >
                  <Scroll className="mr-2 h-4 w-4" />
                  <span>Notes</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link
                  href={`/staff/${employee.id}/roles`}
                  className="flex w-full items-center"
                >
                  <UserCog className="mr-2 h-4 w-4" />
                  <span>Roles</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link
                  href={`/staff/${employee.id}/preferences`}
                  className="flex w-full items-center"
                >
                  <Sticker className="mr-2 h-4 w-4" />
                  Schedule Preferences
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link
                  href={`/staff/${employee.id}/vacation`}
                  className="flex w-full items-center"
                >
                  <Palmtree className="mr-2 h-4 w-4" />
                  <span>Vacation</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link
                  href={`/staff/${employee.id}/sick-leave`}
                  className="flex w-full items-center"
                >
                  <HeartPulse className="mr-2 h-4 w-4" />
                  <span>Sick Leave</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link
                  href={`/staff/${employee.id}/personal`}
                  className="flex w-full items-center"
                >
                  <User className="mr-2 h-4 w-4" />
                  <span>Personal Info</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setShowModal(true)}
                className="cursor-pointer"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Delete Employee</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {/* name and button end */}

        {showDropdown && <div className="relative"></div>}
        <div className="flex">
          {/* personal info begin */}
          <Link
            href={`/staff/${employee.id}/personal`}
            className="min-h-[18rem] w-1/5 cursor-pointer border-r border-slate-300 py-4 pl-2 transition-colors duration-150 hover:bg-slate-100 dark:border-slate-600 dark:hover:bg-slate-700"
          >
            <Heading size={"xs"} className="mb-2 flex items-center">
              Personal Info
              <User size={26} className="ml-2" />
            </Heading>

            <div className="flex items-center border-slate-400 py-2">
              <Paragraph className="flex items-center">
                <Mail className="mr-4" /> {employee.email}
              </Paragraph>
            </div>

            <div className="flex items-center border-slate-400 py-1">
              <Paragraph className="flex items-center">
                <Phone className="mr-4" />
                {employee.phoneNumber}
              </Paragraph>
            </div>

            <div className="flex items-center py-1">
              <Paragraph className="flex items-center">
                <MapPin className="mr-4" />
                {employee.address}
              </Paragraph>
            </div>
          </Link>
          {/* personal info end */}

          {/* roles begin */}
          <Link
            href={`/staff/${employee.id}/roles`}
            className="flex w-1/5 cursor-pointer flex-col border-r border-slate-300 py-4 pl-2 transition-colors duration-150 hover:bg-slate-100 dark:border-slate-600 dark:hover:bg-slate-700"
          >
            <Heading size={"xs"} className="mb-2 flex items-center">
              Roles
              <UserCog size={26} className="ml-2" />
            </Heading>

            <div className="flex flex-col py-2">
              {employee.roles && employee.roles.length > 0 ? (
                employee.roles.map((role: { id: string; name: string }) => (
                  <Paragraph key={role.id} className="text-left">
                    {role.name}
                  </Paragraph>
                ))
              ) : (
                <Paragraph className="text-left">No roles</Paragraph>
              )}
            </div>
          </Link>
          {/* roles end */}

          {/* sick leave begin */}
          <Link
            href={`/staff/${employee.id}/sick-leave`}
            className="flex w-1/5 cursor-pointer flex-col border-r border-slate-300 py-4 pl-2 transition-colors duration-150 hover:bg-slate-100 dark:border-slate-600 dark:hover:bg-slate-700"
          >
            <Heading size={"xs"} className="mb-2 flex items-center">
              Sick Leave
              <HeartPulse size={26} className="ml-2" />
            </Heading>
            <div className="flex flex-col space-y-2 py-2">
              <Paragraph className="text-left">
                {checkSickLeave(employee.sickLeaves!!)}
              </Paragraph>
            </div>
          </Link>
          {/* sick leave end */}

          {/* vacation begin */}
          <Link
            href={`/staff/${employee.id}/vacation`}
            className="flex w-1/5 cursor-pointer flex-col border-r border-slate-300
                 py-4 pl-2 transition-colors duration-150 hover:bg-slate-100 dark:border-slate-600 dark:hover:bg-slate-700"
          >
            <Heading size={"xs"} className="mb-2 flex items-center">
              Vacation <Palmtree size={26} className="ml-2" />
            </Heading>
            <div className="flex flex-col space-y-2 py-2">
              <Paragraph className="text-left">
                {checkEmployeeVacation(employee.vacations!!)}
              </Paragraph>
            </div>
          </Link>
          {/* vacation end */}

          {/* preferences begin */}
          <Link
            href={`/staff/${employee.id}/preferences`}
            className="flex w-1/5 cursor-pointer flex-col py-4 pl-2 transition-colors duration-150 hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            <Heading size={"xs"} className="mb-2 flex items-center">
              Schedule Preferences <Sticker size={26} className="ml-2" />
            </Heading>

            <div className="flex flex-col py-2">
              {employee.schedulePreference ? (
                <>
                  <Paragraph className="text-left font-medium">
                    {employee.schedulePreference.hoursPerMonth > 0
                      ? employee.schedulePreference.hoursPerMonth +
                        " hours per month"
                      : "No monthly hours set"}
                  </Paragraph>
                  {employee.schedulePreference.shiftModels.length > 0 ? (
                    employee.schedulePreference.shiftModels
                      .sort((a, b) => a.start - b.start)
                      .map((item) => (
                        <Paragraph key={item.id} className="text-left">
                          [{formatTime(item.start)} - {formatTime(item.end)}]
                        </Paragraph>
                      ))
                  ) : (
                    <Paragraph className="text-left">
                      No shift preferences.
                    </Paragraph>
                  )}
                </>
              ) : (
                <Paragraph className="text-left">
                  No schedule preferences.
                </Paragraph>
              )}
            </div>
          </Link>
          {/* preferences end */}
        </div>
        {showModal && (
          <FormModal
            showModal={showModal}
            submit={handleDelete}
            cancel={() => setShowModal(false)}
            text={
              "This action cannot be undone. This will permanently delete this employee and remove all his associated data from our servers."
            }
          />
        )}
      </div>
    </main>
  );
}
