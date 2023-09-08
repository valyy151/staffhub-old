import { useState } from "react";
import { api } from "~/utils/api";
import toast from "react-hot-toast";
import Heading from "~/components/ui/Heading";
import Note from "~/components/Staff/Note";
import { Button } from "~/components/ui/Button";
import Paragraph from "~/components/ui/Paragraph";
import Sidebar from "~/components/Staff/Sidebar";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Save, ScrollText } from "lucide-react";
import router from "next/router";

type EmployeeNotesPageProps = {
  query: { id: string };
};

EmployeeNotesPage.getInitialProps = ({ query }: EmployeeNotesPageProps) => {
  return { query };
};

export default function EmployeeNotesPage({ query }: EmployeeNotesPageProps) {
  const [content, setContent] = useState<string>("");
  const [showAddNote, setShowAddNote] = useState<boolean>(false);

  const { data: employee, failureReason } = api.employee?.findOne.useQuery({
    id: query.id,
  });

  if (failureReason?.data?.httpStatus === 401) {
    router.push("/");
  }

  const queryClient = useQueryClient();

  const createNote = api.employeeNote.create.useMutation({
    onSuccess: () => {
      setContent("");
      setShowAddNote(false);
      void queryClient.invalidateQueries();
      toast.success("Note created successfully.");
    },
    onError: () => {
      toast.error("There was an error creating the note.");
    },
  });

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!content) {
      return toast("Please fill the note content.");
    }

    createNote.mutate({
      content,
      employeeId: query.id,
    });
  }

  function renderNotes() {
    if (showAddNote) {
      return null;
    }

    if (employee?.notes?.length === 0) {
      return (
        <Paragraph size={"lg"} className="mt-8">
          There are no notes for {employee.name}.
        </Paragraph>
      );
    }

    return (
      <>
        <Paragraph size={"lg"} className="mr-auto mt-8">
          There {employee?.notes?.length === 1 ? "is" : "are"}{" "}
          {employee?.notes?.length}{" "}
          {employee?.notes?.length === 1 ? "note" : "notes"} for{" "}
          {employee?.name}.
        </Paragraph>

        {employee?.notes?.map((note) => (
          <Note note={note} key={note.id} />
        ))}
      </>
    );
  }

  if (!employee) {
    return <Sidebar />;
  }

  return (
    <main className="flex">
      <Sidebar employee={employee} />

      <div className="mt-4 flex w-[36rem] flex-col">
        <Heading>Notes for {employee?.name}</Heading>
        <Button
          size={"lg"}
          className="mt-2 h-14 w-fit text-2xl"
          onClick={() => setShowAddNote(true)}
        >
          <ScrollText size={32} className="mr-2" />
          New Note
        </Button>

        {renderNotes()}

        {showAddNote && (
          <div className="mt-8 flex w-fit flex-col">
            <form onSubmit={handleSubmit} className=" flex flex-col">
              <Heading size={"sm"} className="mb-3">
                Add a new note
              </Heading>

              <textarea
                value={content}
                rows={5}
                placeholder=" Add a note..."
                className="w-[36rem] resize-none rounded border border-slate-400 bg-transparent bg-white px-3 py-2 text-xl placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:bg-transparent dark:text-slate-50 dark:placeholder:text-slate-400 dark:focus:ring-slate-400 dark:focus:ring-offset-slate-900"
                onChange={(e) => setContent(e.target.value)}
              />
              <div className="mt-3 flex w-full space-x-2">
                {" "}
                <Button size={"lg"} title="Add note" className="h-14 text-2xl">
                  <Save size={28} className="mr-2" />
                  Save
                </Button>
                <Button
                  size={"lg"}
                  type="button"
                  title="Cancel note creation"
                  variant={"subtle"}
                  className="h-14 text-2xl"
                  onClick={() => setShowAddNote(false)}
                >
                  <ArrowLeft size={28} className="mr-2" />
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </main>
  );
}
