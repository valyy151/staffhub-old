import { UserCog } from "lucide-react";
import router from "next/router";
import { api } from "~/utils/api";

import Sidebar from "@/components/Staff/Sidebar";
import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import Paragraph from "@/components/ui/paragraph";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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

  const [showAddRole, setShowAddRole] = useState<boolean>(false);

  const { toast } = useToast();

  const queryClient = useQueryClient();

  const assignRoles = api.staffRole.assignToEmployee.useMutation({
    onSuccess: () => {
      toast({
        title: "Roles assigned.",
        description: "The roles have been assigned to the employee.",
      });
      setShowAddRole(false);
      queryClient.invalidateQueries();
    },

    onError: () => {
      toast({
        title: "An error occurred.",
        description: "Unable to assign roles to the employee.",
      });
    },
  });

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    assignRoles.mutate({
      roleIds: checkedRoles,
      employeeId: employee?.id!,
    });
  }

  const [checkedRoles, setCheckedRoles] = useState<string[]>([]);

  useEffect(() => {
    if (employee?.roles) {
      setCheckedRoles(employee.roles.map((role) => role.id));
    }
  }, [employee]);

  const handleCheck = (
    e: React.ChangeEvent<HTMLInputElement>,
    role: string
  ) => {
    if (e.target.checked) {
      setCheckedRoles((prev) => [...prev, role]);
    } else {
      setCheckedRoles((prev) => prev.filter((r) => r !== role));
    }
  };

  if (!employee) {
    return <Sidebar />;
  }

  if (employee.allRoles.length === 0) {
    return (
      <>
        <Paragraph size={"lg"} className="mt-4">
          You have not created any roles to assign to this employee.
        </Paragraph>
        <Button
          onClick={() => router.push("/settings/roles")}
          className="mt-4 h-14 w-fit text-2xl"
        >
          <UserCog size={30} className="mr-2" /> Create a role
        </Button>
      </>
    );
  }

  return (
    <main className="flex">
      <Sidebar employee={employee} />
      <div className="mt-4">
        <Heading size="sm">Assign roles to {employee?.name}</Heading>
        <Button className="mt-2" onClick={() => setShowAddRole(true)}>
          <UserCog className="mr-2" />
          Assign Roles
        </Button>
        <Heading size={"xs"} className="mt-4">
          {employee?.name} has the following roles:
        </Heading>
        {employee?.roles!.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Role</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employee?.roles?.map((role) => (
                <TableRow key={role.id}>
                  <TableCell>
                    <Link
                      href={"/settings/roles"}
                      className="underline-offset-[5px] hover:underline"
                    >
                      {role.name}
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <Paragraph className="mt-2">No roles assigned.</Paragraph>
        )}
      </div>

      {showAddRole && (
        <AlertDialog open>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Assign roles to {employee?.name}
              </AlertDialogTitle>
            </AlertDialogHeader>
            <form onSubmit={handleSubmit}>
              {employee?.allRoles.map((role) => (
                <div key={role.id} className="my-1">
                  <input
                    id={role.id}
                    type="checkbox"
                    value={role.id}
                    name={role.name}
                    className="mr-2"
                    checked={checkedRoles?.includes(role.id)}
                    onChange={(e) => handleCheck(e, role.id)}
                  />
                  <label htmlFor={role.id}>{role.name}</label>
                </div>
              ))}
              <AlertDialogFooter>
                <AlertDialogCancel
                  type="button"
                  onClick={() => setShowAddRole(false)}
                >
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction type="submit">Continue</AlertDialogAction>
              </AlertDialogFooter>
            </form>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </main>
  );
}
