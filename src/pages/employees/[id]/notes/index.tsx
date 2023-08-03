import { useState } from "react";
import { api } from "~/utils/api";
import toast from "react-hot-toast";
import Input from "~/components/ui/Input";
import Heading from "~/components/ui/Heading";
import Note from "~/components/Employees/Note";
import { Button } from "~/components/ui/Button";
import Paragraph from "~/components/ui/Paragraph";
import Sidebar from "~/components/Employees/Sidebar";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Save, ScrollText } from "lucide-react";
import router from "next/router";

interface EmployeeNotesPageProps {
  query: { id: string };
}

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
      toast.success("Note created successfully.", {
        className: "text-xl text-center",
      });
    },
    onError: () => {
      toast.error("There was an error creating the note.", {
        className: "text-xl text-center",
      });
    },
  });

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!content) {
      return toast("Please fill the note content.", {
        className: "text-xl text-center",
      });
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

    if (employee?.notes.length === 0) {
      return (
        <Paragraph size={"lg"} className="mt-8">
          There are no notes for {employee.name}.
        </Paragraph>
      );
    }

    return (
      <>
        <Paragraph size={"lg"} className="mr-auto mt-8">
          There {employee?.notes.length === 1 ? "is" : "are"}{" "}
          {employee?.notes.length}{" "}
          {employee?.notes.length === 1 ? "note" : "notes"} for {employee?.name}
          .
        </Paragraph>

        {employee?.notes.map((note) => (
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
          <form onSubmit={handleSubmit} className="mt-8 flex flex-col">
            <Heading size={"xs"} className="mb-3">
              Add a New Note
            </Heading>

            <Input
              type="text"
              value={content}
              placeholder=" Add a note..."
              className="h-14 text-lg"
              onChange={(e) => setContent(e.target.value)}
            />
            <div className="mt-2 flex w-full space-x-1">
              {" "}
              <Button
                size={"lg"}
                title="Add note"
                className="h-14 w-full text-2xl"
              >
                <Save size={28} className="mr-2" />
                Save
              </Button>
              <Button
                size={"lg"}
                type="button"
                title="Cancel note creation"
                variant={"subtle"}
                className="h-14 w-full text-2xl"
                onClick={() => setShowAddNote(false)}
              >
                <ArrowLeft size={28} className="mr-2" />
                Cancel
              </Button>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}
