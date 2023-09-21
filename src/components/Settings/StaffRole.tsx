import FormModal from "../ui/FormModal";
import { useState } from "react";
import { api } from "~/utils/api";
import { useToast } from "@/components/ui/use-toast";
import { UserCog } from "lucide-react";
import { type StaffRole } from "~/utils/api";
import Heading from "~/components/ui/Heading";
import { Button } from "@/components/ui/button";
import Paragraph from "~/components/ui/Paragraph";
import { useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import EditModal from "../WorkDay/EditModal";
import ReactModal from "react-modal";
import { Label } from "@/components/ui/label";

type StaffRoleProps = {
  role: StaffRole;
};

export default function StaffRole({ role }: StaffRoleProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [edit, setEdit] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [name, setName] = useState(role.name);
  const [numberPerDay, setNumberPerDay] = useState(
    role.numberPerDay?.toString()
  );

  const deleteStaffRole = api.staffRole.delete.useMutation({
    onSuccess: () => {
      toast({
        title: "Staff Role deleted successfully.",
      });
      setShowModal(false);
      queryClient.invalidateQueries();
    },

    onError: () => {
      toast({
        title: "There was a problem deleting the staff role.",
        variant: "destructive",
      });
    },
  });

  const updateStaffRole = api.staffRole.update.useMutation({
    onSuccess: () => {
      toast({
        title: "Staff Role updated successfully.",
      });
      setEdit(false);
      queryClient.invalidateQueries();
    },

    onError: () => {
      toast({
        title: "There was a problem updating the staff role.",
        variant: "destructive",
      });
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
    <div className="flex h-20 items-center justify-between border-b border-slate-300 py-2 dark:border-slate-500">
      <div className="flex items-center space-x-2">
        <UserCog size={28} />
        <Heading size={"xxs"}>{role.name}</Heading>
      </div>

      <div className="flex items-center">
        {role.numberPerDay !== null && role.numberPerDay > 0 && (
          <>
            <Paragraph className="ml-8 ">Minimum</Paragraph>
            <Paragraph className="ml-2  font-bold">
              {role.numberPerDay}
            </Paragraph>
            <Paragraph className="ml-2 ">per work day</Paragraph>
          </>
        )}
        <div className="space-x-2 pl-2">
          <Button size={"lg"} variant={"subtle"} onClick={() => setEdit(true)}>
            Edit
          </Button>

          <Button
            size={"lg"}
            variant={"destructive"}
            onClick={() => setShowModal(true)}
          >
            Delete
          </Button>
        </div>
      </div>

      {edit && (
        <ReactModal
          isOpen={edit}
          className="fixed inset-0 flex items-center justify-center bg-[rgba(16,17,30,0.7)]"
        >
          <form
            className="animate-fade mx-auto rounded-xl border border-slate-300 bg-white px-24 pb-6 pt-3 text-left shadow-lg dark:border-slate-600 dark:bg-slate-800"
            onSubmit={handleSubmit}
          >
            <Heading size={"sm"} className="mt-4">
              Edit Staff Role
            </Heading>
            <div className="mt-4">
              <Label htmlFor="name">Name</Label>

              <Input
                type="text"
                name="name"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="mt-4">
              <Label htmlFor="numberPerDay">Minimum</Label>

              <Input
                type="number"
                name="numberPerDay"
                placeholder="Minimum"
                value={numberPerDay}
                className="[appearance:textfield]  [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                onChange={(e) => setNumberPerDay(e.target.value)}
              />
            </div>

            <div className="mt-4 flex justify-end space-x-2">
              <Button
                size={"lg"}
                variant={"subtle"}
                onClick={() => setEdit(false)}
              >
                Cancel
              </Button>
              <Button size={"lg"} type="submit">
                Update
              </Button>
            </div>
          </form>
        </ReactModal>
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
