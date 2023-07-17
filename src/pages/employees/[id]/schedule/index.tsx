import { Calendar } from "react-calendar";
import "react-calendar/dist/Calendar.css";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFDownloadLink,
} from "@react-pdf/renderer";
import { useState } from "react";
import router from "next/router";
import Paragraph from "~/components/ui/Paragraph";
import {
  formatDate,
  formatDateLong,
  formatDay,
  formatMonth,
  formatTime,
  formatTotal,
} from "~/utils/dateFormatting";
import Heading from "~/components/ui/Heading";
import { Button } from "~/components/ui/Button";
import { calculateTotalHours } from "~/utils/calculateHours";
import Dropdown from "~/components/Employees/Dropdown";
import { MoreVertical } from "lucide-react";
import { api } from "~/utils/api";
import { Employee } from "@prisma/client";

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#1e293b",
    color: "#e2e8f0",
  },
  title: {
    textAlign: "center",
    fontSize: 24,
    padding: 16,
    borderBottom: "1px solid #64748b",
    backgroundColor: "#334155",
  },
  section: {
    padding: 3.32,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    borderBottom: "1px solid #64748b",
  },
  sectionShift: {
    padding: 3.32,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    borderBottom: "1px solid #64748b",
    backgroundColor: "#334155",
  },

  shift: {
    width: 200,
    fontSize: 16,
    textAlign: "center",
  },
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
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);

  const { data: employee }: any = api.employee.findOneAndMonthly.useQuery({
    id: query.id,
  });

  const handleMonthChange: any = (date: Date) => {
    setValue(date);
  };

  const MonthlyRoster = () => (
    <Document pageLayout="singlePage">
      <Page size="A4" orientation="portrait" style={styles.page}>
        <View style={styles.title}>
          <Text>
            {employee.name} - {month} ({calculateTotalHours(employee.workDays)}
            h)
          </Text>
        </View>
        {employee.workDays.map((workDay) => (
          <View
            key={workDay.id}
            style={
              workDay.shifts[0]?.start && workDay.shifts[0]?.end
                ? styles.section
                : styles.sectionShift
            }
          >
            <Text style={styles.shift}>{formatDate(workDay.date)}</Text>

            {workDay.shifts[0]?.start && workDay.shifts[0]?.end ? (
              <>
                <Text style={styles.shift}>
                  {formatTime(workDay.shifts[0]?.start)} -{" "}
                  {formatTime(workDay.shifts[0]?.end)}
                </Text>
                <Text style={styles.shift}>
                  {formatTotal(
                    workDay.shifts[0]?.start,
                    workDay.shifts[0]?.end
                  )}
                </Text>
              </>
            ) : (
              <>
                <Text style={styles.shift}></Text>
                <Text style={styles.shift}></Text>
              </>
            )}
          </View>
        ))}
      </Page>
    </Document>
  );

  return (
    <main className="pt-20">
      <div className="relative ml-auto flex">
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
        <Heading size={"sm"}>Schedules for {employee.name}</Heading>
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
                {month} ({calculateTotalHours(employee.workDays)} hours)
              </Heading>
              <Button
                size={"lg"}
                className="mr-8 text-xl hover:text-sky-500 dark:hover:text-sky-400"
              >
                <PDFDownloadLink
                  document={<MonthlyRoster />}
                  fileName={`${employee.name} - ${formatMonth(
                    value.getTime() / 1000
                  )}`}
                >
                  Save as PDF
                </PDFDownloadLink>
              </Button>
            </div>

            {employee.workDays.map((day, index) => (
              <div
                key={day._id}
                onClick={() => router.push(`/days/${day._id}`)}
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
    </main>
  );
}
