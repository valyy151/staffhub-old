import { useState } from "react";
import Heading from "../ui/Heading";
import ShiftComponent from "./Shift";
import { Button } from "../ui/Button";
import { Clock8, ScrollText } from "lucide-react";
import { Shift, WorkDay, WorkDayNote } from "@prisma/client";
import { formatDate, formatDay } from "~/utils/dateFormatting";

interface WorkDayProps {
  loading: boolean;
  setWorkDay: (data: WorkDay) => void;
  setLoading: (loading: boolean) => void;
  data: WorkDay & { shifts: Shift[]; notes: WorkDayNote[] };
}

export default function WorkDay({ data, setWorkDay }: WorkDayProps) {
  const [showAddNote, setShowAddNote] = useState<boolean>(false);
  const [showAddShift, setShowAddShift] = useState<boolean>(false);

  return (
    <>
      <div className="my-6 flex items-center justify-center space-x-10 border-b-2 border-slate-300 pb-6 dark:border-slate-700">
        <div className="flex space-x-3">
          <Heading size={"sm"}>{formatDay(data.date)}</Heading>
          <Heading size={"sm"}>{formatDate(data.date)}</Heading>
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

      {data?.shifts?.length < 1 && !showAddShift && !showAddNote && (
        <div className="border-b-2 border-slate-300 py-6 text-center font-normal dark:border-slate-700">
          <Heading className=" " size={"xs"}>
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
                shift={shift}
                index={index}
                data={data}
                setWorkDay={setWorkDay}
              />
            ))}
        </div>
      )}

      {/* {showAddShift && (
        <AddShift
          loading={loading}
          setLoading={setLoading}
          workDay={workDay}
          setError={setError}
          setMessage={setMessage}
          setShowAddShift={setShowAddShift}
        />
      )} */}
      <div className="flex flex-col items-center py-6">
        {data && !showAddShift && !showAddNote && (
          <Heading className=" mb-2 font-normal" size={"xs"}>
            Notes
          </Heading>
        )}
        {data && showAddNote && (
          <Heading className=" mb-2 font-normal" size={"xs"}>
            Add a note
          </Heading>
        )}
        {/* {workDay.notes.length > 0 &&
          !showAddNote &&
          !showAddShift &&
          workDay.notes.map((note, index) => (
            <Note
              note={note}
              index={index}
              workDay={workDay}
              loading={loading}
              setError={setError}
              setMessage={setMessage}
              setLoading={setLoading}
            />
          ))} */}

        {/* {!showAddNote && !showAddShift && workDay.notes.length < 1 && (
          <Paragraph size={"xl"} className="">
            There are no notes for this day.
          </Paragraph>
        )} */}

        {/* {showAddNote && !showAddShift && (
          <AddNote
            workDay={workDay}
            setError={setError}
            setMessage={setMessage}
            setLoading={setLoading}
            showAddNote={showAddNote}
            setShowAddNote={setShowAddNote}
            setShowAddShift={setShowAddShift}
          />
        )} */}
      </div>
    </>
  );
}
