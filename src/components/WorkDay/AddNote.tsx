import { Check, X } from "lucide-react";
import { Dispatch, FC, SetStateAction, useState } from "react";
import { WorkDay } from "@prisma/client";
import Input from "../ui/Input";
import { Button } from "../ui/Button";
import { api } from "~/utils/api";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Heading from "../ui/Heading";

interface AddNoteProps {
  showAddNote: boolean;
  data: WorkDay;
  setShowAddNote: Dispatch<SetStateAction<boolean>>;
  setShowAddShift: Dispatch<SetStateAction<boolean>>;
}

export default function AddNote({
  data,
  showAddNote,
  setShowAddNote,
  setShowAddShift,
}: AddNoteProps) {
  const [note, setNote] = useState<string>("");

  const queryClient = useQueryClient();

  const createNote = api.workDay.createNote.useMutation({
    onSuccess: () => {
      setShowAddNote(false);
      queryClient.invalidateQueries();
      toast.success("Note created successfully.");
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    createNote.mutate({
      content: note,
      workDayId: data.id,
    });
  }

  return (
    <>
      <Heading size={"sm"} className="mb-2">
        Add a note
      </Heading>
      <form onSubmit={handleSubmit} className="flex space-x-2">
        <Input
          type="text"
          name="note"
          value={note}
          className="w-[40rem]"
          placeholder="Anything to note?"
          onChange={(e) => setNote(e.target.value)}
        />

        <Button title="Add note" variant={"link"}>
          {<Check />}
        </Button>

        <Button
          type="button"
          title="Cancel"
          variant={"link"}
          onClick={() => setShowAddNote(false)}
        >
          {<X />}
        </Button>
      </form>
    </>
  );
}
