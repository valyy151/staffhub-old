import router from "next/router";
import { api } from "~/utils/api";
import toast from "react-hot-toast";
import { UserCog } from "lucide-react";
import Heading from "~/components/ui/Heading";
import { Button } from "~/components/ui/Button";
import Sidebar from "~/components/Staff/Sidebar";
import Paragraph from "~/components/ui/Paragraph";
import { useQueryClient } from "@tanstack/react-query";

type EmployeeRolesPageProps = {
  query: { id: string };
};

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
      toast.success(`Role assigned successfuly`);
    },

    onError: () => {
      toast.error(`Failed to assign role`);
    },
  });

  const removeRole = api.staffRole.removeFromEmployee.useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries();
      toast.success(`Role removed successfuly `);
    },

    onError: () => {
      toast.error(`Failed to remove role`);
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
        {employee?.allRoles.length === 0 && (
          <>
            <Paragraph size={"lg"} className="mt-4">
              You have not created any roles to assign to this employee.
            </Paragraph>
            <Button
              size={"lg"}
              onClick={() => router.push("/settings/roles")}
              className="mt-4 h-14 w-fit text-2xl"
            >
              <UserCog size={30} className="mr-2" /> Create a role
            </Button>
          </>
        )}

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
                  checked={employee?.roles!!.some((r) => r.id === role.id)}
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
