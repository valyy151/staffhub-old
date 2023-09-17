import { ArrowLeft, Save } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import Heading from "../ui/Heading";
import { type WorkDay, api } from "~/utils/api";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import ReactModal from "react-modal";

type AddNoteProps = {
  data: WorkDay;
  showAddNote: boolean;
  setShowAddNote: (showAddnote: boolean) => void;
};

export default function AddNote({
  data,
  showAddNote,
  setShowAddNote,
}: AddNoteProps) {
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

    createNote.mutate({
      content,
      workDayId: data.id!,
    });
  }

  return (
    <ReactModal
      isOpen={showAddNote}
      className="fixed inset-0 flex items-center justify-center bg-[rgba(16,17,30,0.7)]"
    >
      <div className="flex flex-col items-start rounded-lg bg-white p-8 dark:bg-slate-800">
        <form onSubmit={handleSubmit} className="flex flex-col">
          <Heading size={"sm"} className="mb-3">
            Add a new note
          </Heading>

          <textarea
            rows={4}
            cols={40}
            value={content}
            placeholder=" Add a note..."
            className="resize-none rounded-lg border border-slate-400 bg-transparent px-3 py-2 placeholder:text-slate-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:bg-transparent dark:text-slate-50 dark:placeholder:text-slate-400 "
            onChange={(e) => setContent(e.target.value)}
          />
          <div className="mt-3 flex w-full space-x-2">
            {" "}
            <Button size={"lg"} title="Add note">
              <Save size={28} className="mr-2" />
              Save
            </Button>
            <Button
              size={"lg"}
              type="button"
              title="Cancel note creation"
              variant={"subtle"}
              onClick={() => setShowAddNote(false)}
            >
              <ArrowLeft size={28} className="mr-2" />
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </ReactModal>
  );
}
