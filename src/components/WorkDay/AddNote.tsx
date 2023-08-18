import { ArrowLeft, Save } from "lucide-react";
import { useState } from "react";
import Input from "../ui/Input";
import toast from "react-hot-toast";
import Heading from "../ui/Heading";
import { Button } from "../ui/Button";
import { type WorkDay, api } from "~/utils/api";
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
      void queryClient.invalidateQueries();
      toast.success("Note created successfully.");
    },

    onError: () => {
      toast.error("There was an error creating the note.");
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!content) {
      return toast("Please fill the note content.");
    }

    if (data.id) {
      createNote.mutate({
        content,
        workDayId: data.id,
      });
    }
  }

  return (
    <div className="flex flex-col">
      <form onSubmit={handleSubmit} className="mt-8 flex flex-col">
        <Heading size={"sm"} className="mb-3">
          Add a new note
        </Heading>

        <textarea
          value={content}
          rows={5}
          placeholder=" Add a note..."
          className="resize-none rounded border border-slate-400 bg-transparent px-3 py-2 text-xl placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:text-slate-50 dark:placeholder:text-slate-400 dark:focus:ring-slate-400 dark:focus:ring-offset-slate-900"
          onChange={(e) => setContent(e.target.value)}
        />
        <div className="mt-3 flex w-full space-x-2">
          {" "}
          <Button size={"lg"} title="Add note" className="h-14 text-2xl">
            <Save size={28} className="mr-2" />
            Save
          </Button>
          <Button
            size={"lg"}
            type="button"
            title="Cancel note creation"
            variant={"subtle"}
            className="h-14 text-2xl"
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
