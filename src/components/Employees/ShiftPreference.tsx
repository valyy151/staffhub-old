import { Employee, ShiftPreference } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { Check, XCircle, Trash2, Pencil } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "~/components/ui/Button";
import Input from "~/components/ui/Input";
import Modal from "~/components/ui/Modal";
import Paragraph from "~/components/ui/Paragraph";
import { api } from "~/utils/api";

interface ShiftPreferenceProps {
  employee: Employee;
  shiftPreference: ShiftPreference;
}

export default function ShiftPreference({
  employee,
  shiftPreference,
}: ShiftPreferenceProps) {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editPreference, setEditPreference] = useState<boolean>(false);
  const [content, setContent] = useState<string>(shiftPreference.content);

  const queryClient = useQueryClient();

  const deleteShiftPreference = api.shiftPreference.delete.useMutation({
    onSuccess: () => {
      setShowModal(false);
      queryClient.invalidateQueries();
      toast.success("Shift preference deleted successfully.");
    },
  });

  const updateShiftPreference = api.shiftPreference.update.useMutation({
    onSuccess: () => {
      setEditPreference(false);
      queryClient.invalidateQueries();
      toast.success("Shift preference updated successfully.");
    },
  });

  return (
    <div className="mx-auto my-2 flex w-fit items-center justify-center rounded-md bg-white px-3 py-1 shadow dark:bg-slate-700">
      {editPreference ? (
        <>
          <Input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="m-0 h-12 w-[36rem] border-none text-lg shadow-none focus:ring-0 focus:ring-offset-0"
          />
          <Button
            size={"sm"}
            variant={"link"}
            title="Save changes"
            className="w-16 min-w-0"
            onClick={() =>
              updateShiftPreference.mutate({
                content,
                shiftPreferenceId: shiftPreference.id,
              })
            }
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
          <Paragraph className="m-0 flex h-12 w-[36rem] min-w-[16rem] items-center rounded-md bg-white px-3 text-left dark:bg-slate-700">
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
              submit={() =>
                deleteShiftPreference.mutate({
                  shiftPreferenceId: shiftPreference.id,
                })
              }
            />
          )}
        </div>
      )}
    </div>
  );
}