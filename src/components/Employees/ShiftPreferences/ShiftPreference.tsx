import { Employee, ShiftPreference } from "@prisma/client";
import { Check, XCircle, Trash2, Pencil } from "lucide-react";
import { useState } from "react";
import { Button } from "~/components/ui/Button";
import Input from "~/components/ui/Input";
import Modal from "~/components/ui/Modal";
import Paragraph from "~/components/ui/Paragraph";

interface ShiftPreferenceProps {
  employee: Employee;
  shiftPreference: ShiftPreference;
}

export default function ShiftPreference({
  shiftPreference,
  employee,
}: ShiftPreferenceProps) {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editPreference, setEditPreference] = useState<boolean>(false);
  const [content, setContent] = useState<string>(shiftPreference.content);

  const deleteShiftPreference = async () => {};

  const updateShiftPreference = async () => {};

  return (
    <div className="mx-auto my-2 flex w-full items-center justify-center rounded-md bg-white px-3 py-1 shadow dark:bg-slate-700">
      {editPreference ? (
        <>
          <Input
            type="text"
            value={content}
            className="m-0 w-[36rem] text-xl shadow-none focus:ring-0"
            onChange={(e) => setContent(e.target.value)}
          />
          <Button
            size={"sm"}
            variant={"link"}
            title="Save changes"
            className="w-16 min-w-0"
            onClick={() => updateShiftPreference()}
          >
            {<Check />}
          </Button>
          <Button
            size={"sm"}
            title="Cancel"
            variant={"link"}
            className="w-16 min-w-0"
            onClick={() => setEditPreference(false)}
          >
            {<XCircle />}
          </Button>
        </>
      ) : (
        <div className="flex items-center">
          <Paragraph
            size={"lg"}
            key={employee?.id}
            className="w-[36rem] min-w-[16rem] rounded-md bg-white px-2 py-2 text-left dark:bg-slate-700"
          >
            {content}
          </Paragraph>
          <Button
            size={"sm"}
            variant={"link"}
            className="w-16 min-w-0 rounded-full p-5 hover:bg-slate-100"
            onClick={() => setEditPreference(true)}
            title="Edit shift preference"
          >
            {<Pencil />}
          </Button>
          <Button
            size={"sm"}
            variant={"link"}
            className="w-16 min-w-0 rounded-full p-5 hover:bg-slate-100"
            onClick={() => setShowModal(true)}
            title="Delete shift preference"
          >
            {<Trash2 />}
          </Button>

          {showModal && (
            <Modal
              text={"Delete shift preference?"}
              showModal={showModal}
              cancel={() => setShowModal(false)}
              submit={() => deleteShiftPreference()}
            />
          )}
        </div>
      )}
    </div>
  );
}
