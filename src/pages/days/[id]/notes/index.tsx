import { ClipboardList, Clock, UserCog } from "lucide-react";
import Link from "next/link";
import router from "next/router";
import { useEffect, useState } from "react";
import { api } from "~/utils/api";
import { formatDateLong, formatDay } from "~/utils/dateFormatting";

import AddNote from "@/components/AddNote";
import Note from "@/components/Note";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/ui/spinner";

type WorkDayPageProps = {
  query: { id: string };
};

WorkDayPage.getInitialProps = ({ query }: WorkDayPageProps) => {
  return { query };
};

export default function WorkDayPage({ query }: WorkDayPageProps) {
  const [showAddNote, setShowAddNote] = useState(false);

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

  return (
    <div className="flex">
      <aside className="sticky top-0 h-screen w-56 border-r p-4">
        <nav className="space-y-2">
          <Link
            href={`/days/${workDay.id}/shifts`}
            className="flex w-full items-center space-x-2 rounded-lg px-2 py-2 hover:bg-accent"
          >
            <Clock />
            <span className="text-sm font-medium">
              Shifts {workDay.shifts.length > 0 && `(${workDay.shifts.length})`}
            </span>
          </Link>
          <button className="flex w-full items-center space-x-2 rounded-lg bg-accent px-2 py-2">
            <ClipboardList />
            <span className="text-sm font-medium">
              Notes{workDay.notes.length > 0 && ` (${workDay.notes.length})`}
            </span>
          </button>
          <Link
            href={`/days/${workDay.id}/roles`}
            className="flex w-full items-center space-x-2 rounded-lg px-2 py-2 hover:bg-accent"
          >
            <UserCog />
            <span className="text-sm font-medium">Roles</span>
          </Link>
        </nav>
      </aside>
      <main className="flex-grow p-6">
        <h1 className="pb-1 text-xl font-semibold">
          {formatDay(workDay.date)}, {formatDateLong(workDay.date)}
        </h1>
        <div className="mb-4 flex items-center justify-between">
          {workDay.notes.length > 0 ? (
            <h2 className="text-lg font-medium">Notes</h2>
          ) : (
            <h2 className="text-lg font-medium">No Notes</h2>
          )}
          <Button onClick={() => setShowAddNote(true)}>
            <Clock className="mr-2" size={16} />
            New Note
          </Button>
        </div>

        {workDay.notes.map((note) => (
          <Note note={note} key={note.id} type="workDay" />
        ))}
      </main>

      {showAddNote && (
        <AddNote
          type="workDay"
          typeId={workDay.id!}
          setShowAddNote={setShowAddNote}
        />
      )}
    </div>
  );
}
