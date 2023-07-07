import { Dispatch, SetStateAction, useState } from "react";
import { formatDate, formatDay } from "~/utils/dateFormatting";
import Heading from "../ui/Heading";
import { Button } from "../ui/Button";
import { Clock8, ScrollText } from "lucide-react";

interface WorkDayProps {
  loading: boolean;
  setLoading: (loading: boolean) => void;
  data: { id: string; date: number; shifts: [] };
  setWorkDay: (data: { id: string; date: number; shifts: [] }) => void;
}

export default function WorkDay({
  data,
  loading,
  setWorkDay,
  setLoading,
}: WorkDayProps) {
  const [showAddNote, setShowAddNote] = useState<boolean>(false);
  const [showAddShift, setShowAddShift] = useState<boolean>(false);

  return (
    <>
      <div className="my-6 flex w-10/12 items-center justify-center space-x-10 border-b-2 border-slate-300 pb-6 dark:border-slate-700">
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
            size={"sm"}
            variant={"outline"}
            onClick={() => {
              setShowAddNote(true);
              setShowAddShift(false);
            }}
          >
            Add Note {<ScrollText className="ml-2 h-5 w-5" />}
          </Button>
        </div>
      </div>

      {data.shifts.length < 1 && !showAddShift && !showAddNote && (
        <div className="w-10/12 border-b-2 border-slate-300 py-6 text-center font-normal dark:border-slate-700">
          <Heading className="slide-in-bottom " size={"xs"}>
            {" "}
            There are currently no shifts for this day.{" "}
          </Heading>
        </div>
      )}

      {data.shifts.length > 0 && (
        <div className="flex w-10/12 flex-col items-center space-y-2 border-b-2 border-slate-300 pb-6 dark:border-slate-700">
          {/* {workDay?.shifts
            ?.sort((a, b) => a.start - b.start)
            .map((shift, index) => (
              <Employee
                shift={shift}
                index={index}
                loading={loading}
                workDay={workDay}
                setError={setError}
                setMessage={setMessage}
                setWorkDay={setWorkDay}
                setLoading={setLoading}
              />
            ))} */}
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
          <Heading className="slide-in-bottom mb-2 font-normal" size={"xs"}>
            Notes
          </Heading>
        )}
        {data && showAddNote && (
          <Heading className="slide-in-bottom mb-2 font-normal" size={"xs"}>
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
          <Paragraph size={"xl"} className="slide-in-bottom">
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
