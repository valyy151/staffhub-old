import { Trash2 } from "lucide-react";
import { useState } from "react";
import { api } from "~/utils/api";

import { Button } from "@/components/ui/button";
import FormModal from "@/components/ui/form-modal";
import Paragraph from "@/components/ui/paragraph";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";

type NoteProps = {
  note: { id: string; content: string; createdAt: Date };
  type: "workDay" | "employee";
};

export default function Note({ note, type }: NoteProps) {
  const { toast } = useToast();
  const [showModal, setShowModal] = useState<boolean>(false);

  const queryClient = useQueryClient();

  const deleteWorkDayNote = api.workDayNote.delete.useMutation({
    onSuccess: () => {
      setShowModal(false);
      void queryClient.invalidateQueries();
      toast({
        title: "Note deleted successfully.",
      });
    },

    onError: () => {
      toast({
        title: "There was a problem deleting the note.",
        variant: "destructive",
      });
    },
  });

  const deleteEmployeeNote = api.employeeNote.delete.useMutation({
    onSuccess: () => {
      setShowModal(false);
      void queryClient.invalidateQueries();
      toast({
        title: "Note deleted successfully.",
      });
    },

    onError: () => {
      toast({
        title: "There was a problem deleting the note.",
        variant: "destructive",
      });
    },
  });

  function deleteNote(type: "workDay" | "employee") {
    if (type === "workDay") {
      deleteWorkDayNote.mutate({ noteId: note.id });
    } else {
      deleteEmployeeNote.mutate({ noteId: note.id });
    }
  }

  return (
    <div className="my-2 flex w-fit flex-col items-start">
      <div className="flex w-full min-w-[28rem] flex-col rounded-md border bg-card py-1 shadow">
        <Paragraph size={"sm"} className="px-2 text-justify font-medium">
          {note.content}
        </Paragraph>

        <p className="border-b px-2 pb-2 text-sm font-light">
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
          showModal={showModal}
          heading={"Delete note?"}
          submit={() => deleteNote(type)}
          cancel={() => setShowModal(false)}
          text={"Are you sure you want to delete this note?"}
        />
      )}
    </div>
  );
}
