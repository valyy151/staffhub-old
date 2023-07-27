import { useState } from "react";
import { api } from "~/utils/api";
import { HeartPulse } from "lucide-react";
import Heading from "~/components/ui/Heading";
import { Button } from "~/components/ui/Button";
import Paragraph from "~/components/ui/Paragraph";
import Sidebar from "~/components/Employees/Sidebar";
import { howManyDays } from "~/utils/calculateHours";
import SickLeave from "~/components/Employees/SickLeave";
import { checkSickLeaves } from "~/utils/checkSickLeaves";
import AddSickLeave from "~/components/Employees/AddSickLeave";

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

  function renderSickLeaves() {
    if (!employee) {
      return null;
    }

    const [pastSickLeaves, currentSickLeave] = checkSickLeaves(
      employee.sickLeaves
    );

    return (
      <div>
        {currentSickLeave ? (
          <>
            {" "}
            <Heading size={"sm"} className="mb-3 mt-16 flex items-center">
              <HeartPulse size={42} className="ml-1 mr-2 text-rose-400" />
              Currently on sick leave -
              <span className="ml-2">
                Ends in: {howManyDays(currentSickLeave)}{" "}
                {howManyDays(currentSickLeave) === 1 ? "day" : "days"}
              </span>
            </Heading>
            <SickLeave sickLeave={currentSickLeave} />
          </>
        ) : (
          <Heading size={"sm"} className="mb-3 mt-16 flex items-center">
            <HeartPulse size={42} className="ml-1 mr-2 text-green-400" />
            Currently not on sick leave
          </Heading>
        )}

        {pastSickLeaves && pastSickLeaves.length > 0 ? (
          <>
            <Heading size={"xs"} className="mb-3 mt-12 flex items-center">
              <HeartPulse size={42} className="ml-1 mr-2 text-gray-400" /> Past
              Sick Leaves
            </Heading>

            {pastSickLeaves?.map((sickLeave) => (
              <SickLeave key={sickLeave.id} sickLeave={sickLeave} />
            ))}
          </>
        ) : (
          <>
            <Heading size={"xs"} className="mb-3 mt-12 flex items-center">
              <HeartPulse size={32} className="ml-1 mr-2 text-gray-400" /> Past
              Sick Leaves
            </Heading>
            <Paragraph className="mt-4">No past sick leaves</Paragraph>
          </>
        )}
      </div>
    );
  }

  if (!employee || !employee.sickLeaves) {
    return <Sidebar />;
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

      {!showPlanner && renderSickLeaves()}
    </main>
  );
}
