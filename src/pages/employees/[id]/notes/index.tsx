import { Employee, EmployeeNote } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { Check, MoreVertical, Scroll, X } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import toast from "react-hot-toast";
import Dropdown from "~/components/Employees/Dropdown";
import Note from "~/components/Employees/Note";
import { Button } from "~/components/ui/Button";
import Heading from "~/components/ui/Heading";
import Input from "~/components/ui/Input";
import { api } from "~/utils/api";

interface EmployeeNotesPageProps {
  query: { id: string };
}

EmployeeNotesPage.getInitialProps = ({ query }: EmployeeNotesPageProps) => {
  return { query };
};

export default function EmployeeNotesPage({ query }: EmployeeNotesPageProps) {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showAddNote, setShowAddNote] = useState<boolean>(false);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [content, setContent] = useState<string>("");

  const queryClient = useQueryClient();

  const createNote = api.employee.createNote.useMutation({
    onSuccess: () => {
      setShowAddNote(false);
      queryClient.invalidateQueries();
      toast.success("Note created successfully.");
    },
  });

  const { data: employee }: any = api.employee.findOne.useQuery({
    id: query.id,
  });

  return (
    <main
      className="mx-auto w-4/5 pt-20"
      onClick={() => showDropdown && setShowDropdown(false)}
    >
      <div className="relative ml-auto flex">
        <Button
          className="ml-auto min-w-0 rounded-full hover:bg-slate-50 dark:hover:bg-slate-600"
          variant={"link"}
          onClick={() => setShowDropdown(!showDropdown)}
        >
          <MoreVertical size={24} />
        </Button>
        {showDropdown && (
          <Dropdown
            employee={employee}
            setShowModal={setShowModal}
            setShowDropdown={setShowDropdown}
          />
        )}
      </div>
      <div className="flex w-full items-center justify-center space-x-8 border-b-2 border-slate-300 pb-4 dark:border-slate-600">
        <Heading className="">Notes for {employee?.name}</Heading>
        {showAddNote ? (
          <Button
            size={"sm"}
            className=" w-36"
            variant={"outline"}
            onClick={() => setShowAddNote(false)}
          >
            Cancel
            <X className="ml-2 h-5 w-5" />
          </Button>
        ) : (
          <Button
            size={"sm"}
            className=" w-36"
            onClick={() => setShowAddNote(true)}
          >
            New Note
            <Scroll className="ml-2 h-5 w-5" />
          </Button>
        )}
      </div>

      {!showAddNote && employee?.notes && (
        <div className="mt-32">
          {employee.notes.length > 0 && (
            <Heading size={"sm"} className="text-center">
              {employee.notes.length}{" "}
              {employee.notes.length === 1 ? "note" : "notes"}
            </Heading>
          )}
          {employee?.notes.length > 0 ? (
            employee?.notes.map((note: EmployeeNote) => (
              <Note note={note} key={note.id} />
            ))
          ) : (
            <>
              {!showAddNote && (
                <Heading className="text-center font-normal" size={"xs"}>
                  There are no notes for this employee.
                </Heading>
              )}
            </>
          )}
        </div>
      )}
      {showAddNote && (
        <form
          onSubmit={() =>
            createNote.mutate({
              content,
              employeeId: query.id,
            })
          }
          className="mx-auto mt-32 flex w-full flex-col items-center space-x-4"
        >
          <Heading size={"xs"} className="mb-3">
            New note
          </Heading>
          <div className="flex w-[46rem]">
            <Input
              type="text"
              value={content}
              className="mx-auto w-full"
              placeholder=" Add a note..."
              onChange={(e) => setContent(e.target.value)}
            />
            <Button title="Add note" variant={"link"} className="w-20 min-w-0">
              <Check size={36} className="mt-2" />
            </Button>
          </div>
        </form>
      )}
    </main>
  );
}
