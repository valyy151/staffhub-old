import { Download } from "lucide-react";
import { EmployeeProfile } from "~/utils/api";
import { formatMonth } from "~/utils/dateFormatting";

import { Button } from "@/components/ui/button";
import { PDFDownloadLink } from "@react-pdf/renderer";

import { SchedulePDF } from "./SchedulePDF";

type PDFButtonProps = {
  value: Date;
  month: string;
  employee: EmployeeProfile;
};

export default function PDFButton({ employee, value, month }: PDFButtonProps) {
  return (
    <Button className="mt-2">
      <Download className="mr-2" />
      <PDFDownloadLink
        document={<SchedulePDF employee={employee} month={month} />}
        fileName={`${employee?.name} - ${formatMonth(value.getTime() / 1000)}`}
      >
        Save as PDF
      </PDFDownloadLink>
    </Button>
  );
}
