import { Check, XCircle, Trash2, Pencil } from "lucide-react";
import { Dispatch, FC, SetStateAction, useState } from "react";
import { EmployeeNote, WorkDay } from "@prisma/client";
import Input from "../ui/Input";
import { Button } from "../ui/Button";
import Paragraph from "../ui/Paragraph";
import Modal from "../ui/Modal";

interface NoteProps {
  index: number;
  workDay: WorkDay;
  note: EmployeeNote;
}

export default function Note({ note, index, workDay }: NoteProps) {
  const [content, setContent] = useState<string>(note.content);
  const [editNote, setEditNote] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [noteIndex, setNoteIndex] = useState<number | null>(null);

  const deleteNote = async (index: number | null) => {};

  const updateNote = async (index: number | null, note: string) => {};

  return (
    <div className="slide-in-bottom my-1 flex w-full items-center justify-center rounded-md bg-white px-3 py-1 shadow dark:bg-slate-700">
      {editNote ? (
        <>
          <Input
            type="text"
            value={note.content}
            className="m-0 w-[40rem] text-xl shadow-none focus:ring-0"
            onChange={(e) => setContent(e.target.value)}
          />
          <Button
            size={"sm"}
            variant={"link"}
            className="w-16 min-w-0"
            onClick={() => {
              setNoteIndex(index);
              updateNote(index, note.content);
            }}
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
            key={workDay?.id}
          >
            {note.content}
          </Paragraph>
          <Button
            size={"sm"}
            variant={"link"}
            className="w-16 min-w-0 rounded-full p-5 hover:bg-slate-200"
            onClick={() => {
              setEditNote(true);
              setNoteIndex(index);
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
              setNoteIndex(index);
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
              submit={() => deleteNote(noteIndex)}
            />
          )}
        </div>
      )}
    </div>
  );
}
