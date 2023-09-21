import { useState } from "react";
import { api } from "~/utils/api";
import { useToast } from "@/components/ui/use-toast";
import Heading from "~/components/ui/Heading";
import Note from "~/components/Staff/Note";
import { Button } from "@/components/ui/button";
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

  const { toast } = useToast();

  const queryClient = useQueryClient();

  const createNote = api.employeeNote.create.useMutation({
    onSuccess: () => {
      setContent("");
      setShowAddNote(false);
      void queryClient.invalidateQueries();
      toast({ title: "Note created successfully." });
    },
    onError: () => {
      toast({
        title: "There was a problem creating the note.",
        variant: "destructive",
      });
    },
  });

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!content) {
      return toast({ title: "Please enter a note." });
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
        <Heading size={"sm"}>Notes for {employee?.name}</Heading>
        <Button
          size={"lg"}
          className="mt-2 w-fit text-xl"
          onClick={() => setShowAddNote(true)}
        >
          <ScrollText size={32} className="mr-2" />
          New Note
        </Button>

        {renderNotes()}

        {showAddNote && (
          <div className="mt-8 flex w-fit flex-col">
            <form onSubmit={handleSubmit} className=" flex flex-col">
              <Heading size={"xs"} className="mb-3">
                Add a new note
              </Heading>

              <textarea
                rows={4}
                cols={40}
                value={content}
                placeholder=" Add a note..."
                className="resize-none rounded-lg border border-slate-400 bg-transparent px-3 py-2 placeholder:text-slate-500 focus:border-black focus:ring-black disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:bg-transparent dark:text-slate-50 dark:placeholder:text-slate-400 dark:focus:border-slate-300 dark:focus:ring-slate-300"
                onChange={(e) => setContent(e.target.value)}
              />
              <div className="mt-3 flex w-full space-x-2">
                {" "}
                <Button
                  size={"lg"}
                  title="Add note"
                  className="mt-2 w-fit text-xl"
                >
                  <Save size={28} className="mr-2" />
                  Save
                </Button>
                <Button
                  size={"lg"}
                  type="button"
                  title="Cancel note creation"
                  variant={"subtle"}
                  className="mt-2 w-fit text-xl"
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
