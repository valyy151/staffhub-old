import router from "next/router";
import { api } from "~/utils/api";
import { useEffect, useState } from "react";
import Note from "~/components/WorkDay/Note";
import Spinner from "~/components/ui/Spinner";
import Heading from "~/components/ui/Heading";
import Shift from "~/components/WorkDay/Shift";
import { Button } from "@/components/ui/button";
import { Clock8, ScrollText } from "lucide-react";
import AddNote from "~/components/WorkDay/AddNote";
import AddShift from "~/components/WorkDay/AddShift";
import { formatDateLong, formatDay } from "~/utils/dateFormatting";

type WorkDayPageProps = {
  query: { id: string };
};

WorkDayPage.getInitialProps = ({ query }: WorkDayPageProps) => {
  return { query };
};

export default function WorkDayPage({ query }: WorkDayPageProps) {
  const [showAddNote, setShowAddNote] = useState(false);
  const [showAddShift, setShowAddShift] = useState(false);

  const { data, failureReason } = api.workDay.findOne.useQuery({
    id: query.id,
  });

  if (failureReason?.data?.httpStatus === 401) {
    router.push("/");
  }

  const [workDay, setWorkDay] = useState(data);

  useEffect(() => {
    setWorkDay(data);
  }, [data]);

  if (!data) {
    return <Spinner />;
  }

  if (!workDay || !workDay.date) {
    return null;
  }

  function renderShifts() {
    if (showAddShift) {
      return null;
    }

    if (!workDay?.shifts || workDay?.shifts.length === 0) {
      return (
        <div>
          <Heading size={"xs"} className="font-normal">
            No shifts for this day.
          </Heading>
        </div>
      );
    }

    return (
      <div className="pb-8">
        {workDay?.shifts
          .sort((a, b) => (a.start > b.start ? 1 : -1))
          .map((shift, index) => (
            <Shift
              key={shift.id}
              shift={shift}
              index={index}
              date={workDay.date}
              shiftModels={workDay.shiftModels}
            />
          ))}
      </div>
    );
  }

  function renderNotes() {
    if (showAddNote) {
      return null;
    }

    if (!workDay?.notes || workDay?.notes.length === 0) {
      return (
        <div>
          <Heading size={"xs"} className="font-normal">
            No notes for this day.
          </Heading>
        </div>
      );
    }

    return (
      <div>
        {workDay?.notes.map((note) => (
          <Note key={note.id} note={note} />
        ))}
      </div>
    );
  }

  function checkRoles() {
    const roles: JSX.Element[] = [];

    workDay?.roles.forEach((role) => {
      const minRequired = role.numberPerDay;

      const shifts = workDay?.shifts.filter(
        (shift) => shift.roleId === role.id
      );

      const employees = shifts?.map((shift) => shift.employeeId);
      const uniqueEmployees = [...new Set(employees)];

      return roles.push(
        <div>
          <Heading
            size={"xxs"}
            className={`font-medium ${
              uniqueEmployees.length < minRequired!!
                ? "text-red-500"
                : "text-green-500"
            }`}
          >
            {uniqueEmployees.length} / {minRequired} {role.name}s
          </Heading>
        </div>
      );
    });

    if (roles.length === 0) {
      return;
    }

    return roles;
  }

  return (
    <main className="flex">
      <div className="mt-4 w-full">
        <div className="flex items-center space-x-8 border-b border-slate-300 pb-4 pl-8 dark:border-slate-500">
          <Heading size={"sm"}>
            {formatDay(workDay.date)} {formatDateLong(workDay.date)}
          </Heading>

          <div className="space-x-1">
            <Button
              size="lg"
              onClick={() => {
                setShowAddShift(true);
                setShowAddNote(false);
              }}
            >
              <Clock8 className="mr-2" /> New Shift
            </Button>

            <Button
              size="lg"
              variant="subtle"
              onClick={() => {
                setShowAddNote(true);
                setShowAddShift(false);
              }}
            >
              <ScrollText className="mr-2" /> Add Note
            </Button>
          </div>
          {checkRoles()}
        </div>

        <div className="flex w-full">
          <div className="border-r border-slate-300 px-4 pt-4 dark:border-slate-500">
            {!showAddShift && (
              <>
                <Heading size={"xs"} className="mb-2 font-medium">
                  Shifts
                </Heading>

                {renderShifts()}
              </>
            )}
            {showAddShift && (
              <AddShift data={workDay} setShowAddShift={setShowAddShift} />
            )}
          </div>

          <div className="px-4 pt-4">
            {!showAddNote && (
              <>
                <Heading size={"xs"} className="mb-4 pl-1 font-medium">
                  Notes
                </Heading>
                {renderNotes()}
              </>
            )}
            {showAddNote && (
              <AddNote data={workDay} setShowAddNote={setShowAddNote} />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
