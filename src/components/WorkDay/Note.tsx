import { Check, XCircle, Trash2, Pencil } from "lucide-react";
import { Dispatch, FC, SetStateAction, useState } from "react";
import Input from "../ui/Input";
import { Button } from "../ui/Button";
import Paragraph from "../ui/Paragraph";
import Modal from "../ui/Modal";
import { Shift, WorkDay, WorkDayNote } from "@prisma/client";
import { api } from "~/utils/api";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

interface NoteProps {
  note: WorkDayNote;
  data: WorkDay;
}

export default function Note({ note, data }: NoteProps) {
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

  return (
    <div className="my-1 flex w-full items-center justify-center rounded-md bg-white px-3 py-1 shadow dark:bg-slate-700">
      {editNote ? (
        <>
          <Input
            type="text"
            value={content}
            className="m-0 w-[40rem] text-xl shadow-none focus:ring-0"
            onChange={(e) => setContent(e.target.value)}
          />
          <Button
            size={"sm"}
            variant={"link"}
            className="w-16 min-w-0"
            onClick={() => {}}
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
          <Paragraph
            className="w-[40rem] min-w-[16rem] rounded-md bg-white px-2 py-2 text-left dark:bg-slate-700"
            key={note.id}
          >
            {content}
          </Paragraph>
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
              submit={() => {
                deleteNote.mutate({ noteId: note.id });
              }}
              cancel={() => setShowModal(false)}
            />
          )}
        </div>
      )}
    </div>
  );
}
