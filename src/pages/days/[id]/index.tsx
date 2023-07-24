import { api } from "~/utils/api";
import { useEffect, useState } from "react";
import { WorkDayNote } from "@prisma/client";
import Note from "~/components/WorkDay/Note";
import Spinner from "~/components/ui/Spinner";
import Heading from "~/components/ui/Heading";
import { Button } from "~/components/ui/Button";
import { Clock8, ScrollText } from "lucide-react";
import Paragraph from "~/components/ui/Paragraph";
import AddNote from "~/components/WorkDay/AddNote";
import AddShift from "~/components/WorkDay/AddShift";
import ShiftComponent from "~/components/WorkDay/Shift";
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

  const { data, isLoading } = api.workDay.findOne.useQuery({
    id: query.id,
  });

  const [workDay, setWorkDay] = useState(data);

  useEffect(() => {
    setWorkDay(data);
  }, [data]);

  if (isLoading) {
    return <Spinner className="flex flex-col items-center" />;
  }

  if (!workDay || !workDay.date) {
    return null;
  }

  return (
    <main className="flex flex-col items-center">
      <div className="flex w-full flex-col">
        <div className="my-6 flex flex-col items-center border-b-2 border-slate-300 pb-6 dark:border-slate-700">
          <div className="flex space-x-3">
            <Heading>{formatDay(workDay.date)}</Heading>
            <Heading>{formatDateLong(workDay.date)}</Heading>
          </div>
          <div className="mt-2 space-x-1">
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
        </div>
        <div className="flex w-full justify-evenly">
          {showAddShift && (
            <AddShift data={workDay} setShowAddShift={setShowAddShift} />
          )}
          {showAddNote && !showAddShift && (
            <AddNote data={workDay} setShowAddNote={setShowAddNote} />
          )}
          <div className="flex flex-col">
            <div className="mb-2 flex flex-col">
              {!showAddShift && !showAddNote && (
                <Heading className="mb-2">Notes</Heading>
              )}
              {workDay.notes?.length > 0 &&
                !showAddNote &&
                !showAddShift &&
                workDay.notes.map((note: WorkDayNote) => (
                  <Note key={note.id} note={note} />
                ))}
              {!showAddNote && !showAddShift && workDay.notes?.length < 1 && (
                <Paragraph>
                  There are currently no notes for this day.
                </Paragraph>
              )}
            </div>
          </div>
          <div className="flex flex-col">
            {!showAddShift && !showAddNote && (
              <Heading className="mb-2">Shifts</Heading>
            )}
            {workDay.shifts?.length === 0 && !showAddShift && !showAddNote && (
              <div className="pb-6 font-normal">
                <Paragraph>
                  There are currently no shifts for this day.
                </Paragraph>
              </div>
            )}
            {!showAddShift && !showAddNote && (
              <div className="mt-3">
                {workDay.shifts?.map((shift) => (
                  <ShiftComponent key={shift.id} shift={shift} data={workDay} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
