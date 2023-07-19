import { useEffect, useState } from "react";
import router from "next/router";
import {
  formatDateLong,
  formatDay,
  formatTime,
  getMonthBoundaryTimestamps,
} from "~/utils/dateFormatting";
import { api } from "~/utils/api";
import dynamic from "next/dynamic";
import "react-calendar/dist/Calendar.css";
import { Calendar } from "react-calendar";
import { MoreVertical } from "lucide-react";
import Heading from "~/components/ui/Heading";
import { Button } from "~/components/ui/Button";
import Paragraph from "~/components/ui/Paragraph";
import Dropdown from "~/components/Employees/Dropdown";
import { calculateTotalHours } from "~/utils/calculateHours";
import Spinner from "~/components/ui/Spinner";

const PDFButton = dynamic(() => import("~/components/PDFButton"), {
  ssr: false,
});

interface SchedulePageProps {
  query: { id: string };
}

SchedulePage.getInitialProps = ({ query }: SchedulePageProps) => {
  return { query };
};

export default function SchedulePage({ query }: SchedulePageProps) {
  const [month, setMonth] = useState("");
  const [value, setValue] = useState<Date>(new Date());
  const [loading, setLoading] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);

  const [startOfMonth, endOfMonth]: any = getMonthBoundaryTimestamps(value);

  const { data: employee }: any = api.employee?.findOneAndMonthly.useQuery({
    id: query.id,
    endOfMonth,
    startOfMonth,
  });

  const handleMonthChange: any = (date: Date) => {
    setValue(date);
  };

  useEffect(() => {
    if (employee) {
      setLoading(false);
    }
  }, [employee]);

  return (
    <main
      onClick={() => showDropdown && setShowDropdown(false)}
      className="flex flex-col items-center pt-20"
    >
      {loading ? (
        <Spinner />
      ) : (
        <>
          {" "}
          <div className="relative ml-auto mr-2 flex">
            <Button
              className="ml-auto min-w-0 rounded-full hover:bg-slate-50 dark:hover:bg-slate-600"
              variant={"link"}
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <MoreVertical size={24} />
            </Button>
            {showDropdown && (
              <Dropdown
                employee={employee}
                setShowModal={setShowModal}
                setShowDropdown={setShowDropdown}
              />
            )}
          </div>
          <div className="flex w-full items-center justify-center space-x-8 border-b-2 border-slate-300 pb-4 dark:border-slate-600">
            {" "}
            <Heading size={"sm"}>Schedules for {employee?.name}</Heading>
          </div>
          {value ? (
            <div className="mt-16 flex w-full">
              <div
                className={`${
                  value
                    ? "slide-in-bottom overflow-y-scroll border border-slate-300 bg-white shadow dark:border-slate-500 dark:bg-slate-800"
                    : "border-none"
                }  mx-auto h-[37rem] overflow-x-hidden rounded border border-slate-300`}
              >
                <div className="flex w-full items-center justify-between border-b-2 border-t border-slate-300 bg-white py-4 dark:border-slate-500 dark:bg-slate-800">
                  <Heading
                    size={"xs"}
                    className="text-md ml-8 text-center font-normal"
                  >
                    {month} ({calculateTotalHours(employee?.workDays)} hours)
                  </Heading>
                  <PDFButton employee={employee} month={month} value={value} />
                </div>

                {employee?.workDays.map((day: any, index: number) => (
                  <div
                    key={day.id}
                    onClick={() => router.push(`/days/${day.id}`)}
                    className={`group flex w-[48rem] cursor-pointer items-center space-y-4 border-b-2 border-slate-300 dark:border-slate-500 ${
                      index % 2 === 0
                        ? "bg-slate-50 dark:bg-slate-700"
                        : "bg-white dark:bg-slate-800"
                    } py-2`}
                  >
                    <div className="ml-8 mr-auto flex w-96 flex-col items-start group-hover:text-sky-500 dark:group-hover:text-sky-400">
                      {formatDay(day.date)}
                      <Paragraph className=" group-hover:text-sky-500 dark:group-hover:text-sky-400">
                        {formatDateLong(day.date)}
                      </Paragraph>
                    </div>

                    <Paragraph className="ml-auto mr-8  pb-2 group-hover:text-sky-500 dark:group-hover:text-sky-400">
                      {day.shifts[0]?.start && (
                        <>
                          {formatTime(day.shifts[0]?.start)} -{" "}
                          {formatTime(day.shifts[0]?.end)}
                        </>
                      )}
                    </Paragraph>
                  </div>
                ))}
              </div>

              <div className=" mr-52 mt-24">
                <Calendar
                  value={value}
                  view={"month"}
                  maxDetail="year"
                  className="h-fit"
                  onChange={handleMonthChange}
                />
              </div>
            </div>
          ) : (
            <div className="mt-12 flex w-full">
              <Heading className="slide-in-bottom mx-auto w-[48.5rem] pt-64 text-center text-slate-600 dark:text-slate-400">
                Choose a month
              </Heading>
              <div className="slide-in-bottom-h1 mr-52 mt-28">
                <Calendar
                  value={value}
                  view={"month"}
                  maxDetail="year"
                  className="h-fit"
                  onChange={handleMonthChange}
                />
              </div>
            </div>
          )}
        </>
      )}
    </main>
  );
}
