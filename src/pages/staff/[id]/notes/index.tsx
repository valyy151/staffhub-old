import { ScrollText } from 'lucide-react';
import router from 'next/router';
import { useState } from 'react';
import { api } from '~/utils/api';

import Note from '@/components/Staff/Note';
import Sidebar from '@/components/Staff/Sidebar';
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter,
    AlertDialogHeader, AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import Heading from '@/components/ui/heading';
import Paragraph from '@/components/ui/paragraph';
import { useToast } from '@/components/ui/use-toast';
import { useQueryClient } from '@tanstack/react-query';

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

  const { data: employees } = api.employee.find.useQuery();

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

  function handleSubmit() {
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
        <Paragraph className="mt-8">
          There are no notes for {employee.name}.
        </Paragraph>
      );
    }

    return (
      <>
        <Paragraph className="mr-auto mt-8">
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
      <Sidebar employee={employee} employees={employees} />

      <div className="mt-4 flex w-[36rem] flex-col">
        <Heading size={"sm"}>Notes for {employee?.name}</Heading>
        <Button className="mt-2 w-fit" onClick={() => setShowAddNote(true)}>
          <ScrollText className="mr-2" />
          New Note
        </Button>

        {renderNotes()}

        {showAddNote && (
          <AlertDialog open={showAddNote}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle> Add a Note</AlertDialogTitle>
              </AlertDialogHeader>
              <textarea
                rows={4}
                cols={40}
                value={content}
                placeholder=" Add a note..."
                className="dark:focus: resize-none rounded-lg border   bg-transparent px-3 py-2 placeholder:text-gray-500 focus:border-black focus:ring-black disabled:cursor-not-allowed disabled:opacity-50 dark:bg-transparent dark:text-gray-50 dark:placeholder:text-gray-400 dark:focus:ring-gray-300"
                onChange={(e) => setContent(e.target.value)}
              />
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setShowAddNote(false)}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction onClick={handleSubmit}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    </main>
  );
}
