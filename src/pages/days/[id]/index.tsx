import router from "next/router";
import { api } from "~/utils/api";
import { useEffect, useState } from "react";
import Note from "~/components/WorkDay/Note";
import Spinner from "~/components/ui/Spinner";
import Heading from "~/components/ui/Heading";
import Shift from "~/components/WorkDay/Shift";
import { Button } from "~/components/ui/Button";
import { Clock8, ScrollText } from "lucide-react";
import Sidebar from "~/components/WorkDay/Sidebar";
import AddNote from "~/components/WorkDay/AddNote";
import AddShift from "~/components/WorkDay/AddShift";
import { formatDateLong, formatDay } from "~/utils/dateFormatting";

interface WorkDayPageProps {
  query: { id: string };
}

WorkDayPage.getInitialProps = ({ query }: WorkDayPageProps) => {
  return { query };
};

export default function WorkDayPage({ query }: WorkDayPageProps) {
  const [showAddNote, setShowAddNote] = useState(false);
  const [showAddShift, setShowAddShift] = useState(false);

  const [showNotes, setShowNotes] = useState(false);
  const [showShifts, setShowShifts] = useState(false);

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
    if (showAddShift || showAddNote) {
      return null;
    }

    if (!workDay?.shifts || workDay?.shifts.length === 0) {
      return (
        <div className="mt-8">
          <Heading size={"xs"}>No shifts for this day.</Heading>
        </div>
      );
    }

    const hasRoles = checkRoles();

    return (
      <div className="mt-8">
        {workDay?.shifts
          .sort((a, b) => (a.start > b.start ? 1 : -1))
          .map((shift, index) => (
            <Shift
              key={shift.id}
              shift={shift}
              index={index}
              date={workDay.date}
            />
          ))}
        {hasRoles && (
          <div className="mt-8 border-t border-slate-300 dark:border-slate-500">
            <Heading size={"sm"} className="my-2">
              For this day you have:
            </Heading>
            {checkRoles()}
          </div>
        )}
      </div>
    );
  }

  function renderNotes() {
    if (showAddNote || showAddShift) {
      return null;
    }

    if (!workDay?.notes || workDay?.notes.length === 0) {
      return (
        <div className="mt-8">
          <Heading size={"xs"}>No notes for this day.</Heading>
        </div>
      );
    }

    return (
      <div className="mt-8">
        {workDay?.notes.map((note) => (
          <Note key={note.id} note={note} />
        ))}
      </div>
    );
  }

  function checkRoles() {
    const roles: JSX.Element[] = [];
    workDay?.roles.forEach((role, index) => {
      const minRequired = role.numberPerDay;

      const shifts = workDay?.shifts.filter(
        (shift) => shift.roleId === role.name
      );

      const employees = shifts?.map((shift) => shift.employeeId);
      const uniqueEmployees = [...new Set(employees)];

      return roles.push(
        <div className={`${index !== 0 && "mt-4"}`}>
          <Heading size={"xs"} className="font-normal">
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
      <Sidebar
        showNotes={showNotes}
        showShifts={showShifts}
        setShowNotes={setShowNotes}
        setShowShifts={setShowShifts}
        setShowAddNote={setShowAddNote}
        setShowAddShift={setShowAddShift}
      />
      <div className="mt-4">
        <div className="flex items-center space-x-8">
          <Heading size={"lg"}>
            {formatDay(workDay.date)} {formatDateLong(workDay.date)}
          </Heading>

          <div className="space-x-1">
            <Button
              size="lg"
              className="h-14 text-xl"
              onClick={() => {
                setShowAddShift(true);
                setShowAddNote(false);
                setShowShifts(true);
                setShowNotes(false);
              }}
            >
              <Clock8 className="mr-2" /> New Shift
            </Button>

            <Button
              size="lg"
              variant="subtle"
              className="h-14 text-xl"
              onClick={() => {
                setShowAddNote(true);
                setShowAddShift(false);
                setShowShifts(false);
                setShowNotes(true);
              }}
            >
              <ScrollText className="mr-2" /> Add Note
            </Button>
          </div>
        </div>

        {!showNotes && !showShifts && (
          <div className="mt-8">
            <Heading
              onClick={() => setShowShifts(true)}
              className="mb-1 w-fit cursor-pointer hover:text-sky-500"
            >
              Shifts
            </Heading>

            <Heading size={"sm"} className="font-normal">
              There are {workDay?.shifts.length} shifts for this day.
            </Heading>

            {checkRoles() && (
              <>
                <Heading className="mt-4">Roles filled:</Heading>
                {checkRoles()}
              </>
            )}

            <Heading
              onClick={() => setShowNotes(true)}
              className="mt-8 w-fit cursor-pointer hover:text-sky-500"
            >
              Notes
            </Heading>
            <Heading size={"sm"} className="font-normal">
              There {workDay?.notes.length === 1 ? "is" : "are"}{" "}
              {workDay?.notes.length}{" "}
              {workDay?.notes.length === 1 ? "note" : "notes"} for this day.
            </Heading>
          </div>
        )}

        {showAddShift && (
          <AddShift data={workDay} setShowAddShift={setShowAddShift} />
        )}
        {showAddNote && (
          <AddNote data={workDay} setShowAddNote={setShowAddNote} />
        )}

        {showNotes && renderNotes()}
        {showShifts && renderShifts()}
      </div>
    </main>
  );
}
