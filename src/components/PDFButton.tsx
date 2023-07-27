import { Button } from "./ui/Button";
import { MonthlyRoster } from "./SchedulePDF";
import { formatMonth } from "~/utils/dateFormatting";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { type EmployeeProfile } from "~/utils/api";

interface PDFButtonProps {
  value: Date;
  month: string;
  employee: EmployeeProfile;
}

export default function PDFButton({ employee, month, value }: PDFButtonProps) {
  return (
    <Button
      size={"lg"}
      className="mr-8 text-xl hover:text-sky-500 dark:hover:text-sky-400"
    >
      <PDFDownloadLink
        document={<MonthlyRoster employee={employee} month={month} />}
        fileName={`${employee?.name} - ${formatMonth(value.getTime() / 1000)}`}
      >
        Save as PDF
      </PDFDownloadLink>
    </Button>
  );
}
