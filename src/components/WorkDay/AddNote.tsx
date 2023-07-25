import { ArrowLeft, Check, Save, ScrollText, X } from "lucide-react";
import { Dispatch, FC, SetStateAction, useState } from "react";
import Input from "../ui/Input";
import toast from "react-hot-toast";
import Heading from "../ui/Heading";
import { Button } from "../ui/Button";
import { WorkDay, api } from "~/utils/api";
import { useQueryClient } from "@tanstack/react-query";

interface AddNoteProps {
  data: WorkDay;
  setShowAddNote: (showAddnote: boolean) => void;
}

export default function AddNote({ data, setShowAddNote }: AddNoteProps) {
  const [content, setContent] = useState<string>("");

  const queryClient = useQueryClient();

  const createNote = api.workDayNote.create.useMutation({
    onSuccess: () => {
      setContent("");
      setShowAddNote(false);
      queryClient.invalidateQueries();
      toast.success("Note created successfully.");
    },
    onError: () => {
      toast.error("There was an error creating the note.");
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!content) {
      return toast.error("Please fill the note content.");
    }

    if (data.id) {
      createNote.mutate({
        content,
        workDayId: data.id,
      });
    }
  }

  return (
    <div className="flex w-full flex-col">
      <form
        onSubmit={handleSubmit}
        className="mx-auto mt-8 flex w-5/12 flex-col"
      >
        <Heading size={"sm"} className="mb-3">
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
          <Button size={"lg"} title="Add note" className="h-14 w-full text-2xl">
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
    </div>
  );
}
