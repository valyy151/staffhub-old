import { Check, X } from "lucide-react";
import { Dispatch, FC, SetStateAction, useState } from "react";
import { WorkDay } from "@prisma/client";
import Input from "../ui/Input";
import { Button } from "../ui/Button";
import { api } from "~/utils/api";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

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
    <form onSubmit={handleSubmit} className="flex space-x-2">
      <Input
        type="text"
        name="note"
        value={note}
        className="w-[40rem]"
        placeholder="Anything to note?"
        onChange={(e) => setNote(e.target.value)}
      />

      <Button title="Add note" variant={"link"} className=" min-w-0">
        {<Check size={40} className="mt-2" />}
      </Button>

      <Button
        type="button"
        title="Cancel"
        variant={"link"}
        className=" min-w-0"
        onClick={() => setShowAddNote(false)}
      >
        {<X size={40} className="mt-2" />}
      </Button>
    </form>
  );
}
