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
  const [showAddRole, setShowAddRole] = useState(false);

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
      toast.success(`Assigned role to ${employee?.name}`, {
        className: "text-xl text-center",
      });
    },

    onError: () => {
      toast.error(`Failed to assign role to ${employee?.name}`, {
        className: "text-xl text-center",
      });
    },
  });

  const removeRole = api.staffRole.removeFromEmployee.useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries();
      toast.success(`Removed role from ${employee?.name}`, {
        className: "text-xl text-center",
      });
    },

    onError: () => {
      toast.error(`Failed to remove role from ${employee?.name}`, {
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

      <div className="mt-4 flex w-[36rem] flex-col">
        <Heading>Roles for {employee?.name}</Heading>
        <Button
          size={"lg"}
          className="mt-2 h-14 w-fit text-2xl"
          onClick={() => setShowAddRole(true)}
        >
          <UserCog size={30} className="mr-2" /> Assign a Role
        </Button>
        {!showAddRole && employee?.roles.length === 0 && (
          <Paragraph size={"lg"} className="mt-4">
            {employee?.name} has no assigned roles.
          </Paragraph>
        )}
        {showAddRole && (
          <div className="mt-4">
            {/* for every role in the database, display a checkbox with the role
            name and a save button */}
            {employee?.allRoles.map((role) => (
              <div key={role.id} className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={employee?.roles.some((r) => r.id === role.id)}
                  onChange={(e) => {
                    handleChange(e, role.id);
                  }}
                />
                <Paragraph size={"lg"}>{role.name}</Paragraph>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
