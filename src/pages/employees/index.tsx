import Link from "next/link";
import { useState } from "react";
import router from "next/router";
import Input from "~/components/ui/Input";
import { type Employee, api } from "~/utils/api";
import Heading from "~/components/ui/Heading";
import Spinner from "~/components/ui/Spinner";
import { Search, UserPlus } from "lucide-react";
import { Button } from "~/components/ui/Button";

export default function EmployeesListPage() {
  const { data } = api.employee.find.useQuery();

  const [searchText, setSearchText] = useState<string>("");

  const headings = ["Name", "Email", "Phone Number", "Address"];

  if (!data) {
    return <Spinner />;
  }

  if (data.length === 0) {
    return (
      <main className="flex flex-col items-center">
        <Heading size={"sm"} className="mt-6">
          You do not currently have any employees on your account.
        </Heading>

        <Heading size={"xs"} className="mt-2">
          Click below if you wish to create an employee.
        </Heading>

        <Button
          size={"lg"}
          className="mt-4 h-14 text-2xl"
          onClick={() => router.push("/employees/new")}
        >
          <UserPlus size={30} className="mr-2" /> New Employee
        </Button>
      </main>
    );
  }

  const filteredData = data.filter((employee) => {
    const values = Object.values(employee).join("").toLowerCase();
    return values.includes(searchText.toLowerCase());
  });

  return (
    <main className="mx-auto flex flex-col items-center">
      <div className="mt-8 min-w-[85vw]">
        <div className="mb-2 flex justify-between">
          <div className="ml-6 flex items-baseline space-x-4">
            <Heading size={"lg"}>Your Staff</Heading>

            <Heading>
              has {data.length} {data.length > 1 ? "members" : "member"}
            </Heading>
          </div>
          <div className="mr-6 flex items-center space-x-2">
            <div className="mx-auto flex items-center rounded-md border border-slate-300 bg-white px-2 shadow focus-within:shadow-md focus-within:outline-none focus-within:ring-2 focus-within:ring-slate-400 focus-within:ring-offset-2 dark:border-slate-700 dark:bg-slate-700 dark:text-slate-50 dark:focus-within:ring-slate-400 dark:focus-within:ring-offset-slate-900 sm:w-full">
              <Search />

              <Input
                type="text"
                value={searchText}
                placeholder="Search for a staff member"
                className="h-12 w-96 border-none text-lg focus:outline-none focus:ring-0 focus:ring-offset-0"
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>

            <Button
              size={"lg"}
              className="flex h-12 w-4/5 text-xl"
              onClick={() => router.push("/employees/new")}
              title="Add a new employee"
            >
              <UserPlus size={24} className="mr-2" /> Add Employee
            </Button>
          </div>
        </div>

        <div className="h-[38.9rem] overflow-y-scroll border-2 border-slate-300 dark:border-slate-600">
          <table className="w-full divide-y-2 divide-slate-300 bg-white text-left text-lg dark:divide-slate-600 dark:bg-slate-700">
            <thead>
              <tr>
                {headings.map((heading, index) => (
                  <th
                    key={`heading-${index}`}
                    className="whitespace-nowrap px-8 py-4 font-bold "
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y-2 divide-slate-300 dark:divide-slate-600">
              {filteredData.map((employee: Employee, index: number) => (
                <tr
                  onClick={() => router.push(`/employees/${employee.id}`)}
                  key={`employee-${index}`}
                  className={`cursor-pointer duration-75 hover:bg-slate-100 dark:hover:bg-slate-700
							${
                index % 2 === 0
                  ? "bg-slate-50 dark:bg-slate-800 "
                  : "bg-white dark:bg-slate-750"
              }`}
                >
                  <td
                    className={`cursor-pointer'} whitespace-nowrap px-8 py-4`}
                  >
                    {employee.name}
                  </td>

                  <td
                    className={`cursor-pointer'} whitespace-nowrap px-8 py-4`}
                  >
                    {employee.email}
                  </td>

                  <td
                    className={`cursor-pointer'} whitespace-nowrap px-8 py-4`}
                  >
                    {employee.phoneNumber}
                  </td>

                  <td
                    className={`cursor-pointer'} whitespace-nowrap px-8 py-4`}
                  >
                    {employee.address}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
