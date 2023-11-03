import { ScrollText } from "lucide-react";
import router from "next/router";
import { useState } from "react";
import { api } from "~/utils/api";

import AddNote from "@/components/AddNote";
import Note from "@/components/Note";
import Sidebar from "@/components/Staff/Sidebar";
import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import Paragraph from "@/components/ui/paragraph";

type EmployeeNotesPageProps = {
  query: { id: string };
};

EmployeeNotesPage.getInitialProps = ({ query }: EmployeeNotesPageProps) => {
  return { query };
};

export default function EmployeeNotesPage({ query }: EmployeeNotesPageProps) {
  const [showAddNote, setShowAddNote] = useState<boolean>(false);

  const { data: employee, failureReason } = api.employee?.findOne.useQuery({
    id: query.id,
  });

  const { data: employees } = api.employee.find.useQuery();

  if (failureReason?.data?.httpStatus === 401) {
    router.push("/");
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

        {employee?.notes?.length! > 0 ? (
          <>
            <Paragraph className="mr-auto mt-8">
              There {employee?.notes?.length === 1 ? "is" : "are"}{" "}
              {employee?.notes?.length}{" "}
              {employee?.notes?.length === 1 ? "note" : "notes"} for{" "}
              {employee?.name}.
            </Paragraph>

            {employee?.notes?.map((note) => (
              <Note note={note} key={note.id} type="employee" />
            ))}
          </>
        ) : (
          <Paragraph className="mt-8">
            There are no notes for {employee.name}.
          </Paragraph>
        )}

        {showAddNote && (
          <AddNote
            type="employee"
            typeId={query.id}
            setShowAddNote={setShowAddNote}
          />
        )}
      </div>
    </main>
  );
}
