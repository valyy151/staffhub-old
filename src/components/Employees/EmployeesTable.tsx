import { Search, UserPlus } from "lucide-react";
import Paragraph from "../ui/Paragraph";
import { Button, buttonVariants } from "../ui/Button";
import { FC, useState } from "react";
import Heading from "../ui/Heading";
import Link from "next/link";
import { useRouter } from "next/router";

interface EmployeesTableProps {
  data: Employee[];
}

interface Employee {
  id: string;
  name: string;
  email: string;
  address: string;
  phoneNumber: string;
}

const EmployeesTable: FC<EmployeesTableProps> = ({ data }) => {
  const [searchText, setSearchText] = useState<string>("");

  const headings = ["Name", "Email", "Phone Number", "Address"];

  const filteredData = data.filter((employee) => {
    const values = Object.values(employee).join("").toLowerCase();
    return values.includes(searchText.toLowerCase());
  });

  const router = useRouter();

  return (
    <>
      <div className="mb-2 mt-8 flex w-2/5 items-end justify-between sm:w-3/5">
        <div className="flex items-baseline space-x-4  sm:ml-8 ">
          <Heading>Your Staff</Heading>
          <Heading size={"xs"}>
            has {data.length} {data.length > 1 ? "members" : "member"}
          </Heading>
        </div>
        <div className="mb-1 flex items-center space-x-12 sm:mr-8 ">
          <div className="mx-auto flex items-center rounded-lg border  border-white bg-white px-2 shadow focus-within:shadow-md  dark:border-slate-700 dark:bg-slate-700 sm:w-full">
            <Search />
            <input
              type="text"
              value={searchText}
              placeholder="Search your employees..."
              className="m-0 w-full py-2 shadow-none outline-none focus:ring-0 dark:bg-slate-700"
              onChange={(event) => setSearchText(event.target.value)}
            />
          </div>

          <Link
            href={`/employees/new`}
            title="Add a new employee"
            className={`${buttonVariants()} w-60`}
          >
            Add Employee {<UserPlus className="ml-2" />}
          </Link>
        </div>
      </div>
      <table className="w-2/5 divide-y-2 divide-slate-300 border-2 border-slate-300 bg-white text-left dark:divide-slate-600  dark:border-slate-600 dark:bg-slate-700 sm:w-3/5">
        <thead>
          <tr>
            {headings.map((heading, index) => (
              <th
                key={`heading-${index}`}
                className="whitespace-nowrap px-8 py-3 font-bold "
              >
                {heading}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y-2 divide-slate-300 dark:divide-slate-600">
          {filteredData.map((employee: Employee, index: number) => (
            <tr
              onClick={() => {
                router.push(`/employees/${employee.id}`);
              }}
              key={`employee-${index}`}
              className={`cursor-pointer duration-75 hover:bg-slate-200 dark:hover:bg-slate-600
							${
                index % 2 === 0
                  ? "bg-slate-50 dark:bg-slate-800 "
                  : "bg-white dark:bg-slate-700"
              }`}
            >
              <td className={`cursor-pointer'} whitespace-nowrap px-8 py-3`}>
                {employee.name}
              </td>
              <td className={`cursor-pointer'} whitespace-nowrap px-8 py-3`}>
                {employee.email}
              </td>
              <td className={`cursor-pointer'} whitespace-nowrap px-8 py-3`}>
                {employee.phoneNumber}
              </td>
              <td className={`cursor-pointer'} whitespace-nowrap px-8 py-3`}>
                {employee.address}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default EmployeesTable;
