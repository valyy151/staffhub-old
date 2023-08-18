import { type SchedulePreference } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { XCircle, Trash2, Pencil, Save } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "~/components/ui/Button";
import Input from "~/components/ui/Input";
import Modal from "~/components/ui/Modal";
import Paragraph from "~/components/ui/Paragraph";
import { api } from "~/utils/api";

interface SchedulePreferenceProps {
  schedulePreference: { id: string; hoursPerMonth: number; createdAt: Date };
}

export default function SchedulePreference({
  schedulePreference,
}: SchedulePreferenceProps) {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editPreference, setEditPreference] = useState<boolean>(false);
  const [hoursPerMonth, setHoursPerMonth] = useState<string>(
    schedulePreference.hoursPerMonth?.toString()
  );

  const queryClient = useQueryClient();

  const deletePreferenceMutation = api.schedulePreference.delete.useMutation({
    onSuccess: () => {
      setShowModal(false);
      void queryClient.invalidateQueries();
      toast.success("Schedule preference deleted successfully.");
    },

    onError: () => {
      toast.error("There was a problem deleting the shift preference.");
    },
  });

  const updatePreferenceMutation = api.schedulePreference.update.useMutation({
    onSuccess: () => {
      setEditPreference(false);
      void queryClient.invalidateQueries();
      toast.success("Schedule preference updated successfully.");
    },

    onError: () => {
      toast.error("There was a problem updating the schedule preference.");
    },
  });

  function updatePreference() {
    updatePreferenceMutation.mutate({
      hoursPerMonth: parseInt(hoursPerMonth),
      shiftModelIds: [],
      schedulePreferenceId: schedulePreference.id,
    });
  }

  function deletePreference() {
    deletePreferenceMutation.mutate({
      schedulePreferenceId: schedulePreference.id,
    });
  }

  return (
    <div className="my-2 flex w-[42rem] flex-col items-start">
      <Paragraph className="font-medium">
        {" "}
        {schedulePreference.createdAt.toLocaleString("en-GB", {
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
              // value={content}
              // onChange={(e) => setContent(e.target.value)}
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
            <Paragraph className="flex h-12 w-[36rem] min-w-[16rem] items-center rounded-md bg-white text-left dark:bg-slate-700">
              {/* {content} */}
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
                cancel={() => setShowModal(false)}
                heading={"Delete shift preference?"}
                text={"Are you sure you want to delete this shift preference?"}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
