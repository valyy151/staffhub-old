import { useState } from "react";
import Heading from "../ui/Heading";
import ShiftComponent from "./Shift";
import { Button } from "../ui/Button";
import { Clock8, ScrollText } from "lucide-react";
import { Shift, WorkDay, WorkDayNote } from "@prisma/client";
import { formatDate, formatDay } from "~/utils/dateFormatting";
import AddShift from "./AddShift";
import AddNote from "./AddNote";
import Note from "./Note";

interface WorkDayProps {
  setWorkDay: (data: WorkDay) => void;
  data: WorkDay & { shifts: Shift[]; notes: WorkDayNote[] };
}

export default function WorkDay({ data, setWorkDay }: WorkDayProps) {
  const [showAddNote, setShowAddNote] = useState<boolean>(false);
  const [showAddShift, setShowAddShift] = useState<boolean>(false);

  return (
    <>
      <div className="my-6 flex items-center justify-center space-x-10 border-b-2 border-slate-300 pb-6 dark:border-slate-700">
        <div className="flex space-x-3">
          <Heading>{formatDay(data.date)}</Heading>
          <Heading>{formatDate(data.date)}</Heading>
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

      {!showAddShift && <Heading className=" mb-2 text-center">Shifts</Heading>}
      {data?.shifts?.length < 1 && !showAddShift && !showAddNote && (
        <div className="border-b-2 border-slate-300 pb-6 text-center font-normal dark:border-slate-700">
          <Heading size={"sm"} className="font-normal">
            {" "}
            There are currently no shifts for this day.{" "}
          </Heading>
        </div>
      )}

      {data?.shifts?.length > 0 && (
        <div className="flex flex-col items-center border-b-2 border-slate-300 dark:border-slate-700">
          {data?.shifts
            ?.sort((a, b) => a.start - b.start)
            .map((shift: any, index: number) => (
              <ShiftComponent
                data={data}
                shift={shift}
                index={index}
                setWorkDay={setWorkDay}
              />
            ))}
        </div>
      )}

      {showAddShift && (
        <AddShift data={data} setShowAddShift={setShowAddShift} />
      )}

      <div className="flex flex-col items-center py-6">
        {data && !showAddShift && !showAddNote && (
          <Heading className=" mb-2">Notes</Heading>
        )}

        {data && showAddNote && <Heading className=" mb-2">Add a note</Heading>}

        {data?.notes?.length > 0 &&
          !showAddNote &&
          !showAddShift &&
          data.notes.map((note) => <Note note={note} />)}

        {!showAddNote && !showAddShift && data.notes?.length < 1 && (
          <Heading size={"sm"} className="font-normal">
            There are currently no notes for this day.
          </Heading>
        )}

        {showAddNote && !showAddShift && (
          <AddNote
            data={data}
            showAddNote={showAddNote}
            setShowAddNote={setShowAddNote}
            setShowAddShift={setShowAddShift}
          />
        )}
      </div>
    </>
  );
}
