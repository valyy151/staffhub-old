import {
    HeartPulse,
    Mail,
    MapPin,
    MoreVertical,
    Palmtree,
    Phone,
    Sticker,
    Trash2,
    User,
    UserCog
} from "lucide-react";
import Link from "next/link";
import router from "next/router";
import { useState } from "react";
import { api } from "~/utils/api";
import { checkEmployeeVacation, checkSickLeave } from "~/utils/checkAbsence";
import { formatTime } from "~/utils/dateFormatting";

import Sidebar from "@/components/Staff/Sidebar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import FormModal from "@/components/ui/form-modal";
import Heading from "@/components/ui/heading";
import Paragraph from "@/components/ui/paragraph";
import { useToast } from "@/components/ui/use-toast";

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
    return <Sidebar />;
  }

  return (
    <main className="flex">
      <Sidebar employee={employee} employees={employees} />
      <div className="w-full pr-4 pt-4">
        <div className="flex flex-col rounded-lg border ">
          {/* name and button begin */}
          <div className="flex items-center justify-between border-b py-4">
            <Heading size={"xs"} className="pl-4 text-left">
              {employee.name}
            </Heading>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost">
                  <MoreVertical />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>View More</DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={() => setShowModal(true)} className="cursor-pointer">
                  <Trash2 className="mr-2 h-4 w-4" />
                  <span>Delete Employee</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          {/* name and button end */}

          <div className="flex">
            {/* personal info begin */}
            <Link href={`/staff/${employee.id}/personal`} className="min-h-[18rem] grow cursor-pointer border-b border-r border-b-transparent py-4 pl-2 transition-colors duration-150 hover:border-b hover:border-b-primary">
              <Heading size={"xxs"} className="mb-2 flex items-center">
                Personal Info
                <User className="ml-2" />
              </Heading>

              <div className="flex items-center  py-2">
                <Paragraph size={"sm"} className="flex items-center">
                  <Mail className="mr-4" /> {employee.email}
                </Paragraph>
              </div>

              <div className="flex items-center  py-1">
                <Paragraph size={"sm"} className="flex items-center">
                  <Phone className="mr-4" />
                  {employee.phoneNumber}
                </Paragraph>
              </div>

              <div className="flex items-center py-1">
                <Paragraph size={"sm"} className="flex items-center">
                  <MapPin className="mr-4" />
                  {employee.address}
                </Paragraph>
              </div>
            </Link>
            {/* personal info end */}

            {/* roles begin */}
            <Link href={`/staff/${employee.id}/roles`} className="flex grow cursor-pointer flex-col border-b border-r border-b-transparent py-4 pl-2 transition-colors duration-150 hover:border-b hover:border-b-primary">
              <Heading size={"xxs"} className="mb-2 flex items-center">
                Roles
                <UserCog className="ml-2" />
              </Heading>

              <div className="flex flex-col py-2">
                {employee.roles && employee.roles.length > 0 ? (
                  employee.roles.map((role: { id: string; name: string }) => (
                    <Paragraph size={"sm"} key={role.id} className="text-left">
                      {role.name}
                    </Paragraph>
                  ))
                ) : (
                  <Paragraph size={"sm"} className="text-left">
                    No roles
                  </Paragraph>
                )}
              </div>
            </Link>
            {/* roles end */}

            {/* sick leave begin */}
            <Link href={`/staff/${employee.id}/sick-leave`} className="flex grow cursor-pointer flex-col border-b border-r border-b-transparent py-4 pl-2 transition-colors duration-150 hover:border-b hover:border-b-primary">
              <Heading size={"xxs"} className="mb-2 flex items-center">
                Sick Leave
                <HeartPulse className="ml-2" />
              </Heading>
              <div className="flex flex-col space-y-2 py-2">
                <Paragraph size={"sm"} className="text-left">
                  {checkSickLeave(employee.sickLeaves!!)}
                </Paragraph>
              </div>
            </Link>
            {/* sick leave end */}

            {/* vacation begin */}
            <Link
              href={`/staff/${employee.id}/vacation`}
              className="flex grow cursor-pointer flex-col 
                  border-b border-r border-b-transparent py-4 pl-2 transition-colors duration-150 hover:border-b hover:border-b-primary"
            >
              <Heading size={"xxs"} className="mb-2 flex items-center">
                Vacation <Palmtree className="ml-2" />
              </Heading>
              <div className="flex flex-col space-y-2 py-2">
                <Paragraph size={"sm"} className="text-left">
                  {checkEmployeeVacation(employee.vacations!!)}
                </Paragraph>
              </div>
            </Link>
            {/* vacation end */}

            {/* preferences begin */}
            <Link href={`/staff/${employee.id}/preferences`} className="flex grow cursor-pointer flex-col border-b border-b-transparent py-4 pl-2 transition-colors duration-150 hover:border-b hover:border-b-primary">
              <Heading size={"xxs"} className="mb-2 flex items-center">
                Schedule Preferences <Sticker className="ml-2" />
              </Heading>

              <div className="flex flex-col py-2">
                {employee.schedulePreference ? (
                  <>
                    <Paragraph size={"sm"} className="text-left font-medium">
                      {employee.schedulePreference.hoursPerMonth > 0 ? employee.schedulePreference.hoursPerMonth + " hours per month" : "No monthly hours set"}
                    </Paragraph>
                    {employee.schedulePreference.shiftModels.length > 0 ? (
                      employee.schedulePreference.shiftModels
                        .sort((a, b) => a.start - b.start)
                        .map((item) => (
                          <Paragraph size={"sm"} key={item.id} className="text-left">
                            [{formatTime(item.start)} - {formatTime(item.end)}]
                          </Paragraph>
                        ))
                    ) : (
                      <Paragraph size={"sm"} className="text-left">
                        No shift preferences.
                      </Paragraph>
                    )}
                  </>
                ) : (
                  <Paragraph size={"sm"} className="text-left">
                    No schedule preferences.
                  </Paragraph>
                )}
              </div>
            </Link>
            {/* preferences end */}
          </div>
          {showModal && (
            <FormModal showModal={showModal} submit={handleDelete} cancel={() => setShowModal(false)} text={"This action cannot be undone. This will permanently delete this employee and remove all his associated data from our servers."} />
          )}
        </div>
      </div>
    </main>
  );
}
