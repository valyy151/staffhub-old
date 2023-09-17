import FormModal from "../ui/FormModal";
import { useState } from "react";
import { api } from "~/utils/api";
import toast from "react-hot-toast";
import Paragraph from "../ui/Paragraph";
import { type WorkDayNote } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type NoteProps = {
  note: WorkDayNote;
};

export default function Note({ note }: NoteProps) {
  const [showModal, setShowModal] = useState<boolean>(false);

  const queryClient = useQueryClient();

  const deleteNoteMutation = api.workDayNote.delete.useMutation({
    onSuccess: () => {
      setShowModal(false);
      void queryClient.invalidateQueries();
      toast.success("Note deleted successfully.");
    },

    onError: () => {
      toast.error("There was a problem deleting the note.");
    },
  });

  function deleteNote() {
    deleteNoteMutation.mutate({ noteId: note.id });
  }

  return (
    <div className="my-2 flex flex-col items-start">
      <div className="flex w-full min-w-[28rem] flex-col rounded-md border bg-white py-1 shadow dark:border-slate-700 dark:bg-slate-800 ">
        <Paragraph className="px-2 text-justify font-medium">
          {note.content}
        </Paragraph>

        <p className="border-b border-slate-300 px-2 pb-2 text-sm font-light dark:border-slate-600">
          Added{" "}
          {note.createdAt.toLocaleString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "numeric",
            minute: "numeric",
          })}
        </p>

        <Button
          size={"sm"}
          variant={"link"}
          title="Delete note"
          className="w-fit px-2 py-5 font-semibold text-red-600 focus:ring-0 focus:ring-offset-0 dark:text-red-500"
          onClick={() => setShowModal(true)}
        >
          {<Trash2 size={18} className="mr-2 text-red-500" />} Remove
        </Button>
      </div>
      {showModal && (
        <FormModal
          submit={deleteNote}
          showModal={showModal}
          heading={"Delete note?"}
          cancel={() => setShowModal(false)}
          text={"Are you sure you want to delete this note?"}
        />
      )}
    </div>
  );
}
