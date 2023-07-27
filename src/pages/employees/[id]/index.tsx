import {
  Calendar,
  HeartPulse,
  Mail,
  MapPin,
  Palmtree,
  Pencil,
  Phone,
  ScrollText,
  Sticker,
  User,
} from "lucide-react";
import router from "next/router";
import { useState } from "react";
import toast from "react-hot-toast";
import Dropdown from "~/components/Employees/Dropdown";
import { Button } from "~/components/ui/Button";
import Heading from "~/components/ui/Heading";
import Modal from "~/components/ui/Modal";
import Paragraph from "~/components/ui/Paragraph";
import Spinner from "~/components/ui/Spinner";

import { api } from "~/utils/api";
import { checkEmployeeVacation, checkSickLeave } from "~/utils/checkAbsence";

interface EmployeeProfileProps {
  query: { id: string };
}

EmployeeProfilePage.getInitialProps = ({ query }: EmployeeProfileProps) => {
  return { query };
};

export default function EmployeeProfilePage({ query }: EmployeeProfileProps) {
  const { data: employee } = api.employee.findOne.useQuery({
    id: query.id,
  });

  const [showDropdown, setShowDropdown] = useState<boolean>(false);

  const [showModal, setShowModal] = useState<boolean>(false);

  const deleteEmployee = api.employee.delete.useMutation({
    onSuccess: () => {
      toast.success("Employee deleted successfully.");
      router.push("/employees");
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
      <div className="flex flex-col rounded-md border border-slate-300 bg-white shadow-lg dark:border-slate-500 dark:bg-slate-700">
        {/* name and button begin */}
        <div className="flex items-center justify-between border-b border-slate-300 py-4 dark:border-slate-500">
          <Heading className="pl-4 text-left">{employee.name}</Heading>

          <Button
            className="ml-auto mr-2 min-w-0 rounded-full  p-8 text-2xl"
            onClick={() => router.push(`/employees/${employee.id}/schedule`)}
          >
            Schedules <Calendar className="ml-4" />
          </Button>
          <Button
            className="mr-2 min-w-0 rounded-full p-8 text-2xl focus:ring-0 focus:ring-offset-0"
            variant={"subtle"}
            onClick={() => setShowDropdown(!showDropdown)}
          >
            Manage <Pencil className="ml-4" />
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
            onClick={() => router.push(`/employees/${employee.id}/personal`)}
            className="w-1/5 cursor-pointer border-r border-slate-300 py-4 pl-2 transition-colors duration-150 hover:bg-slate-50 dark:border-slate-500 dark:hover:bg-slate-600"
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

          {/* notes begin */}
          <div
            onClick={() => router.push(`/employees/${employee.id}/notes`)}
            className="flex w-1/5 cursor-pointer flex-col border-r border-slate-300 py-4 pl-2 transition-colors duration-150 hover:bg-slate-50 dark:border-slate-500 dark:hover:bg-slate-600"
          >
            <Heading size={"xs"} className="mb-2 flex items-center">
              Notes
              <ScrollText size={26} className="ml-2" />
            </Heading>

            <div className="flex flex-col py-2">
              {employee.notes?.length > 0 ? (
                <Paragraph className="text-left">
                  {employee.notes.length}{" "}
                  {employee.notes.length === 1 ? "Note" : "Notes"}
                </Paragraph>
              ) : (
                <Paragraph className="text-left">No notes</Paragraph>
              )}
            </div>
          </div>
          {/* notes end */}

          {/* sick leave begin */}
          <div
            onClick={() => router.push(`/employees/${employee.id}/sick-leave`)}
            className="flex w-1/5 cursor-pointer flex-col border-r border-slate-300 py-4 pl-2 transition-colors duration-150 hover:bg-slate-50 dark:border-slate-500 dark:hover:bg-slate-600"
          >
            <Heading size={"xs"} className="mb-2 flex items-center">
              Sick Leave
              <HeartPulse size={26} className="ml-2" />
            </Heading>
            <div className="flex flex-col space-y-2 py-2">
              <Paragraph className="text-left">
                {checkSickLeave(employee.sickLeaves)}
              </Paragraph>
            </div>
          </div>
          {/* sick leave end */}

          {/* vacation begin */}
          <div
            onClick={() => router.push(`/employees/${employee.id}/vacation`)}
            className="flex w-1/5 cursor-pointer flex-col border-r border-slate-300
                 py-4 pl-2 transition-colors duration-150 hover:bg-slate-50 dark:border-slate-500 dark:hover:bg-slate-600"
          >
            <Heading size={"xs"} className="mb-2 flex items-center">
              Vacation <Palmtree size={26} className="ml-2" />
            </Heading>
            <div className="flex flex-col space-y-2 py-2">
              <Paragraph className="text-left">
                {checkEmployeeVacation(employee.vacations)}
              </Paragraph>
            </div>
          </div>
          {/* vacation end */}

          {/* preferences begin */}
          <div
            onClick={() => router.push(`/employees/${employee.id}/preferences`)}
            className="flex w-1/5 cursor-pointer flex-col py-4 pl-2 transition-colors duration-150 hover:bg-slate-50 dark:hover:bg-slate-600"
          >
            <Heading size={"xs"} className="mb-2 flex items-center">
              Shift Preferences <Sticker size={26} className="ml-2" />
            </Heading>

            <div className="flex flex-col py-2">
              {employee.shiftPreferences?.length > 0 ? (
                <Paragraph className="text-left">
                  {employee.shiftPreferences.length} Shift{" "}
                  {employee.shiftPreferences.length === 1
                    ? "preference"
                    : "preferences"}
                </Paragraph>
              ) : (
                <Paragraph className="text-left">
                  No shift preferences.
                </Paragraph>
              )}
            </div>
          </div>
          {/* preferences end */}
        </div>
        {showModal && (
          <Modal
            icon="employee"
            showModal={showModal}
            cancel={() => setShowModal(false)}
            text={"Are you sure you want to delete this employee?"}
            submit={handleDelete}
          />
        )}
      </div>
    </main>
  );
}
