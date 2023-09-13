import { useState } from "react";
import router from "next/router";
import { getSession } from "next-auth/react";
import Heading from "~/components/ui/Heading";
import Spinner from "~/components/ui/Spinner";
import { Search, UserPlus } from "lucide-react";
import { type Employee, api } from "~/utils/api";
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
        <Heading size={"sm"} className="mt-6">
          You do not currently have any staff members on your account.
        </Heading>

        <Heading size={"xs"} className="mt-2">
          Click below if you wish to create an employee.
        </Heading>

        <Link href={"/staff/new"} className={`${buttonVariants()}`}>
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
          <Link href={"/staff/new"} className={`${buttonVariants()}`}>
            <UserPlus size={20} className="mr-2" /> New Employee
          </Link>
          <div className="flex items-center rounded-md border border-slate-300 bg-white px-2 shadow focus-within:shadow-md focus-within:outline-none focus-within:ring-2 focus-within:ring-slate-400 focus-within:ring-offset-2 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-50 dark:focus-within:ring-slate-400 dark:focus-within:ring-offset-slate-900">
            <Search />

            <Input
              type="text"
              value={searchText}
              placeholder="Search..."
              className="truncate border-none focus:outline-none focus:ring-0 focus:ring-offset-0"
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
        </div>
      </div>

      <Table className="mt-2">
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone Number</TableHead>
            <TableHead className="text-right">Address</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredData.map((employee: Employee, index: number) => (
            <TableRow
              key={employee.id}
              onClick={() => router.push(`/staff/${employee.id}`)}
              className="cursor-pointer duration-75 hover:bg-slate-50 dark:hover:bg-slate-800"
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

      {/* <table className="text w-full divide-y-2 text-left text-sm dark:divide-slate-700">
        <thead>
          <tr>
            {headings.map((heading, index) => (
              <th
                key={`heading-${index}`}
                className="whitespace-nowrap px-8 py-4 font-bold"
              >
                {heading}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y-2 dark:divide-slate-700">
          {filteredData.map((employee: Employee, index: number) => (
            <tr
              onClick={() => router.push(`/staff/${employee.id}`)}
              key={`employee-${index}`}
              className="cursor-pointer duration-75 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <td className="cursor-pointer whitespace-nowrap px-8 py-4 font-medium">
                {employee.name}
              </td>

              <td className="cursor-pointer whitespace-nowrap px-8 py-4">
                {employee.email}
              </td>

              <td className="cursor-pointer whitespace-nowrap px-8 py-4">
                {employee.phoneNumber}
              </td>

              <td className="cursor-pointer whitespace-nowrap px-8 py-4">
                {employee.address}
              </td>
            </tr>
          ))}
        </tbody>
      </table> */}
    </main>
  );
}
