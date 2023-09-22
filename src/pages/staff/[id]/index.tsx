import {
  Calendar,
  HeartPulse,
  Mail,
  MapPin,
  Palmtree,
  Pencil,
  Phone,
  Sticker,
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
import Dropdown from "@/components/Staff/Dropdown";
import { formatTime } from "~/utils/dateFormatting";
import { checkEmployeeVacation, checkSickLeave } from "~/utils/checkAbsence";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const [showDropdown, setShowDropdown] = useState<boolean>(false);

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
    <main
      onClick={() => {
        isOpen && setIsOpen(false);
        showDropdown && setShowDropdown(false);
      }}
      className="flex flex-col px-12 pb-80 pt-24"
    >
      <div className="relative mb-2 w-fit">
        <div
          className="group cursor-pointer rounded bg-white shadow hover:shadow-md dark:bg-slate-800 dark:shadow-slate-950 "
          onClick={() => setIsOpen(!isOpen)}
        >
          <Input
            readOnly
            type="text"
            placeholder={"Choose an Employee..."}
            className="group m-0 cursor-pointer text-lg caret-transparent ring-offset-0 focus:ring-0 focus:ring-offset-0 dark:placeholder:text-slate-400"
          />
        </div>
        {isOpen && (
          <div className="animate-slideDown rounded-md">
            <div className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-md dark:bg-slate-800 dark:text-slate-300">
              <ul
                className={`${
                  employees?.length! > 8 && "h-[28.5rem] overflow-y-scroll"
                } p-1`}
              >
                {employees
                  ?.sort((a, b) => a.name.localeCompare(b.name))
                  .map((employee) => (
                    <li
                      className="flex cursor-pointer items-center rounded-md px-3 py-2 text-lg hover:bg-gray-100 dark:hover:bg-slate-700"
                      key={employee.id}
                      onClick={() => {
                        setIsOpen(false);
                        router.push(`/staff/${employee.id}`);
                      }}
                    >
                      {employee.name}
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        )}
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
          <Button
            className="mr-2"
            size={"lg"}
            variant={"subtle"}
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <Pencil className="mr-4" /> Manage
          </Button>
        </div>
        {/* name and button end */}

        {showDropdown && (
          <div className="relative">
            <Dropdown
              showDelete={true}
              employee={employee}
              setShowModal={setShowModal}
              setShowDropdown={setShowDropdown}
            />
          </div>
        )}
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
            heading={"Delete employee?"}
            cancel={() => setShowModal(false)}
            text={"Are you sure you want to delete this employee?"}
          />
        )}
      </div>
    </main>
  );
}
