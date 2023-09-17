import Link from "next/link";
import router from "next/router";
import { api } from "~/utils/api";
import { useEffect, useState } from "react";
import Note from "~/components/WorkDay/Note";
import Spinner from "~/components/ui/Spinner";
import { Button } from "@/components/ui/button";
import AddNote from "~/components/WorkDay/AddNote";

import { ClipboardList, Clock, UserCog } from "lucide-react";

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
      <aside className="sticky top-0 h-screen w-56 bg-gray-100 p-4 text-gray-800 dark:bg-gray-800">
        <nav className="space-y-2">
          <Link
            href={`/days/${workDay.id}/shifts`}
            className="flex w-full items-center space-x-2 rounded-lg px-2 py-2 text-gray-500 hover:bg-gray-200 active:bg-gray-300  dark:text-gray-400 dark:hover:bg-gray-700"
          >
            <Clock />
            <span className="text-sm font-medium">Shifts</span>
          </Link>
          <button className="flex w-full items-center space-x-2 rounded-lg bg-gray-200 px-2 py-2 text-gray-800 active:bg-gray-300 dark:bg-gray-700 dark:text-gray-200">
            <ClipboardList />
            <span className="text-sm font-medium">Notes</span>
          </button>
          <Link
            href={`/days/${workDay.id}/roles`}
            className="flex w-full items-center space-x-2 rounded-lg px-2 py-2 text-gray-500 hover:bg-gray-200 active:bg-gray-300  dark:text-gray-400 dark:hover:bg-gray-700"
          >
            <UserCog />
            <span className="text-sm font-medium">Roles</span>
          </Link>
        </nav>
      </aside>
      <main className="flex-grow p-6">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-lg font-medium">Notes</h1>
          <Button onClick={() => setShowAddNote(true)}>
            <Clock className="mr-2" size={16} />
            New Note
          </Button>
        </div>

        {workDay.notes.map((note) => (
          <Note note={note} />
        ))}
      </main>
      {showAddNote && (
        <AddNote
          data={workDay}
          showAddNote={showAddNote}
          setShowAddNote={setShowAddNote}
        />
      )}
    </div>
  );
}
