import { useState } from "react";
import router from "next/router";
import { getSession } from "next-auth/react";
import Heading from "@/components/ui/heading";
import Spinner from "@/components/ui/spinner";
import { UserPlus } from "lucide-react";
import { api } from "~/utils/api";
import { type GetServerSideProps } from "next/types";
import Head from "next/head";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx);

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
};

export default function EmployeesListPage() {
  const { data } = api.employee.find.useQuery();

  const [searchText, setSearchText] = useState<string>("");

  if (!data) {
    return <Spinner />;
  }

  const filteredData = data
    .filter((employee) => {
      const values = Object.values(employee).join("").toLowerCase();
      return values.includes(searchText.toLowerCase());
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  if (data.length === 0) {
    return (
      <main className="flex flex-col items-center">
        <Head>
          <title>Your Staff | StaffHub</title>
          <meta
            name="Your Staff"
            content="Manage your staff and their shifts"
          />
        </Head>
        <Heading size={"xs"} className="mt-6">
          You do not currently have any staff members on your account.
        </Heading>

        <Heading size={"xxs"} className="mt-2">
          Click below if you wish to create an employee.
        </Heading>

        <Link href={"/staff/new"} className={`${buttonVariants()} mt-4`}>
          <UserPlus size={20} className="mr-2" /> New Employee
        </Link>
      </main>
    );
  }

  return (
    <main className="p-4 pb-8">
      <Head>
        <title>Your Staff | StaffHub</title>
        <meta name="Your Staff" content="Manage your staff and their shifts" />
      </Head>

      <div className="flex w-full justify-between pb-2 pt-8">
        <div className="flex items-baseline space-x-4">
          <Heading>Your Staff</Heading>

          <Heading size={"sm"}>
            has {data.length} {data.length > 1 ? "members" : "member"}
          </Heading>
        </div>
        <div className="flex items-center space-x-2">
          <Link href={"/staff/new"} className={`${buttonVariants()} w-64`}>
            <UserPlus className="mr-2" /> New Employee
          </Link>

          <Input
            type="text"
            value={searchText}
            placeholder="Search..."
            className="truncate"
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
      </div>

      <Table className="mt-2">
        <TableHeader>
          <TableRow className="hover:bg-inherit">
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone Number</TableHead>
            <TableHead className="text-right">Address</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredData.map((employee) => (
            <TableRow
              key={employee.id}
              onClick={() => router.push(`/staff/${employee.id}`)}
              className="cursor-pointer duration-75 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <TableCell className="cursor-pointer whitespace-nowrap font-medium">
                {employee.name}
              </TableCell>

              <TableCell className="cursor-pointer whitespace-nowrap">
                {employee.email}
              </TableCell>

              <TableCell className="cursor-pointer whitespace-nowrap">
                {employee.phoneNumber}
              </TableCell>

              <TableCell className="cursor-pointer whitespace-nowrap text-right">
                {employee.address}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </main>
  );
}
