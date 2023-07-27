import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

import { calculateTotalHours } from "~/utils/calculateHours";
import { formatDate, formatTime, formatTotal } from "~/utils/dateFormatting";

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

export function MonthlyRoster({
  employee,
  month,
}: {
  employee: any;
  month: string;
}) {
  return (
    <Document pageLayout="singlePage">
      <Page size="A4" orientation="portrait" style={styles.page}>
        <View style={styles.title}>
          <Text>
            {employee?.name} - {month} (
            {calculateTotalHours(employee?.workDays)}
            h)
          </Text>
        </View>
        {employee?.workDays.map((workDay: any) => (
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
}
