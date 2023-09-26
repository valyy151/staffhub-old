import { ArrowLeft, Save } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import Heading from "../ui/heading";
import { type WorkDay, api } from "~/utils/api";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import ReactModal from "react-modal";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";

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

  const { toast } = useToast();

  const queryClient = useQueryClient();

  const createNote = api.workDayNote.create.useMutation({
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

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!content) {
      return toast({
        title: "Please enter a note.",
      });
    }

    createNote.mutate({
      content,
      workDayId: data.id!,
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
