import { useState } from 'react';
import { api } from '~/utils/api';
import { formatTime, formatTotal } from '~/utils/dateFormatting';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useQueryClient } from '@tanstack/react-query';

import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter,
    AlertDialogHeader, AlertDialogTitle
} from '../ui/alert-dialog';
import FormModal from '../ui/form-modal';
import Heading from '../ui/heading';

type ShiftModelProps = {
  shiftModel: {
    id: string;
    end: number;
    start: number;
    userId: string;
  };
};

export default function ShiftModel({ shiftModel }: ShiftModelProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [edit, setEdit] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [end, setEnd] = useState<number>(shiftModel.end);
  const [start, setStart] = useState<number>(shiftModel.start);

  const editShiftModel = api.shiftModel.update.useMutation({
    onSuccess: () => {
      setEdit(false);
      queryClient.invalidateQueries();
      toast({
        title: "Shift model updated successfully.",
      });
    },

    onError: () => {
      toast({
        title: "There was a problem updating the shift model.",
        variant: "destructive",
      });
    },
  });

  const deleteShiftModel = api.shiftModel.delete.useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries();
      toast({
        title: "Shift model deleted successfully.",
      });
    },

    onError: () => {
      toast({
        title: "There was a problem deleting the shift model.",
        variant: "destructive",
      });
    },
  });

  function handleTimeChange(newTime: string, field: "start" | "end") {
    const [hour, minute]: string[] = newTime.split(":");
    const newDate: any = new Date(shiftModel.start * 1000);
    newDate.setHours(hour);
    newDate.setMinutes(minute);
    const newUnixTime = Math.floor(newDate.getTime() / 1000);

    field === "start" ? setStart(newUnixTime) : setEnd(newUnixTime);
  }

  return (
    <div className="flex h-20 items-center justify-between border-b   py-2">
      <div className="flex w-full items-center justify-between">
        <div className="flex space-x-2">
          <Heading size={"xs"}>{formatTime(shiftModel.start)}</Heading>
          <Heading size={"xs"}>-</Heading>
          <Heading size={"xs"}>{formatTime(shiftModel.end)}</Heading>
        </div>
        <div>
          <Heading size={"xs"} className="mx-12">
            {formatTotal(shiftModel.start, shiftModel.end)}
          </Heading>
        </div>
        <div className="space-x-2">
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
              <AlertDialogTitle> Edit Shift Model</AlertDialogTitle>
            </AlertDialogHeader>
            <div className="mt-4 flex flex-col space-y-4">
              <div>
                <Label>Start Time</Label>
                <Input
                  type="text"
                  value={formatTime(start)}
                  onChange={(e) => handleTimeChange(e.target.value, "start")}
                />
              </div>
              <div>
                <Label>End Time</Label>
                <Input
                  type="text"
                  value={formatTime(end)}
                  onChange={(e) => handleTimeChange(e.target.value, "end")}
                />
              </div>
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setEdit(false)}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() =>
                  editShiftModel.mutate({ id: shiftModel.id, start, end })
                }
              >
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
      {showModal && (
        <FormModal
          showModal={showModal}
          heading={"Delete Shift Model?"}
          cancel={() => setShowModal(false)}
          submit={() => {
            deleteShiftModel.mutate({ id: shiftModel.id });
            setShowModal(false);
          }}
          text="Are you sure you want to delete this shift model?"
        />
      )}
    </div>
  );
}
