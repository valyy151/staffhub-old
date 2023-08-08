import Modal from "../ui/Modal";
import { useState } from "react";
import { api } from "~/utils/api";
import toast from "react-hot-toast";
import { UserCog } from "lucide-react";
import { type StaffRole } from "~/utils/api";
import Heading from "~/components/ui/Heading";
import { Button } from "~/components/ui/Button";
import Paragraph from "~/components/ui/Paragraph";
import { useQueryClient } from "@tanstack/react-query";

interface StaffRoleProps {
  role: StaffRole;
}

export default function StaffRole({ role }: StaffRoleProps) {
  const [showModal, setShowModal] = useState(false);
  const queryClient = useQueryClient();

  const deleteStaffRole = api.staffRole.delete.useMutation({
    onSuccess: () => {
      toast.success("Staff Role Deleted", {
        className: "text-xl text-center",
      });
      setShowModal(false);
      queryClient.invalidateQueries();
    },

    onError: () => {
      toast.error("Failed to delete Staff Role", {
        className: "text-xl text-center",
      });
    },
  });

  return (
    <div className="flex items-center justify-between border-b border-slate-300 py-2 dark:border-slate-500">
      <div className="flex items-center space-x-2">
        <UserCog size={28} />
        <Heading size={"xs"}>{role.name}</Heading>
      </div>
      <div className="flex items-center space-x-2">
        {role.numberPerDay !== null && role.numberPerDay > 0 && (
          <>
            <Paragraph size={"lg"} className="text-2xl">
              Minimum
            </Paragraph>
            <Paragraph size={"lg"} className="text-2xl font-bold">
              {role.numberPerDay}
            </Paragraph>
            <Paragraph size={"lg"} className="text-2xl">
              per work day
            </Paragraph>
          </>
        )}

        <Button
          variant={"subtle"}
          className="h-14 text-2xl"
          onClick={() => setShowModal(true)}
        >
          Delete
        </Button>
      </div>
      {showModal && (
        <Modal
          showModal={showModal}
          cancel={() => setShowModal(false)}
          submit={() => deleteStaffRole.mutate({ id: role.id })}
          text={`Are you sure you want to delete the ${role.name} staff role?`}
        />
      )}
    </div>
  );
}
