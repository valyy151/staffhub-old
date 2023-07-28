import { Button } from "./ui/Button";
import { MonthlyRoster } from "./SchedulePDF";
import { formatMonth } from "~/utils/dateFormatting";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { type EmployeeProfile } from "~/utils/api";
import { Save } from "lucide-react";

interface PDFButtonProps {
  value: Date;
  employee: EmployeeProfile;
}

export default function PDFButton({ employee, value }: PDFButtonProps) {
  return (
    <Button
      size={"lg"}
      className="mr-8 h-14 text-2xl hover:text-sky-500 dark:hover:text-sky-400"
    >
      <Save size={28} className="mr-2" />
      <PDFDownloadLink
        document={
          <MonthlyRoster
            employee={employee}
            month={value.toLocaleDateString("en-GB", {
              month: "long",
              year: "numeric",
            })}
          />
        }
        fileName={`${employee?.name} - ${formatMonth(value.getTime() / 1000)}`}
      >
        Save as PDF
      </PDFDownloadLink>
    </Button>
  );
}
