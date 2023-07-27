import { api } from "~/utils/api";
import toast from "react-hot-toast";
import Input from "~/components/ui/Input";
import { useEffect, useState } from "react";
import Heading from "~/components/ui/Heading";
import { Button } from "~/components/ui/Button";
import Paragraph from "~/components/ui/Paragraph";
import Sidebar from "~/components/Employees/Sidebar";
import { useQueryClient } from "@tanstack/react-query";
import Vacation from "~/components/Employees/Vacation";
import { checkVacations } from "~/utils/checkVacations";
import { ArrowLeft, FileDigit, Palmtree, Save } from "lucide-react";
import VacationPlanner from "~/components/Employees/VacationPlanner";
import { howManyDays } from "~/utils/calculateHours";

interface VacationPageProps {
  query: { id: string };
}

VacationPage.getInitialProps = ({ query }: VacationPageProps) => {
  return { query };
};

export default function VacationPage({ query }: VacationPageProps) {
  const [amount, setAmount] = useState<number>(0);
  const [daysPlanned, setDaysPlanned] = useState<number>(0);
  const [showPlanner, setShowPlanner] = useState<boolean>(false);
  const [daysRemaining, setDaysRemaining] = useState<number | undefined>(0);
  const [showChangeAmount, setShowChangeAmount] = useState<boolean>(false);

  const { data: employee } = api.employee.findOne.useQuery({
    id: query.id,
  });

  useEffect(() => {
    setDaysRemaining(employee?.vacationDays);
  }, [employee?.vacationDays]);

  const queryClient = useQueryClient();

  const updateAmountMutation = api.vacation.updateAmountOfDays.useMutation({
    onSuccess: () => {
      setShowChangeAmount(false);
      void queryClient.invalidateQueries();
      toast.success("Vacation days updated successfully.");
    },
    onError: () => {
      toast.error("There was an error updating the vacation days.");
    },
  });

  function updateAmount(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!amount) {
      return toast.error("Please fill the amount of vacation days.");
    }

    if (!employee?.id) {
      return null;
    }

    updateAmountMutation.mutate({
      vacationDays: amount,
      employeeId: employee.id,
    });
  }

  function renderVacations() {
    if (!employee) {
      return null;
    }

    const [pastVacations, futureVacations, currentVacation] = checkVacations(
      employee.vacations
    );

    return (
      <div>
        {currentVacation && (
          <>
            {" "}
            <Heading size={"sm"} className="mb-3 mt-16 flex items-center">
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
            <Heading size={"xs"} className="mb-3 mt-12 flex items-center">
              <Palmtree size={42} className="ml-1 mr-2 text-rose-400" />{" "}
              Upcoming Vacations for {employee?.name}
            </Heading>
            {futureVacations?.map((vacation) => (
              <Vacation
                key={vacation.id}
                vacation={vacation}
                employee={employee}
              />
            ))}
          </>
        ) : (
          <>
            <Heading size={"xs"} className="mb-3 mt-12 flex items-center">
              <Palmtree size={42} className="ml-1 mr-2 text-rose-400" />{" "}
              Upcoming Vacations for {employee?.name}
            </Heading>
            <Paragraph className="mt-4">No upcoming vacations</Paragraph>
          </>
        )}

        {pastVacations && pastVacations.length > 0 ? (
          <>
            <Heading size={"xs"} className="mb-3 mt-12 flex items-center">
              <Palmtree size={42} className="ml-1 mr-2 text-gray-400" /> Past
              Vacations
            </Heading>

            {pastVacations?.map((vacation) => (
              <Vacation
                key={vacation.id}
                vacation={vacation}
                employee={employee}
              />
            ))}
          </>
        ) : (
          <>
            <Heading size={"xs"} className="mb-3 mt-12 flex items-center">
              <Palmtree size={42} className="ml-1 mr-2 text-gray-400" /> Past
              Vacations
            </Heading>
            <Paragraph className="mt-4">No past vacations</Paragraph>
          </>
        )}
      </div>
    );
  }

  if (!employee) {
    return <Sidebar />;
  }

  return (
    <main className="flex flex-col items-center">
      <Sidebar employee={employee} />

      <Heading className="mt-4">
        {employee?.name} - Vacation days remaining: {employee?.vacationDays}
      </Heading>

      <div className="mt-2 flex space-x-2">
        {" "}
        <Button
          size={"lg"}
          title="Create a new vacation"
          className="h-14 text-2xl"
          onClick={() => {
            setShowPlanner(true);
            setShowChangeAmount(false);
          }}
        >
          <Palmtree size={32} className="mr-2" />
          New Vacation
        </Button>
        <Button
          size={"lg"}
          variant={"subtle"}
          className="h-14 text-2xl"
          title="Change the amount of vacation days"
          onClick={() => {
            setShowPlanner(false);
            setShowChangeAmount(true);
          }}
        >
          <FileDigit size={32} className="mr-2" />
          Change remaining days
        </Button>
      </div>

      {showChangeAmount && (
        <form
          onSubmit={updateAmount}
          className="mt-16 flex flex-col items-center dark:border-slate-700"
        >
          <Heading size={"xs"}>Change the amount of vacation days</Heading>

          <Input
            type="text"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="m-0 h-14 text-center text-2xl shadow-md"
          />
          <div className="flex w-full space-x-1">
            <Button size={"lg"} className="mt-2 h-12 w-full text-xl">
              <Save className="mr-2" />
              Save
            </Button>
            <Button
              size={"lg"}
              type="button"
              variant={"subtle"}
              onClick={() => setShowChangeAmount(false)}
              className="mt-2 h-12 w-full text-xl"
            >
              {" "}
              <ArrowLeft className="mr-2" />
              Cancel
            </Button>
          </div>
        </form>
      )}
      {showPlanner && (
        <>
          {" "}
          <VacationPlanner
            employee={employee}
            setAmount={setAmount}
            daysPlanned={daysPlanned}
            daysRemaining={daysRemaining}
            setDaysPlanned={setDaysPlanned}
            setShowPlanner={setShowPlanner}
            setDaysRemaining={setDaysRemaining}
          />
        </>
      )}

      {!showChangeAmount && !showPlanner && employee?.vacations.length > 0
        ? renderVacations()
        : !showChangeAmount &&
          !showPlanner && (
            <Paragraph className=" mt-8 text-center" size={"lg"}>
              {employee?.name} has no planned vacations.
            </Paragraph>
          )}
    </main>
  );
}
