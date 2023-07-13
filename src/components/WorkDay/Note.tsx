import Input from "../ui/Input";
import Modal from "../ui/Modal";
import { useState } from "react";
import { api } from "~/utils/api";
import toast from "react-hot-toast";
import { Button } from "../ui/Button";
import Paragraph from "../ui/Paragraph";
import { WorkDayNote } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { Check, XCircle, Trash2, Pencil } from "lucide-react";
import Heading from "../ui/Heading";

interface NoteProps {
  note: WorkDayNote;
}

export default function Note({ note }: NoteProps) {
  const [editNote, setEditNote] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [content, setContent] = useState<string>(note.content);

  const queryClient = useQueryClient();

  const deleteNote = api.workDay.deleteNote.useMutation({
    onSuccess: () => {
      setShowModal(false);
      queryClient.invalidateQueries();
      toast.success("Note deleted successfully.");
    },
  });

  const updateNote = api.workDay.updateNote.useMutation({
    onSuccess: () => {
      setEditNote(false);
      queryClient.invalidateQueries();
      toast.success("Note updated successfully.");
    },
  });

  return (
    <div className="my-1 flex items-center justify-center rounded-md bg-white px-3 py-1 shadow dark:bg-slate-700">
      {editNote ? (
        <>
          <Input
            type="text"
            value={content}
            className="m-0 h-12 w-[40rem] border-none text-2xl shadow-none focus:ring-0 focus:ring-offset-0"
            onChange={(e) => setContent(e.target.value)}
          />
          <Button
            size={"sm"}
            variant={"link"}
            className="w-16 min-w-0"
            onClick={() => updateNote.mutate({ noteId: note.id, content })}
            title="Save changes"
          >
            {<Check />}
          </Button>
          <Button
            size={"sm"}
            variant={"link"}
            className="w-16 min-w-0"
            onClick={() => setEditNote(false)}
            title="Cancel"
          >
            {<XCircle />}
          </Button>
        </>
      ) : (
        <div className="flex items-center">
          <Heading
            size={"xs"}
            className="w-[40rem] min-w-[16rem] rounded-md bg-white px-2 py-2 text-left font-normal dark:bg-slate-700"
            key={note.id}
          >
            {content}
          </Heading>
          <Button
            size={"sm"}
            variant={"link"}
            className="w-16 min-w-0 rounded-full p-5 hover:bg-slate-200"
            onClick={() => {
              setEditNote(true);
            }}
            title="Edit note"
          >
            {<Pencil />}
          </Button>
          <Button
            size={"sm"}
            variant={"link"}
            className="w-16 min-w-0 rounded-full p-5 hover:bg-slate-200"
            onClick={() => {
              setShowModal(true);
            }}
            title="Delete note"
          >
            {<Trash2 />}
          </Button>

          {showModal && (
            <Modal
              text={"Delete note?"}
              showModal={showModal}
              cancel={() => setShowModal(false)}
              submit={() => deleteNote.mutate({ noteId: note.id })}
            />
          )}
        </div>
      )}
    </div>
  );
}
