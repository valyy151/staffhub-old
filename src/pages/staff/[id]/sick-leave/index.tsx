import { HeartPulse } from "lucide-react";
import router from "next/router";
import { useState } from "react";
import { api } from "~/utils/api";
import { howManyDays } from "~/utils/calculateHours";
import { checkSickLeaves } from "~/utils/checkSickLeaves";

import AddSickLeave from "@/components/Staff/AddSickLeave";
import SickLeave from "@/components/Staff/SickLeave";
import Sidebar from "@/components/Staff/Sidebar";
import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import Paragraph from "@/components/ui/paragraph";

type SickLeavePageProps = {
  query: { id: string };
};

SickLeavePage.getInitialProps = ({ query }: SickLeavePageProps) => {
  return { query };
};

export default function SickLeavePage({ query }: SickLeavePageProps) {
  const [showPlanner, setShowPlanner] = useState<boolean>(false);

  const { data: employee, failureReason } = api.employee.findOne.useQuery({
    id: query.id,
  });

  if (failureReason?.data?.httpStatus === 401) {
    router.push("/");
  }

  function renderSickLeaves() {
    if (!employee) {
      return null;
    }

    const [pastSickLeaves, currentSickLeave] = checkSickLeaves(
      employee.sickLeaves!!
    );

    return (
      <div>
        {currentSickLeave ? (
          <>
            {" "}
            <Heading size={"xxs"} className="mb-3 mt-16 flex items-center">
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
          <Heading size={"xxs"} className="mb-3 mt-16 flex items-center">
            <HeartPulse size={42} className="ml-1 mr-2 text-green-400" />
            Currently not on sick leave
          </Heading>
        )}

        {pastSickLeaves && pastSickLeaves.length > 0 ? (
          <>
            <Heading size={"xxs"} className="mb-3 mt-12 flex items-center">
              <HeartPulse size={42} className="ml-1 mr-2 text-gray-400" /> Past
              Sick Leaves
            </Heading>

            {pastSickLeaves?.map((sickLeave) => (
              <SickLeave key={sickLeave.id} sickLeave={sickLeave} />
            ))}
          </>
        ) : (
          <>
            <Heading size={"xxs"} className="mb-3 mt-12 flex items-center">
              <HeartPulse size={42} className="ml-1 mr-2 text-gray-400" /> Past
              Sick Leaves
            </Heading>
            <Paragraph size={"sm"} className="ml-14 mt-4">
              No past sick leaves
            </Paragraph>
          </>
        )}
      </div>
    );
  }

  if (!employee || !employee.sickLeaves) {
    return <Sidebar />;
  }

  return (
    <main className="flex">
      <Sidebar employee={employee} />
      <div className="mt-4">
        <Heading size={"sm"}>Sick leaves for {employee?.name}</Heading>
        <Button
          title="Create a new sick leave"
          className="mt-2"
          onClick={() => {
            setShowPlanner(true);
          }}
        >
          <HeartPulse className="mr-2" />
          New Sick Leave
        </Button>
        {showPlanner && (
          <AddSickLeave employee={employee} setShowPlanner={setShowPlanner} />
        )}
        {renderSickLeaves()}
      </div>
    </main>
  );
}
