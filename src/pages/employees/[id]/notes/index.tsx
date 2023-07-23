import { EmployeeNote } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { Check, Save, ScrollText, X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import Note from "~/components/Employees/Note";
import Sidebar from "~/components/Employees/Sidebar";
import { Button } from "~/components/ui/Button";
import Heading from "~/components/ui/Heading";
import Input from "~/components/ui/Input";
import Paragraph from "~/components/ui/Paragraph";
import { api } from "~/utils/api";

interface EmployeeNotesPageProps {
  query: { id: string };
}

EmployeeNotesPage.getInitialProps = ({ query }: EmployeeNotesPageProps) => {
  return { query };
};

export default function EmployeeNotesPage({ query }: EmployeeNotesPageProps) {
  const [content, setContent] = useState<string>("");
  const [showAddNote, setShowAddNote] = useState<boolean>(false);

  const response = api.employee?.findOne.useQuery({
    id: query.id,
  });

  const employee: any = response.data;

  const queryClient = useQueryClient();

  const createNote = api.employee.createNote.useMutation({
    onSuccess: () => {
      setContent("");
      setShowAddNote(false);
      queryClient.invalidateQueries();
      toast.success("Note created successfully.");
    },
  });

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    createNote.mutate({
      content,
      employeeId: query.id,
    });
  }

  return (
    <main className="flex flex-col">
      <Sidebar employee={employee} />

      <div className="mx-auto mt-4 flex w-fit flex-col items-center">
        <Heading>Notes for {employee?.name}</Heading>
        {employee?.notes.length > 0 && !showAddNote && (
          <>
            <Button
              size={"lg"}
              className="mt-4 text-xl"
              onClick={() => setShowAddNote(true)}
            >
              New Note
              <ScrollText className="ml-2" />
            </Button>
            <Paragraph size={"lg"} className="mr-auto mt-8">
              There {employee?.notes.length === 1 ? "is" : "are"}{" "}
              {employee?.notes.length}{" "}
              {employee?.notes.length === 1 ? "note" : "notes"} for{" "}
              {employee?.name}.
            </Paragraph>
          </>
        )}

        {employee?.notes.length > 0 &&
          !showAddNote &&
          employee?.notes.map((note: EmployeeNote) => (
            <Note note={note} key={note.id} />
          ))}

        {employee?.notes.length === 0 && (
          <>
            <Paragraph size={"lg"} className="mt-4">
              There are no notes for this employee.
            </Paragraph>
            <Button
              size={"lg"}
              className="mt-2 text-xl"
              onClick={() => setShowAddNote(true)}
            >
              New Note
              <ScrollText className="ml-2" />
            </Button>
          </>
        )}
      </div>

      {showAddNote && (
        <form
          onSubmit={handleSubmit}
          className="mx-auto mt-8 flex w-5/12 flex-col"
        >
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
              className="h-12 w-full text-2xl"
            >
              Save <Save className="ml-2" />
            </Button>
            <Button
              size={"lg"}
              type="button"
              title="Cancel note creation"
              variant={"subtle"}
              className="h-12 w-full text-2xl"
              onClick={() => setShowAddNote(false)}
            >
              Cancel <X className="ml-2" />
            </Button>
          </div>
        </form>
      )}
    </main>
  );
}
