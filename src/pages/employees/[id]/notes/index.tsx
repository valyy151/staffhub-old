import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Save, ScrollText } from "lucide-react";
import { useRouter } from "next/router";
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

  const { data: employee } = api.employee?.findOne.useQuery({
    id: query.id,
  });

  const queryClient = useQueryClient();

  const createNote = api.employeeNote.create.useMutation({
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

  if (!employee?.notes) {
    return null;
  }

  return (
    <main className="flex flex-col">
      <Sidebar employee={employee} />

      <div className="mx-auto mt-4 flex w-fit flex-col items-center">
        <Heading>Notes for {employee?.name}</Heading>
        <Button
          size={"lg"}
          className="mt-2 h-14 text-2xl"
          onClick={() => setShowAddNote(true)}
        >
          <ScrollText size={32} className="mr-2" />
          New Note
        </Button>
        {employee?.notes.length > 0 && !showAddNote && (
          <Paragraph size={"lg"} className="mr-auto mt-8">
            There {employee?.notes.length === 1 ? "is" : "are"}{" "}
            {employee?.notes.length}{" "}
            {employee?.notes.length === 1 ? "note" : "notes"} for{" "}
            {employee?.name}.
          </Paragraph>
        )}

        {employee?.notes.length > 0 &&
          !showAddNote &&
          employee?.notes.map((note) => <Note note={note} key={note.id} />)}

        {employee?.notes.length === 0 && !showAddNote && (
          <Paragraph size={"lg"} className="mt-8">
            There are no notes for {employee.name}.
          </Paragraph>
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
    </main>
  );
}
