import { Dispatch, FC, SetStateAction, useState } from "react";
import { Check, FileDigit, MoreVertical, Palmtree, X } from "lucide-react";
import Heading from "~/components/ui/Heading";
import { Button } from "~/components/ui/Button";
import Input from "~/components/ui/Input";
import { api } from "~/utils/api";
import Dropdown from "~/components/Employees/Dropdown";
import VacationPlanner from "~/components/Employees/Vacation/VacationPlanner";
import { Vacation } from "@prisma/client";
import VacationComponent from "~/components/Employees/Vacation/Vacation";

interface VacationPageProps {
  query: { id: string };
}

VacationPage.getInitialProps = ({ query }: VacationPageProps) => {
  return { query };
};

export default function VacationPage({ query }: VacationPageProps) {
  const { data: employee }: any = api.employee?.findOne.useQuery({
    id: query.id,
  });

  const [showModal, setShowModal] = useState<boolean>(false);
  const [daysPlanned, setDaysPlanned] = useState<number>(0);
  const [showPlanner, setShowPlanner] = useState<boolean>(false);
  const [amount, setAmount] = useState<number>(employee?.vacationDays);
  const [showChangeAmount, setShowChangeAmount] = useState<boolean>(false);
  const [daysRemaining, setDaysRemaining] = useState(employee?.vacationDays);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);

  const updateAmount = async (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <main className="pt-20">
      <div className="relative ml-auto flex">
        <Button
          className="ml-auto min-w-0 rounded-full hover:bg-slate-50 dark:hover:bg-slate-600"
          variant={"link"}
          onClick={() => setShowDropdown(!showDropdown)}
        >
          <MoreVertical size={24} />
        </Button>
        {showDropdown && (
          <Dropdown
            employee={employee}
            setShowModal={setShowModal}
            setShowDropdown={setShowDropdown}
          />
        )}
      </div>
      <div className="flex w-full items-center justify-center space-x-8 border-b-2 border-slate-300 pb-4 dark:border-slate-600">
        <Heading size={"sm"}>
          {employee?.name} - Vacation days remaining: {employee?.vacationDays}
        </Heading>

        <div className="space-x-2">
          {showPlanner ? (
            <Button
              size={"sm"}
              variant={"outline"}
              className="w-36"
              onClick={() => {
                setShowPlanner(false);
                setDaysRemaining(employee?.vacationDays);
              }}
            >
              Cancel <X className="ml-2" />
            </Button>
          ) : (
            <Button
              className="w-36"
              size={"sm"}
              title="Create a new vacation"
              onClick={() => {
                setShowPlanner(true);
                setShowChangeAmount(false);
              }}
            >
              New Vacation <Palmtree className="ml-2" />
            </Button>
          )}
          {showChangeAmount ? (
            <Button
              className="w-56"
              size={"sm"}
              variant={"outline"}
              onClick={() => setShowChangeAmount(false)}
            >
              Cancel
              <X className="ml-2" />
            </Button>
          ) : (
            <Button
              className="w-56"
              size={"sm"}
              variant={"outline"}
              title="Change the amount of vacation days"
              onClick={() => {
                setShowChangeAmount(true);
                setShowPlanner(false);
              }}
            >
              Change number of days
              <FileDigit className="ml-2" />
            </Button>
          )}
        </div>
      </div>

      {showChangeAmount && (
        <>
          <Heading size={"xs"} className=" mb-3 mt-32">
            Change the amount of vacation days
          </Heading>
          <form
            onSubmit={updateAmount}
            className=" flex w-full items-center justify-center pb-3 dark:border-slate-700"
          >
            <Input
              type="text"
              value={amount}
              className=" m-0 w-[36rem] text-center text-2xl font-bold shadow-md "
              onChange={(e) => setAmount(Number(e.target.value))}
            />
            <Button size={"sm"} variant={"link"} className=" w-20 min-w-0 ">
              <Check size={36} />
            </Button>
          </form>
        </>
      )}
      {showPlanner && (
        <>
          {" "}
          <Heading size={"xs"} className=" mt-12 text-center font-normal">
            Days planned: {daysPlanned > 0 ? daysPlanned : 0}
          </Heading>
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

      {!showChangeAmount && !showPlanner && employee?.vacations.length > 0 ? (
        <div className="">
          <Heading size={"xs"} className="mb-3 mt-32 text-center">
            Vacations
          </Heading>
          {employee?.vacations.map((vacation: Vacation) => (
            <VacationComponent
              key={vacation.id}
              vacation={vacation}
              employee={employee}
              setAmount={setAmount}
            />
          ))}
        </div>
      ) : (
        !showChangeAmount &&
        !showPlanner && (
          <Heading className=" mt-16 text-center" size={"xs"}>
            This employee has no planned vacations.
          </Heading>
        )
      )}
    </main>
  );
}
