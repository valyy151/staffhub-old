import { Dispatch, FC, SetStateAction, useState } from "react";
import {
  Calendar,
  Mail,
  MapPin,
  MoreVertical,
  Palmtree,
  Pencil,
  Phone,
  Scroll,
  ScrollText,
  Sticker,
  User,
  User2,
} from "lucide-react";

import { Employee, EmployeeNote, ShiftPreference } from "@prisma/client";
import Heading from "../ui/Heading";
import Paragraph from "../ui/Paragraph";
import { Button } from "../ui/Button";
import Dropdown from "./Dropdown";
import Modal from "../ui/Modal";
import router from "next/router";
import { api } from "~/utils/api";
import { toast } from "react-hot-toast";

interface EmployeeProfileProps {
  employee: any;
  showDropdown: boolean;
  setShowDropdown: Dispatch<SetStateAction<boolean>>;
}

export default function EmployeeProfile({
  employee,
  showDropdown,
  setShowDropdown,
}: EmployeeProfileProps) {
  const [showModal, setShowModal] = useState<boolean>(false);

  const vacations = employee?.vacations;

  const deleteEmployee = api.employee.delete.useMutation({
    onSuccess: () => {
      toast.success("Employee deleted successfully.");
      router.push("/employees");
    },
  });

  function checkEmployeeVacation() {
    const currentDate: any = Date.now();

    if (!vacations || vacations.length === 0) {
      return "No upcoming vacations.";
    }

    for (const vacation of vacations) {
      const startDate: any = new Date(Number(vacation.start));
      const endDate: any = new Date(Number(vacation.end));
      if (currentDate >= startDate && currentDate <= endDate) {
        const remainingDays = Math.ceil(
          (endDate - currentDate) / (1000 * 60 * 60 * 24)
        );
        return `On vacation till ${endDate.toLocaleDateString(
          "en-GB"
        )} ( Ends in ${remainingDays} days )`;
      } else if (currentDate < startDate) {
        const remainingDays = Math.ceil(
          (startDate - currentDate) / (1000 * 60 * 60 * 24)
        );
        return `Next vacation in ${remainingDays} days  ( ${startDate.toLocaleDateString(
          "en-GB"
        )} )`;
      }
    }
    return "No upcoming vacations.";
  }

  return (
    <main className="flex flex-col rounded-md border border-slate-300 bg-white shadow-lg dark:border-slate-500 dark:bg-slate-700">
      {/* name and button begin */}
      <div className="flex items-center justify-between border-b border-slate-300 py-4 dark:border-slate-500">
        <Heading className="pl-4 text-left">{employee.name}</Heading>

        <Button
          className="ml-auto mr-2 min-w-0 rounded-full  p-8 text-2xl"
          variant={"default"}
          onClick={() => router.push(`/employees/${employee.id}/schedule`)}
        >
          Schedules <Calendar className="ml-4" />
        </Button>
        <Button
          className="mr-2 min-w-0 rounded-full bg-slate-200 p-8 text-2xl hover:bg-slate-300 focus:ring-0 focus:ring-offset-0 dark:bg-slate-600 dark:hover:bg-slate-500"
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
          onClick={() => router.push(`/employees/${employee.id}/about`)}
          className="w-1/4 cursor-pointer border-r border-slate-300 py-4 pl-2 transition-colors duration-150 hover:bg-slate-50 dark:border-slate-500 dark:hover:bg-slate-600"
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
          className="flex w-1/4 cursor-pointer flex-col border-r border-slate-300 py-4 pl-2 transition-colors duration-150 hover:bg-slate-50 dark:border-slate-500 dark:hover:bg-slate-600"
        >
          <Heading size={"xs"} className="mb-2 flex items-center">
            Notes
            <ScrollText size={26} className="ml-2" />
          </Heading>

          <div className="flex flex-col py-2">
            {employee.notes?.length > 0 ? (
              employee.notes?.map((note: EmployeeNote, index: number) => (
                <Paragraph key={index} className="text-left">
                  {note.content}
                </Paragraph>
              ))
            ) : (
              <Paragraph className="text-left">
                There are no notes for this employee.
              </Paragraph>
            )}
          </div>
        </div>
        {/* notes end */}

        {/* vacation begin */}
        <div
          onClick={() => router.push(`/employees/${employee.id}/vacation`)}
          className="flex w-1/4 cursor-pointer flex-col border-r border-slate-300
    				py-4 pl-2 transition-colors duration-150 hover:bg-slate-50 dark:border-slate-500 dark:hover:bg-slate-600"
        >
          <Heading size={"xs"} className="mb-2 flex items-center">
            Vacation <Palmtree size={26} className="ml-2" />
          </Heading>
          <div className="flex flex-col space-y-2 py-2">
            <Paragraph className="text-left">
              {checkEmployeeVacation()}
            </Paragraph>
          </div>
        </div>
        {/* vacation end */}

        {/* preferences begin */}
        <div
          onClick={() => router.push(`/employees/${employee.id}/preferences`)}
          className="flex w-1/4 cursor-pointer flex-col py-4 pl-2 transition-colors duration-150 hover:bg-slate-50 dark:hover:bg-slate-600"
        >
          <Heading size={"xs"} className="mb-2 flex items-center">
            Shift Preferences <Sticker size={26} className="ml-2" />
          </Heading>

          <div className="flex flex-col py-2">
            {employee.shiftPreferences &&
            employee.shiftPreferences?.length > 0 ? (
              employee.shiftPreferences?.map(
                (shiftPreference: ShiftPreference) => (
                  <Paragraph key={shiftPreference.id} className="text-left">
                    {shiftPreference.content}
                  </Paragraph>
                )
              )
            ) : (
              <Paragraph className="text-left">
                There are no shift preferences for this employee.
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
          submit={() => deleteEmployee.mutate({ employeeId: employee.id })}
        />
      )}
    </main>
  );
}
