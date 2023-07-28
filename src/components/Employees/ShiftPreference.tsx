import { type ShiftPreference } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { XCircle, Trash2, Pencil, Save } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "~/components/ui/Button";
import Input from "~/components/ui/Input";
import Modal from "~/components/ui/Modal";
import Paragraph from "~/components/ui/Paragraph";
import { api } from "~/utils/api";

interface ShiftPreferenceProps {
  shiftPreference: { id: string; content: string; createdAt: Date };
}

export default function ShiftPreference({
  shiftPreference,
}: ShiftPreferenceProps) {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editPreference, setEditPreference] = useState<boolean>(false);
  const [content, setContent] = useState<string>(shiftPreference.content);

  const queryClient = useQueryClient();

  const deletePreferenceMutation = api.shiftPreference.delete.useMutation({
    onSuccess: () => {
      setShowModal(false);
      void queryClient.invalidateQueries();
      toast.success("Shift preference deleted successfully.");
    },
  });

  const updatePreferenceMutation = api.shiftPreference.update.useMutation({
    onSuccess: () => {
      setEditPreference(false);
      void queryClient.invalidateQueries();
      toast.success("Shift preference updated successfully.");
    },
  });

  function updatePreference() {
    updatePreferenceMutation.mutate({
      content,
      shiftPreferenceId: shiftPreference.id,
    });
  }

  function deletePreference() {
    deletePreferenceMutation.mutate({
      shiftPreferenceId: shiftPreference.id,
    });
  }

  return (
    <div className="my-2 flex w-[42rem] flex-col items-start">
      <Paragraph className="m-0 font-medium">
        {" "}
        {shiftPreference.createdAt.toLocaleString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "numeric",
          minute: "numeric",
        })}
      </Paragraph>
      <div
        className={`mx-auto flex w-fit items-center justify-center rounded-md bg-white px-3 py-1 shadow dark:bg-slate-700 ${
          editPreference ? "ring-05 ring-slate-400" : ""
        }`}
      >
        {editPreference ? (
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
              onClick={updatePreference}
            >
              {<Save className="text-green-500" />}
            </Button>
            <Button
              size={"sm"}
              title="Cancel"
              variant={"link"}
              className="w-16 min-w-0 p-5"
              onClick={() => setEditPreference(false)}
            >
              {<XCircle />}
            </Button>
          </>
        ) : (
          <div className="flex items-center">
            <Paragraph className="m-0 flex h-12 w-[36rem] min-w-[16rem] items-center rounded-md bg-white text-left dark:bg-slate-700">
              {content}
            </Paragraph>
            <Button
              size={"sm"}
              variant={"link"}
              className="w-16 min-w-0 p-5"
              onClick={() => setEditPreference(true)}
              title="Edit shift preference"
            >
              {<Pencil />}
            </Button>
            <Button
              size={"sm"}
              variant={"link"}
              className="w-16 min-w-0 p-5"
              onClick={() => setShowModal(true)}
              title="Delete shift preference"
            >
              {<Trash2 className="text-red-500" />}
            </Button>

            {showModal && (
              <Modal
                showModal={showModal}
                submit={deletePreference}
                text={"Delete shift preference?"}
                cancel={() => setShowModal(false)}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
