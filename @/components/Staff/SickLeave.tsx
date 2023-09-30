import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import { api } from '~/utils/api';
import { formatDateLong } from '~/utils/dateFormatting';

import { Button } from '@/components/ui/button';
import FormModal from '@/components/ui/form-modal';
import Paragraph from '@/components/ui/paragraph';
import { useToast } from '@/components/ui/use-toast';
import { useQueryClient } from '@tanstack/react-query';

type SickLeaveProps = {
  sickLeave: { id: string; start: bigint; end: bigint };
};

export default function SickLeave({ sickLeave }: SickLeaveProps) {
  const [showModal, setShowModal] = useState<boolean>(false);

  const { toast } = useToast();

  const queryClient = useQueryClient();

  const deleteSickLeave = api.sickLeave.delete.useMutation({
    onSuccess: () => {
      void queryClient.invalidateQueries();
      toast({
        title: "Sick leave deleted successfully.",
      });
    },
    onError: () => {
      toast({
        title: "There was a problem deleting the sick leave.",
        variant: "destructive",
      });
    },
  });

  function handleDelete() {
    deleteSickLeave.mutate(sickLeave.id);
  }

  return (
    <div className="my-2 flex w-full items-center justify-center rounded-md border border-foreground/25 px-3 py-1">
      <div className="flex w-full items-center space-x-6">
        <Paragraph className="w-full rounded px-2 py-2 text-left">
          From{" "}
          <span className="font-bold">
            {formatDateLong(Number(sickLeave.start) / 1000)}.{" "}
          </span>{" "}
          untill{" "}
          <span className="font-bold">
            {formatDateLong(Number(sickLeave.end) / 1000)}.
          </span>
        </Paragraph>

        <Button
          size={"sm"}
          variant={"link"}
          className="p-5 text-red-500 dark:text-red-400"
          onClick={() => {
            setShowModal(true);
          }}
          title="Delete sick leave"
        >
          {<Trash2 />}
        </Button>

        {showModal && (
          <FormModal
            showModal={showModal}
            submit={handleDelete}
            heading={"Delete sick leave?"}
            cancel={() => setShowModal(false)}
            text={"Are you sure you want to delete this sick leave?"}
          />
        )}
      </div>
    </div>
  );
}
