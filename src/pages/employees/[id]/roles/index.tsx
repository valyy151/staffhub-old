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
import { ArrowLeft, Save, ScrollText } from "lucide-react";
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

  if (!employee) {
    return <Sidebar />;
  }

  return (
    <main className="flex">
      <Sidebar employee={employee} />

      <div className="mt-4 flex w-[36rem] flex-col">
        <Heading>Roles for {employee?.name}</Heading>

        {employee?.roles.length === 0 && (
          <Paragraph size={"lg"} className="mt-4">
            {employee?.name} has no assigned roles.
          </Paragraph>
        )}
      </div>
    </main>
  );
}
