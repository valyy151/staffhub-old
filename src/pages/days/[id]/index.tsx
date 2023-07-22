import { Shift, WorkDay, WorkDayNote } from "@prisma/client";
import { Clock8, ScrollText } from "lucide-react";
import { useEffect, useState } from "react";
import AddNote from "~/components/WorkDay/AddNote";
import AddShift from "~/components/WorkDay/AddShift";
import Note from "~/components/WorkDay/Note";
import { Button } from "~/components/ui/Button";
import Heading from "~/components/ui/Heading";
import Spinner from "~/components/ui/Spinner";
import { RouterOutputs, api } from "~/utils/api";
import { formatDate, formatDay } from "~/utils/dateFormatting";
import ShiftComponent from "~/components/WorkDay/Shift";

interface WorkDayPageProps {
  query: { id: string };
}

WorkDayPage.getInitialProps = ({ query }: WorkDayPageProps) => {
  return { query };
};

export default function WorkDayPage({ query }: WorkDayPageProps) {
  const [loading, setLoading] = useState<boolean>(true);
  const [showAddNote, setShowAddNote] = useState<boolean>(false);
  const [showAddShift, setShowAddShift] = useState<boolean>(false);

  const [workDay, setWorkDay] = useState<
    WorkDay & { shifts: Shift[]; notes: WorkDayNote[] }
  >();

  const { data }: any = api.workDay.findOne.useQuery({
    id: query.id,
  });

  useEffect(() => {
    if (data) {
      setWorkDay(data);
      setLoading(false);
    }
  }, [data]);

  return (
    <main className="flex flex-col items-center">
      {loading ? (
        <Spinner />
      ) : (
        workDay && (
          <>
            <div className="my-6 flex items-center justify-center space-x-10 border-b-2 border-slate-300 pb-6 dark:border-slate-700">
              <div className="flex space-x-3">
                <Heading>{formatDay(workDay?.date)}</Heading>
                <Heading>{formatDate(workDay?.date)}</Heading>
              </div>
              <div className="space-x-2">
                <Button
                  onClick={() => {
                    setShowAddShift(true);
                    setShowAddNote(false);
                  }}
                >
                  New Shift {<Clock8 className="ml-2 h-5 w-5" />}
                </Button>
                <Button
                  variant={"subtle"}
                  onClick={() => {
                    setShowAddNote(true);
                    setShowAddShift(false);
                  }}
                >
                  Add Note {<ScrollText className="ml-2 h-5 w-5" />}
                </Button>
              </div>
            </div>

            {!showAddShift && !showAddNote && (
              <Heading className=" mb-2 text-center">Shifts</Heading>
            )}
            {workDay?.shifts?.length < 1 && !showAddShift && !showAddNote && (
              <div className="border-b-2 border-slate-300 pb-6 text-center font-normal dark:border-slate-700">
                <Heading size={"sm"} className="font-normal">
                  {" "}
                  There are currently no shifts for this day.{" "}
                </Heading>
              </div>
            )}

            {workDay?.shifts?.length > 0 && (
              <div className="flex flex-col items-center border-b-2 border-slate-300 dark:border-slate-700">
                {workDay?.shifts
                  ?.sort((a, b) => a.start - b.start)
                  .map((shift: any, index: number) => (
                    <ShiftComponent
                      data={workDay}
                      shift={shift}
                      index={index}
                      setWorkDay={setWorkDay}
                    />
                  ))}
              </div>
            )}

            {showAddShift && (
              <AddShift data={workDay} setShowAddShift={setShowAddShift} />
            )}

            <div className="flex flex-col items-center py-6">
              {data && !showAddShift && !showAddNote && (
                <Heading className=" mb-2">Notes</Heading>
              )}

              {workDay?.notes?.length > 0 &&
                !showAddNote &&
                !showAddShift &&
                workDay.notes.map((note) => <Note note={note} />)}

              {!showAddNote && !showAddShift && workDay.notes?.length < 1 && (
                <Heading size={"sm"} className="font-normal">
                  There are currently no notes for this day.
                </Heading>
              )}

              {showAddNote && !showAddShift && (
                <AddNote
                  data={workDay}
                  showAddNote={showAddNote}
                  setShowAddNote={setShowAddNote}
                  setShowAddShift={setShowAddShift}
                />
              )}
            </div>
          </>
        )
      )}
    </main>
  );
}
