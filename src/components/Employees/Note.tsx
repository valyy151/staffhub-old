import Input from "../ui/Input";
import Modal from "../ui/Modal";
import { api } from "~/utils/api";
import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "../ui/Button";
import Paragraph from "../ui/Paragraph";
import { useQueryClient } from "@tanstack/react-query";
import { XCircle, Trash2, Pencil, Save } from "lucide-react";

interface NoteProps {
  note: { id: string; content: string; createdAt: Date };
}

export default function Note({ note }: NoteProps) {
  const [editNote, setEditNote] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [content, setContent] = useState<string>(note.content);

  const queryClient = useQueryClient();

  const deleteNoteMutation = api.employeeNote.delete.useMutation({
    onSuccess: () => {
      setShowModal(false);
      void queryClient.invalidateQueries();
      toast.success("Note deleted successfully.", {
        className: "text-xl text-center",
      });
    },

    onError: () => {
      toast.error("There was a problem deleting the note.", {
        className: "text-xl text-center",
      });
    },
  });

  const updateNoteMutation = api.employeeNote.update.useMutation({
    onSuccess: () => {
      setEditNote(false);
      void queryClient.invalidateQueries();
      toast.success("Note updated successfully.", {
        className: "text-xl text-center",
      });
    },

    onError: () => {
      toast.error("There was a problem updating the note.", {
        className: "text-xl text-center",
      });
    },
  });

  function updateNote() {
    updateNoteMutation.mutate({
      content,
      noteId: note.id,
    });
  }

  function deleteNote() {
    deleteNoteMutation.mutate({
      noteId: note.id,
    });
  }

  return (
    <div className="my-2 flex flex-col items-start">
      <Paragraph className="ml-2 font-medium">
        {" "}
        {note.createdAt.toLocaleString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "numeric",
          minute: "numeric",
        })}
      </Paragraph>
      <div
        className={`mx-auto flex w-fit items-center justify-center rounded-md bg-white px-3 py-1 shadow dark:bg-slate-700 ${
          editNote ? "ring-05 ring-slate-400" : ""
        }`}
      >
        {editNote ? (
          <>
            <Input
              type="text"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="m-0 h-12 w-[36rem] border-none px-0 text-lg shadow-none focus:ring-0 focus:ring-offset-0"
            />
            <Button
              size={"sm"}
              variant={"link"}
              title="Save changes"
              className="w-16 min-w-0 p-5"
              onClick={updateNote}
            >
              {<Save className="text-green-500" />}
            </Button>
            <Button
              size={"sm"}
              title="Cancel"
              variant={"link"}
              className="w-16 min-w-0 p-5"
              onClick={() => setEditNote(false)}
            >
              {<XCircle />}
            </Button>
          </>
        ) : (
          <div className="flex items-center">
            <Paragraph className="flex h-12 w-[36rem] min-w-[16rem] items-center rounded-md bg-white text-left dark:bg-slate-700">
              {note.content}
            </Paragraph>
            <Button
              size={"sm"}
              variant={"link"}
              className="w-16 min-w-0 p-5"
              onClick={() => setEditNote(true)}
              title="Edit note"
            >
              {<Pencil />}
            </Button>
            <Button
              size={"sm"}
              variant={"link"}
              title="Delete note"
              className="w-16 min-w-0 p-5"
              onClick={() => setShowModal(true)}
            >
              {<Trash2 className="text-red-500" />}
            </Button>

            {showModal && (
              <Modal
                text={"Delete note?"}
                showModal={showModal}
                submit={deleteNote}
                cancel={() => setShowModal(false)}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
