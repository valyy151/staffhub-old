import { api } from "~/utils/api";
import { useEffect, useState } from "react";
import Note from "~/components/WorkDay/Note";
import Spinner from "~/components/ui/Spinner";
import Heading from "~/components/ui/Heading";
import Shift from "~/components/WorkDay/Shift";
import { Button } from "~/components/ui/Button";
import { Clock8, ScrollText } from "lucide-react";
import AddNote from "~/components/WorkDay/AddNote";
import AddShift from "~/components/WorkDay/AddShift";
import { formatDateLong, formatDay } from "~/utils/dateFormatting";
import Sidebar from "~/components/WorkDay/Sidebar";
import { getSession } from "next-auth/react";
import { type GetServerSideProps } from "next/types";
import router from "next/router";

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
      </div>
    );
  }

  function renderNotes() {
    if (showAddNote || showAddShift) {
      return null;
    }

    return (
      <div className="mt-8">
        {workDay?.notes.map((note) => (
          <Note key={note.id} note={note} />
        ))}
      </div>
    );
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
            <Heading>Shifts</Heading>
            <Heading size={"sm"} className="font-normal">
              There {workDay?.shifts.length === 1 ? "is" : "are"}{" "}
              {workDay?.shifts.length}{" "}
              {workDay?.shifts.length === 1 ? "shift" : "shifts"} planned for
              this day.
            </Heading>
            <Heading className="mt-8">Notes</Heading>
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
