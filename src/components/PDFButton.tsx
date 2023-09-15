import { Button } from "./ui/Button";
import { MonthlyRoster } from "./SchedulePDF";
import { formatMonth } from "~/utils/dateFormatting";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { type EmployeeProfile } from "~/utils/api";
import { Download } from "lucide-react";

type PDFButtonProps = {
  value: Date;
  month: string;
  employee: EmployeeProfile | undefined;
};

export default function PDFButton({ employee, value, month }: PDFButtonProps) {
  return (
    <Button size={"lg"} className="mt-2 text-xl">
      <Download className="mr-2" />
      <PDFDownloadLink
        document={<MonthlyRoster employee={employee} month={month} />}
        fileName={`${employee?.name} - ${formatMonth(value.getTime() / 1000)}`}
      >
        Save as PDF
      </PDFDownloadLink>
    </Button>
  );
}
