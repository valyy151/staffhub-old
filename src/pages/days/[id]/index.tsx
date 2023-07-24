import { api } from "~/utils/api";
import { useEffect, useState } from "react";
import { WorkDayNote } from "@prisma/client";
import Note from "~/components/WorkDay/Note";
import Spinner from "~/components/ui/Spinner";
import Heading from "~/components/ui/Heading";
import Shift from "~/components/WorkDay/Shift";
import { Button } from "~/components/ui/Button";
import { Clock8, ScrollText } from "lucide-react";
import Paragraph from "~/components/ui/Paragraph";
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

  const { data, isLoading } = api.workDay.findOne.useQuery({ id: query.id });

  const [workDay, setWorkDay] = useState(data);

  useEffect(() => {
    setWorkDay(data);
  }, [data]);

  if (isLoading) {
    return <Spinner />;
  }

  if (!workDay || !workDay.date) {
    return null;
  }

  const renderNotes = () => {
    if (showAddNote || showAddShift) return null;

    if (workDay.notes.length === 0) {
      return <Paragraph>There are currently no notes for this day.</Paragraph>;
    }

    return (
      <div className="mb-2 flex w-1/2 flex-col">
        <Heading className="mb-2">Notes</Heading>

        {workDay.notes.map((note) => (
          <Note key={note.id} note={note} />
        ))}
      </div>
    );
  };

  const renderShifts = () => {
    if (showAddShift || showAddNote) return null;

    if (workDay.shifts.length === 0) {
      return <Paragraph>There are currently no shifts for this day.</Paragraph>;
    }

    return (
      <div className="mb-2 flex w-1/2 flex-col">
        <Heading className="mb-2">Notes</Heading>

        {workDay.shifts.map((shift) => (
          <Shift key={shift.id} shift={shift} date={workDay.date} />
        ))}
      </div>
    );
  };

  return (
    <main className="flex w-full flex-col items-center">
      <div className="my-6 flex w-full flex-col items-center border-b-2 border-slate-300 pb-6 dark:border-slate-700">
        <div className="flex space-x-3">
          <Heading>{formatDay(workDay.date)}</Heading>
          <Heading>{formatDateLong(workDay.date)}</Heading>
        </div>

        <div className="mt-2 space-x-1">
          <Button
            size="lg"
            className="h-14 text-xl"
            onClick={() => {
              setShowAddNote(false);
              setShowAddShift(true);
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
            }}
          >
            <ScrollText className="mr-2" /> Add Note
          </Button>
        </div>
      </div>

      <div className="flex w-full">
        {showAddShift && (
          <AddShift data={workDay} setShowAddShift={setShowAddShift} />
        )}
        {showAddNote && (
          <AddNote data={workDay} setShowAddNote={setShowAddNote} />
        )}

        {renderNotes()}

        {renderShifts()}
      </div>
    </main>
  );
}
