import { useState } from "react";
import { api } from "~/utils/api";

import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type AddNoteProps = {
  typeId: string;
  type: "workDay" | "employee";
  setShowAddNote: (showAddnote: boolean) => void;
};

export default function AddNote({
  type,
  typeId,
  setShowAddNote,
}: AddNoteProps) {
  const [content, setContent] = useState<string>("");

  const { toast } = useToast();

  const queryClient = useQueryClient();

  const createWorkDayNote = api.workDayNote.create.useMutation({
    onSuccess: () => {
      setContent("");
      setShowAddNote(false);
      void queryClient.invalidateQueries();
      toast({
        title: "Note created successfully.",
      });
    },

    onError: () => {
      toast({
        title: "There was a problem creating the note.",
        variant: "destructive",
      });
    },
  });

  const createEmployeeNote = api.employeeNote.create.useMutation({
    onSuccess: () => {
      setContent("");
      setShowAddNote(false);
      void queryClient.invalidateQueries();
      toast({
        title: "Note created successfully.",
      });
    },

    onError: () => {
      toast({
        title: "There was a problem creating the note.",
        variant: "destructive",
      });
    },
  });

  function handleSubmit() {
    if (!content) {
      return toast({
        title: "Please enter a note.",
      });
    }

    type === "employee"
      ? createEmployeeNote.mutate({
          content,
          employeeId: typeId,
        })
      : createWorkDayNote.mutate({
          content,
          workDayId: typeId,
        });
  }

  return (
    <AlertDialog open>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle> Add a Note</AlertDialogTitle>
        </AlertDialogHeader>
        <textarea
          rows={4}
          cols={40}
          autoFocus
          value={content}
          placeholder=" Add a note..."
          className="dark:focus: resize-none rounded-lg border   bg-transparent px-3 py-2 placeholder:text-gray-500 focus:border-black focus:ring-black disabled:cursor-not-allowed disabled:opacity-50 dark:bg-transparent dark:text-gray-50 dark:placeholder:text-gray-400 dark:focus:ring-gray-300"
          onChange={(e) => setContent(e.target.value)}
        />
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setShowAddNote(false)}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleSubmit}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
