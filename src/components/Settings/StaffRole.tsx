import FormModal from "../ui/FormModal";
import { useState } from "react";
import { api } from "~/utils/api";
import toast from "react-hot-toast";
import { UserCog } from "lucide-react";
import { type StaffRole } from "~/utils/api";
import Heading from "~/components/ui/Heading";
import { Button } from "~/components/ui/Button";
import Paragraph from "~/components/ui/Paragraph";
import { useQueryClient } from "@tanstack/react-query";
import Input from "~/components/ui/Input";

interface StaffRoleProps {
  role: StaffRole;
}

export default function StaffRole({ role }: StaffRoleProps) {
  const queryClient = useQueryClient();
  const [edit, setEdit] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [name, setName] = useState(role.name);
  const [numberPerDay, setNumberPerDay] = useState(
    role.numberPerDay?.toString()
  );

  const deleteStaffRole = api.staffRole.delete.useMutation({
    onSuccess: () => {
      toast.success("Staff Role Deleted");
      setShowModal(false);
      queryClient.invalidateQueries();
    },

    onError: () => {
      toast.error("Failed to delete Staff Role");
    },
  });

  const updateStaffRole = api.staffRole.update.useMutation({
    onSuccess: () => {
      toast.success("Staff Role Updated");
      setEdit(false);
      queryClient.invalidateQueries();
    },

    onError: () => {
      toast.error("Failed to update Staff Role");
    },
  });

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    updateStaffRole.mutate({
      name,
      staffRoleId: role.id,
      numberPerDay: Number(numberPerDay),
    });
  }

  return (
    <div className="flex h-20 w-[64rem] items-center justify-between border-b border-slate-300 py-2 dark:border-slate-500">
      {!edit && (
        <>
          <div className="flex items-center">
            <UserCog size={28} />
            <Heading size={"xs"} className="ml-5 min-w-[7.75rem]">
              {role.name}
            </Heading>
          </div>

          <div className="flex items-center">
            {role.numberPerDay !== null && role.numberPerDay > 0 && (
              <>
                <Paragraph size={"lg"} className="ml-8 text-2xl">
                  Minimum
                </Paragraph>
                <Paragraph size={"lg"} className="ml-2 text-2xl font-bold">
                  {role.numberPerDay}
                </Paragraph>
                <Paragraph size={"lg"} className="ml-2 text-2xl">
                  per work day
                </Paragraph>
              </>
            )}

            <Button
              size={"lg"}
              variant={"subtle"}
              onClick={() => setEdit(true)}
              className="ml-8 h-14 w-28 text-2xl"
            >
              Edit
            </Button>

            <Button
              size={"lg"}
              variant={"destructive"}
              className="ml-2 h-14 w-36 text-2xl"
              onClick={() => setShowModal(true)}
            >
              Delete
            </Button>
          </div>
        </>
      )}
      {edit && (
        <form
          onSubmit={handleSubmit}
          className="flex w-full items-center justify-between space-x-2"
        >
          <div className="flex items-center space-x-2">
            <UserCog size={28} />
            <div>
              <label className="ml-1">Name</label>
              <Input
                value={name}
                className=" w-[26rem] bg-white text-xl font-bold dark:bg-transparent"
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label className="ml-1">Number needed per work day</label>
              <Input
                value={numberPerDay}
                className=" w-48 bg-white text-xl font-bold dark:bg-transparent"
                onChange={(e) => setNumberPerDay(e.target.value)}
              />
            </div>
          </div>
          <div className="space-x-2">
            <Button size={"lg"} className="h-14 w-28 text-2xl">
              Save
            </Button>

            <Button
              size={"lg"}
              variant={"subtle"}
              className="h-14 w-36 text-2xl"
              onClick={() => setEdit(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      )}
      {showModal && (
        <FormModal
          showModal={showModal}
          cancel={() => setShowModal(false)}
          submit={() => deleteStaffRole.mutate({ id: role.id })}
          heading={"Delete Staff Role?"}
          text={`Are you sure you want to delete the ${role.name} staff role?`}
        />
      )}
    </div>
  );
}
