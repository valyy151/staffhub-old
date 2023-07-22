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
import Paragraph from "~/components/ui/Paragraph";

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
          <div className="flex w-full flex-col">
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
            <div className="flex w-full justify-evenly">
              <div className="flex flex-col">
                {!showAddShift && !showAddNote && (
                  <Heading className="mb-2">Shifts</Heading>
                )}
                {workDay?.shifts?.length < 1 &&
                  !showAddShift &&
                  !showAddNote && (
                    <div className="pb-6 font-normal">
                      <Paragraph>
                        {" "}
                        There are currently no shifts for this day.{" "}
                      </Paragraph>
                    </div>
                  )}

                {workDay?.shifts?.length > 0 && (
                  <div className="flex flex-col items-center">
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
              </div>
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

                  {workDay?.notes?.length > 0 &&
                    !showAddNote &&
                    !showAddShift &&
                    workDay.notes.map((note) => <Note note={note} />)}

                  {!showAddNote &&
                    !showAddShift &&
                    workDay.notes?.length < 1 && (
                      <Paragraph>
                        There are currently no notes for this day.
                      </Paragraph>
                    )}
                </div>
              </div>
            </div>
          </div>
        )
      )}
    </main>
  );
}
