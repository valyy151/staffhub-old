import router from "next/router";
import { useState } from "react";
import { api } from "~/utils/api";
import Heading from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import Sidebar from "@/components/Staff/Sidebar";
import Paragraph from "@/components/ui/paragraph";
import Vacation from "@/components/Staff/Vacation";
import { FileDigit, Palmtree } from "lucide-react";
import { howManyDays } from "~/utils/calculateHours";
import { checkVacations } from "~/utils/checkVacations";
import AddVacation from "@/components/Staff/AddVacation";
import ChangeVacationDays from "@/components/Staff/ChangeVacationDays";

type VacationPageProps = {
  query: { id: string };
};

VacationPage.getInitialProps = ({ query }: VacationPageProps) => {
  return { query };
};

export default function VacationPage({ query }: VacationPageProps) {
  const [showPlanner, setShowPlanner] = useState<boolean>(false);
  const [showChangeAmount, setShowChangeAmount] = useState<boolean>(false);

  const { data: employee, failureReason } = api.employee.findOne.useQuery({
    id: query.id,
  });

  if (failureReason?.data?.httpStatus === 401) {
    router.push("/");
  }

  function renderVacations() {
    if (!employee) {
      return null;
    }

    const [pastVacations, futureVacations, currentVacation] = checkVacations(
      employee.vacations!!
    );

    return (
      <div>
        {currentVacation && (
          <>
            {" "}
            <Heading size={"xxs"} className="mb-3 mt-16 flex items-center">
              <Palmtree size={42} className="ml-1 mr-2 text-green-400" />
              Currently on vacation -
              <span className="ml-2">
                Ends in: {howManyDays(currentVacation)}{" "}
                {howManyDays(currentVacation) === 1 ? "day" : "days"}
              </span>
            </Heading>
            <Vacation employee={employee} vacation={currentVacation} />
          </>
        )}

        {futureVacations && futureVacations.length > 0 ? (
          <>
            <Heading size={"xxs"} className="mb-3 mt-12 flex items-center">
              <Palmtree size={42} className="ml-1 mr-2 text-rose-400" />{" "}
              Upcoming Vacations
            </Heading>
            {futureVacations
              ?.sort((a, b) => Number(b.start) - Number(a.start))
              .map((vacation) => (
                <Vacation
                  key={vacation.id}
                  vacation={vacation}
                  employee={employee}
                />
              ))}
          </>
        ) : (
          <>
            <Heading size={"xxs"} className="mb-3 mt-12 flex items-center">
              <Palmtree size={42} className="ml-1 mr-2 text-rose-400" />{" "}
              Upcoming Vacations
            </Heading>
            <Paragraph size={"sm"} className="ml-14 mt-4">
              No upcoming vacations
            </Paragraph>
          </>
        )}

        {pastVacations && pastVacations.length > 0 ? (
          <>
            <Heading size={"xxs"} className="mb-3 mt-12 flex items-center">
              <Palmtree size={42} className="ml-1 mr-2 text-gray-400" /> Past
              Vacations
            </Heading>

            {pastVacations
              ?.sort((a, b) => Number(b.start) - Number(a.start))
              .map((vacation) => (
                <Vacation
                  key={vacation.id}
                  vacation={vacation}
                  employee={employee}
                />
              ))}
          </>
        ) : (
          <>
            <Heading size={"xxs"} className="mb-3 mt-12 flex items-center">
              <Palmtree size={42} className="ml-1 mr-2 text-gray-400" /> Past
              Vacations
            </Heading>
            <Paragraph size={"sm"} className="ml-14 mt-4">
              No past vacations
            </Paragraph>
          </>
        )}
      </div>
    );
  }

  if (!employee) {
    return <Sidebar />;
  }

  return (
    <main className="flex">
      <Sidebar employee={employee} />

      <div>
        <Heading size={"sm"} className="mt-4">
          {employee?.name} - Vacation days remaining: {employee?.vacationDays}
        </Heading>

        <div className="mt-2 flex space-x-2">
          <Button
            title="Create a new vacation"
            onClick={() => {
              setShowPlanner(true);
              setShowChangeAmount(false);
            }}
          >
            <Palmtree className="mr-2" />
            New Vacation
          </Button>
          <Button
            variant={"subtle"}
            title="Change the amount of vacation days"
            onClick={() => {
              setShowPlanner(false);
              setShowChangeAmount(true);
            }}
          >
            <FileDigit className="mr-2" />
            Change remaining days
          </Button>
        </div>

        {showChangeAmount && (
          <ChangeVacationDays
            employee={employee}
            setShowChangeAmount={setShowChangeAmount}
          />
        )}
        {showPlanner && (
          <AddVacation employee={employee} setShowPlanner={setShowPlanner} />
        )}

        {!showChangeAmount && !showPlanner && renderVacations()}
      </div>
    </main>
  );
}
