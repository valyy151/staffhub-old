import { useState } from "react";
import { api } from "~/utils/api";
import toast from "react-hot-toast";
import Input from "~/components/ui/Input";
import Heading from "~/components/ui/Heading";
import Note from "~/components/Employees/Note";
import { Button } from "~/components/ui/Button";
import Paragraph from "~/components/ui/Paragraph";
import Sidebar from "~/components/Employees/Sidebar";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Save, ScrollText, UserCog } from "lucide-react";
import router from "next/router";

interface EmployeeRolesPageProps {
  query: { id: string };
}

EmployeeRolesPage.getInitialProps = ({ query }: EmployeeRolesPageProps) => {
  return { query };
};

export default function EmployeeRolesPage({ query }: EmployeeRolesPageProps) {
  const { data: employee, failureReason } = api.employee?.findOne.useQuery({
    id: query.id,
    fetchAllRoles: true,
  });

  if (failureReason?.data?.httpStatus === 401) {
    router.push("/");
  }

  const queryClient = useQueryClient();

  const assignRole = api.staffRole.assignToEmployee.useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries();
      toast.success(`Role assigned successfuly`, {
        className: "text-xl text-center",
      });
    },

    onError: () => {
      toast.error(`Failed to assign role`, {
        className: "text-xl text-center",
      });
    },
  });

  const removeRole = api.staffRole.removeFromEmployee.useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries();
      toast.success(`Role removed successfuly `, {
        className: "text-xl text-center",
      });
    },

    onError: () => {
      toast.error(`Failed to remove role`, {
        className: "text-xl text-center",
      });
    },
  });

  if (!employee) {
    return <Sidebar />;
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement>,
    roleId: string
  ) {
    if (!employee?.id) {
      return;
    }

    if (e.target.checked) {
      assignRole.mutate({ employeeId: employee?.id, staffRoleId: roleId });
    } else {
      removeRole.mutate({ employeeId: employee?.id, staffRoleId: roleId });
    }
  }

  return (
    <main className="flex">
      <Sidebar employee={employee} />

      <div className="mt-4 flex flex-col">
        <Heading>Roles for {employee?.name}</Heading>

        <div className="mt-4 grid grid-cols-2 gap-4">
          {employee?.allRoles
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((role) => (
              <div
                key={role.id}
                className="flex cursor-pointer items-center rounded border border-slate-300 pl-4 hover:shadow dark:border-slate-700 dark:shadow-slate-700"
              >
                <input
                  id={role.id}
                  type="checkbox"
                  className="h-8 w-8 cursor-pointer"
                  name="bordered-checkbox cursor-pointer"
                  onChange={(e) => handleChange(e, role.id)}
                  checked={employee?.roles.some((r) => r.id === role.id)}
                />
                <label
                  htmlFor={role.id}
                  className="ml-2 w-full cursor-pointer py-4 text-2xl"
                >
                  {role.name}
                </label>
              </div>
            ))}
        </div>
      </div>
    </main>
  );
}
