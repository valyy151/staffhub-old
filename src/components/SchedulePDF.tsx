import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { createTw } from "react-pdf-tailwind";
import { EmployeeProfile } from "~/utils/api";

import { calculateTotalHours } from "~/utils/calculateHours";
import { formatDate, formatTime, formatTotal } from "~/utils/dateFormatting";

const tw = createTw({
  theme: {
    fontFamily: {
      sans: ["General Sans"],
    },
    extend: {
      colors: {
        custom: "#bada55",
      },
    },
  },
});

const styles = StyleSheet.create({
  title: {
    margin: 0,
    paddingLeft: 12,
    paddingTop: 16,
    paddingBottom: 16,
    display: "flex",
    backgroundColor: "black",
    color: "white",
    fontSize: 26,
  },
});

export function MonthlyRoster({
  month,
  employee,
}: {
  month: string;
  employee: EmployeeProfile;
}) {
  return (
    <Document pageLayout="singlePage">
      <Page size="B4" orientation="portrait" style={tw("bg-white")}>
        <Text style={styles.title}>
          {employee?.name} - {month} [{calculateTotalHours(employee.workDays)}{" "}
          hours]
        </Text>
        <View style={tw("flex flex-row")}>
          <Text
            style={tw(
              "px-4 py-[0.3572rem] border-b border-r w-1/4 bg-gray-200"
            )}
          >
            Date
          </Text>

          <Text
            style={tw(
              "px-4 py-[0.3572rem] border-b border-r w-1/4 bg-gray-200"
            )}
          >
            Time
          </Text>

          <Text
            style={tw(
              "px-4 py-[0.3572rem] border-b border-r w-1/4 bg-gray-200"
            )}
          >
            Total
          </Text>

          <Text
            style={tw(
              "px-4 py-[0.3572rem] border-b border-r w-1/4 bg-gray-200"
            )}
          >
            Note
          </Text>
        </View>
        {employee.workDays.map((workDay) => (
          <View style={tw("m-0 flex flex-row")}>
            <Text style={tw("px-4 py-[0.3572rem] border-b border-r w-1/4")}>
              {formatDate(workDay.date)}
            </Text>

            {workDay.shifts[0] &&
            workDay.shifts[0].start &&
            workDay.shifts[0].end ? (
              <>
                <Text
                  style={tw(
                    "px-4 py-[0.3572rem] flex flex-row border-b border-r w-1/4"
                  )}
                >
                  {formatTime(workDay.shifts[0].start)} -{" "}
                  {formatTime(workDay.shifts[0].end)}
                </Text>

                <Text
                  style={tw(
                    "px-4 py-[0.3572rem] flex flex-row border-b border-r w-1/4"
                  )}
                >
                  {formatTotal(workDay.shifts[0].start, workDay.shifts[0].end)}
                </Text>
                <Text
                  style={tw("px-4 py-[0.3572rem] border-b border-r w-1/4")}
                ></Text>
              </>
            ) : (
              <>
                <Text
                  style={tw("px-4 py-[0.3572rem] border-b border-r w-1/4")}
                ></Text>
                <Text
                  style={tw("px-4 py-[0.3572rem] border-b border-r w-1/4")}
                ></Text>
                <Text
                  style={tw("px-4 py-[0.3572rem] border-b border-r w-1/4")}
                ></Text>
              </>
            )}
          </View>
        ))}
      </Page>
    </Document>
  );
}
