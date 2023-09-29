import { UserCog } from 'lucide-react';
import { useState } from 'react';
import { api, StaffRole } from '~/utils/api';

import { Button } from '@/components/ui/button';
import Heading from '@/components/ui/heading';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Paragraph from '@/components/ui/paragraph';
import { useToast } from '@/components/ui/use-toast';
import { useQueryClient } from '@tanstack/react-query';

import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter,
    AlertDialogHeader, AlertDialogTitle
} from '../ui/alert-dialog';
import FormModal from '../ui/form-modal';

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

  function handleSubmit() {
    updateStaffRole.mutate({
      name,
      staffRoleId: role.id,
      numberPerDay: Number(numberPerDay),
    });
  }

  return (
    <div className="flex h-20 items-center justify-between border-b   py-2">
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
          <Button size={"lg"} onClick={() => setEdit(true)}>
            Edit
          </Button>

          <Button
            size={"lg"}
            variant={"subtle"}
            onClick={() => setShowModal(true)}
          >
            Delete
          </Button>
        </div>
      </div>

      {edit && (
        <AlertDialog open>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle> Edit Staff Role</AlertDialogTitle>
            </AlertDialogHeader>

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
              <Label htmlFor="numberPerDay">Minimum per day</Label>

              <Input
                type="number"
                name="numberPerDay"
                placeholder="Minimum"
                value={numberPerDay}
                className="[appearance:textfield]  [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                onChange={(e) => setNumberPerDay(e.target.value)}
              />
            </div>

            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setEdit(false)}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction onClick={handleSubmit}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
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
