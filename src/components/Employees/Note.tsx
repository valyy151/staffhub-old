import { Check, XCircle, Trash2, Pencil } from "lucide-react";
import { useState } from "react";
import Input from "../ui/Input";
import { Button } from "../ui/Button";
import Modal from "../ui/Modal";
import Paragraph from "../ui/Paragraph";
import { EmployeeNote } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { api } from "~/utils/api";
import toast from "react-hot-toast";

interface NoteProps {
  note: EmployeeNote;
}

export default function Note({ note }: NoteProps) {
  const [editNote, setEditNote] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [content, setContent] = useState<string>(note.content);

  const queryClient = useQueryClient();

  const deleteNote = api.employee.deleteNote.useMutation({
    onSuccess: () => {
      setShowModal(false);
      queryClient.invalidateQueries();
      toast.success("Note deleted successfully.");
    },
  });

  const updateNote = api.employee.updateNote.useMutation({
    onSuccess: () => {
      setEditNote(false);
      queryClient.invalidateQueries();
      toast.success("Note updated successfully.");
    },
  });

  return (
    <div className="my-2 flex w-full items-center justify-center rounded-md bg-white px-3 py-1 shadow dark:bg-slate-700">
      {editNote ? (
        <>
          <Input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="m-0 w-[36rem] text-xl shadow-none focus:ring-0"
          />
          <Button
            size={"sm"}
            variant={"link"}
            title="Save changes"
            className="w-16 min-w-0"
            onClick={() => updateNote.mutate({ noteId: note.id, content })}
          >
            {<Check />}
          </Button>
          <Button
            size={"sm"}
            title="Cancel"
            variant={"link"}
            className="w-16 min-w-0"
            onClick={() => setEditNote(false)}
          >
            {<XCircle />}
          </Button>
        </>
      ) : (
        <div className="flex items-center">
          <Paragraph
            size={"lg"}
            className="w-[36rem] min-w-[16rem] rounded-md bg-white px-2 py-2 text-left dark:bg-slate-700"
          >
            {note.content}
          </Paragraph>
          <Button
            size={"sm"}
            variant={"link"}
            className="w-16 min-w-0 rounded-full p-5 hover:bg-slate-100"
            onClick={() => setEditNote(true)}
            title="Edit note"
          >
            {<Pencil />}
          </Button>
          <Button
            size={"sm"}
            variant={"link"}
            className="w-16 min-w-0 rounded-full p-5 hover:bg-slate-100"
            onClick={() => setShowModal(true)}
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
