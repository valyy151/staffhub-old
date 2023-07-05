import { Search, UserPlus } from "lucide-react";
import Paragraph from "../ui/Paragraph";
import { Button } from "../ui/Button";
import { FC, useState } from "react";

interface EmployeesTableProps {
  data: Employee[];
}

interface Employee {
  _id: string;
  name: string;
  email: string;
  phone: string;
  notes: string[];
  [key: string]: any;
  shiftPreferences: string[];
  vacationDays: number | string;
}

const EmployeesTable: FC<EmployeesTableProps> = ({ data }) => {
  const headings = ["Name", "Email", "Phone Number", "Address"];
  const [searchText, setSearchText] = useState<string>("");

  const filteredData = data.filter((employee) => {
    const values = Object.values(employee).join("").toLowerCase();
    return values.includes(searchText.toLowerCase());
  });

  return (
    <>
      <div className="mb-2 flex w-2/5 items-end justify-between sm:w-3/5">
        <div className="flex items-baseline space-x-4  sm:ml-8 	">
          <h1 className="slide-in-bottom">Your Staff</h1>
          <Paragraph className="slide-in-bottom">
            has {data.length} {data.length > 1 ? "members" : "member"}
          </Paragraph>
        </div>
        <div className="slide-in-bottom mb-1 flex  items-center space-x-12 sm:mr-8 ">
          <div className="mx-auto flex items-center  rounded-lg border border-white bg-white px-2 shadow dark:border-slate-700 dark:bg-slate-700 sm:w-full">
            <Search />
            <input
              type="text"
              value={searchText}
              placeholder="Search your employees..."
              className="group m-0 py-2 shadow-none focus:ring-0"
              onChange={(event) => setSearchText(event.target.value)}
            />
          </div>

          <Button
            title="Add a new employee"
            className=" mb-0 mt-auto h-[2.65rem] w-64 shadow"
            onClick={() => {}}
          >
            Add Employee {<UserPlus className="ml-2" />}
          </Button>
        </div>
      </div>
      <table className="slide-in-bottom w-2/5 divide-y-2 divide-slate-300 border-2 border-slate-300 bg-white text-left dark:divide-slate-600  dark:border-slate-600 dark:bg-slate-700 sm:w-3/5">
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
              onClick={() => {}}
              key={`employee-${index}`}
              className={` cursor-pointer duration-75 hover:bg-slate-200 dark:hover:bg-slate-600
							${
                index % 2 === 0
                  ? "bg-slate-50 dark:bg-slate-800 "
                  : "bg-white dark:bg-slate-700"
              }`}
            >
              {headings.map((heading, index) => (
                <td
                  key={`employee-${index}`}
                  className={`cursor-pointer'} whitespace-nowrap px-8 py-3`}
                >
                  {employee[heading.toLowerCase()]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default EmployeesTable;
