import { api } from "~/utils/api";
import { useState } from "react";
import { HeartPulse } from "lucide-react";
import Heading from "~/components/ui/Heading";
import { Button } from "~/components/ui/Button";
import Sidebar from "~/components/Employees/Sidebar";
import AddSickLeave from "~/components/Employees/AddSickLeave";
import SickLeave from "~/components/Employees/SickLeave";

interface SickLeavePageProps {
  query: { id: string };
}

SickLeavePage.getInitialProps = ({ query }: SickLeavePageProps) => {
  return { query };
};

export default function SickLeavePage({ query }: SickLeavePageProps) {
  const [showPlanner, setShowPlanner] = useState<boolean>(false);

  const { data: employee } = api.employee.findOne.useQuery({
    id: query.id,
  });

  if (!employee || !employee.sickLeaves) {
    return <Sidebar />;
  }

  function checkSickLeave() {
    const currentDate: any = Date.now();

    if (!employee?.sickLeaves || employee.sickLeaves.length === 0) {
      return "Not on sick leave.";
    }

    for (const sickLeave of employee.sickLeaves) {
      const startDate: any = new Date(Number(sickLeave.start));
      const endDate: any = new Date(Number(sickLeave.end));

      if (currentDate >= startDate && currentDate <= endDate) {
        const remainingDays = Math.ceil(
          (endDate - currentDate) / (1000 * 60 * 60 * 24)
        );

        return `On sick leave till ${endDate.toLocaleDateString("en-GB", {
          weekday: "long",
          month: "long",
          year: "numeric",
          day: "2-digit",
        })} ( Ends in ${remainingDays} days )`;
      }
    }
    return;
  }

  return (
    <main className="flex flex-col items-center">
      <Sidebar employee={employee} />
      <Heading className="mt-4">{employee?.name}</Heading>
      <Button
        size={"lg"}
        title="Create a new sick leave"
        className="mt-2 h-14 text-2xl"
        onClick={() => {
          setShowPlanner(true);
        }}
      >
        <HeartPulse size={32} className="mr-2" />
        New Sick Leave
      </Button>
      {showPlanner && (
        <AddSickLeave employee={employee} setShowPlanner={setShowPlanner} />
      )}

      {!showPlanner && (
        <Heading size={"sm"} className="mb-3 mt-16">
          {checkSickLeave()}
        </Heading>
      )}

      {employee?.sickLeaves.map((sickLeave) => (
        <SickLeave key={sickLeave.id} sickLeave={sickLeave} />
      ))}
    </main>
  );
}
