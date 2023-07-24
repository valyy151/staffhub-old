import { Check, ScrollText, X } from "lucide-react";
import { Dispatch, FC, SetStateAction, useState } from "react";
import Input from "../ui/Input";
import { Button } from "../ui/Button";
import { WorkDay, api } from "~/utils/api";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Heading from "../ui/Heading";

interface AddNoteProps {
  data: WorkDay;
  setShowAddNote: Dispatch<SetStateAction<boolean>>;
}

export default function AddNote({
  data,

  setShowAddNote,
}: AddNoteProps) {
  const [note, setNote] = useState<string>("");

  const queryClient = useQueryClient();

  const createNote = api.workDayNote.create.useMutation({
    onSuccess: () => {
      setShowAddNote(false);
      queryClient.invalidateQueries();
      toast.success("Note created successfully.");
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (data.id) {
      createNote.mutate({
        content: note,
        workDayId: data.id,
      });
    }
  }

  return (
    <div className="mx-auto flex flex-col">
      <Heading className="mb-3">Add a note</Heading>
      <form onSubmit={handleSubmit} className="flex space-x-2">
        <Input
          type="text"
          name="note"
          value={note}
          className="h-fit w-[40rem] text-xl"
          placeholder="Anything to note?"
          onChange={(e) => setNote(e.target.value)}
        />

        <Button size={"lg"} title="Create note">
          Create {<ScrollText className="ml-2" />}
        </Button>

        <Button
          size={"lg"}
          type="button"
          title="Cancel note creation"
          variant={"subtle"}
          onClick={() => setShowAddNote(false)}
        >
          Cancel {<X className="ml-2" />}
        </Button>
      </form>
    </div>
  );
}
