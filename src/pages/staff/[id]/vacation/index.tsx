import { api } from "~/utils/api";
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";
import Heading from "~/components/ui/Heading";
import Paragraph from "~/components/ui/Paragraph";
import { howManyDays } from "~/utils/calculateHours";
import Sidebar from "~/components/Staff/Sidebar";
import { useQueryClient } from "@tanstack/react-query";
import Vacation from "~/components/Staff/Vacation";
import { checkVacations } from "~/utils/checkVacations";
import AddVacation from "~/components/Staff/AddVacation";
import { ArrowLeft, FileDigit, Palmtree, Save } from "lucide-react";
import router from "next/router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type VacationPageProps = {
  query: { id: string };
};

VacationPage.getInitialProps = ({ query }: VacationPageProps) => {
  return { query };
};

export default function VacationPage({ query }: VacationPageProps) {
  const [amount, setAmount] = useState<number>(0);
  const [showPlanner, setShowPlanner] = useState<boolean>(false);
  const [, setDaysRemaining] = useState<number | undefined>(0);
  const [showChangeAmount, setShowChangeAmount] = useState<boolean>(false);

  const { data: employee, failureReason } = api.employee.findOne.useQuery({
    id: query.id,
  });

  if (failureReason?.data?.httpStatus === 401) {
    router.push("/");
  }

  useEffect(() => {
    setAmount(employee?.vacationDays || 0);
    setDaysRemaining(employee?.vacationDays);
  }, [employee?.vacationDays]);

  const { toast } = useToast();

  const queryClient = useQueryClient();

  const updateAmountMutation = api.vacation.updateAmountOfDays.useMutation({
    onSuccess: () => {
      setShowChangeAmount(false);
      void queryClient.invalidateQueries();
      toast({ title: "Vacation days updated successfully." });
    },
    onError: () => {
      toast({
        title: "There was a problem updating the vacation days.",
        variant: "destructive",
      });
    },
  });

  function updateAmount(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!amount) {
      return toast({ title: "Please enter a number." });
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
      employee.vacations!!
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
            <Heading size={"xs"} className="mb-3 mt-12 flex items-center">
              <Palmtree size={42} className="ml-1 mr-2 text-rose-400" />{" "}
              Upcoming Vacations
            </Heading>
            <Paragraph className="ml-14 mt-4">No upcoming vacations</Paragraph>
          </>
        )}

        {pastVacations && pastVacations.length > 0 ? (
          <>
            <Heading size={"xs"} className="mb-3 mt-12 flex items-center">
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
            <Heading size={"xs"} className="mb-3 mt-12 flex items-center">
              <Palmtree size={42} className="ml-1 mr-2 text-gray-400" /> Past
              Vacations
            </Heading>
            <Paragraph className="ml-14 mt-4">No past vacations</Paragraph>
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
            size={"lg"}
            title="Create a new vacation"
            className="text-xl"
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
            className="text-xl"
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
            className="mt-8 flex flex-col dark:border-slate-700"
          >
            <Heading size={"xs"}>Change the amount of vacation days</Heading>

            <Input
              type="text"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="m-0 h-14 w-fit text-center text-2xl shadow-md"
            />
            <div className="flex w-full space-x-1">
              <Button size={"lg"} className="mt-2 text-xl ">
                <Save size={28} className="mr-2" />
                Save
              </Button>
              <Button
                size={"lg"}
                type="button"
                variant={"subtle"}
                onClick={() => setShowChangeAmount(false)}
                className="mt-2 text-xl "
              >
                {" "}
                <ArrowLeft size={28} className="mr-2" />
                Cancel
              </Button>
            </div>
          </form>
        )}
        {showPlanner && (
          <AddVacation
            employee={employee}
            setAmount={setAmount}
            setShowPlanner={setShowPlanner}
          />
        )}

        {!showChangeAmount && !showPlanner && renderVacations()}
      </div>
    </main>
  );
}
