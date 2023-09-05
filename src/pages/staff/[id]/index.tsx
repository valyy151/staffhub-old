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
import toast from "react-hot-toast";
import Dropdown from "~/components/Staff/Dropdown";
import { Button } from "~/components/ui/Button";
import Heading from "~/components/ui/Heading";
import FormModal from "~/components/ui/FormModal";
import Paragraph from "~/components/ui/Paragraph";
import Spinner from "~/components/ui/Spinner";

import { api } from "~/utils/api";
import { checkEmployeeVacation, checkSickLeave } from "~/utils/checkAbsence";
import { formatTime } from "~/utils/dateFormatting";
import SearchEmployees from "../../../components/Schedule/SearchEmployees";
import Input from "~/components/ui/Input";

interface EmployeeProfileProps {
  query: { id: string };
}

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

  const [showModal, setShowModal] = useState<boolean>(false);

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const [showDropdown, setShowDropdown] = useState<boolean>(false);

  const deleteEmployee = api.employee.delete.useMutation({
    onSuccess: () => {
      toast.success("Employee deleted successfully.");
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
      onClick={() => showDropdown && setShowDropdown(false)}
      className="flex flex-col px-12 pb-80 pt-24"
    >
      <div className="relative mb-2 w-fit">
        <div
          className="group cursor-pointer rounded bg-white shadow hover:shadow-md dark:bg-slate-700 dark:shadow-slate-950 "
          onClick={() => setIsOpen(!isOpen)}
        >
          <Input
            readOnly
            type="text"
            value={employee.name}
            placeholder={"Choose an Employee..."}
            className="group m-0 h-14 cursor-pointer text-xl caret-transparent ring-offset-0 focus:ring-0 focus:ring-offset-0 dark:placeholder:text-slate-400"
          />
        </div>
        {isOpen && (
          <div className="animate-slideDown rounded-md">
            <div className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-md dark:bg-slate-700 dark:text-slate-300">
              <ul
                className={`${
                  employees?.length! > 8 && "h-[28.5rem] overflow-y-scroll"
                } p-1`}
              >
                {employees
                  ?.sort((a, b) => a.name.localeCompare(b.name))
                  .map((employee) => (
                    <li
                      className="flex h-14 cursor-pointer items-center rounded-md px-4 py-2 text-xl hover:bg-gray-100 dark:hover:bg-slate-600"
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
      <div className="flex flex-col rounded-md border border-slate-300 bg-white shadow-lg dark:border-slate-600 dark:bg-slate-750">
        {/* name and button begin */}
        <div className="flex items-center justify-between border-b border-slate-300 py-4 dark:border-slate-600">
          <Heading className="pl-4 text-left">{employee.name}</Heading>

          <Button
            className="ml-auto mr-2 rounded-lg p-8 text-3xl"
            onClick={() => router.push(`/staff/${employee.id}/schedule`)}
          >
            <Calendar className="mr-4" /> Schedules
          </Button>
          <Button
            className="mr-2 rounded-lg p-8 text-3xl focus:ring-0 focus:ring-offset-0"
            variant={"subtler"}
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
          <div
            onClick={() => router.push(`/staff/${employee.id}/personal`)}
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
          </div>
          {/* personal info end */}

          {/* roles begin */}
          <div
            onClick={() => router.push(`/staff/${employee.id}/roles`)}
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
          </div>
          {/* roles end */}

          {/* sick leave begin */}
          <div
            onClick={() => router.push(`/staff/${employee.id}/sick-leave`)}
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
          </div>
          {/* sick leave end */}

          {/* vacation begin */}
          <div
            onClick={() => router.push(`/staff/${employee.id}/vacation`)}
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
          </div>
          {/* vacation end */}

          {/* preferences begin */}
          <div
            onClick={() => router.push(`/staff/${employee.id}/preferences`)}
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
          </div>
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
