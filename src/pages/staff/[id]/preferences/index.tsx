import { Sticker } from 'lucide-react';
import router from 'next/router';
import { useEffect, useState } from 'react';
import { api } from '~/utils/api';
import { formatTime } from '~/utils/dateFormatting';

import Sidebar from '@/components/Staff/Sidebar';
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
    AlertDialogFooter, AlertDialogHeader, AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import Heading from '@/components/ui/heading';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Paragraph from '@/components/ui/paragraph';
import { useToast } from '@/components/ui/use-toast';
import { useQueryClient } from '@tanstack/react-query';

type SchedulePreferencesProps = {
  query: { id: string };
};

SchedulePreferencesPage.getInitialProps = ({
  query,
}: SchedulePreferencesProps) => {
  return { query };
};

export default function SchedulePreferencesPage({
  query,
}: SchedulePreferencesProps) {
  const [hoursPerMonth, setHoursPerMonth] = useState<string>("");
  const [showAddPreference, setShowAddPreference] = useState<boolean>(false);

  const { data: employee, failureReason } = api.employee.findOne.useQuery({
    id: query.id,
    fetchShiftModels: true,
  });

  const { data: employees } = api.employee.find.useQuery();

  if (failureReason?.data?.httpStatus === 401) {
    router.push("/");
  }

  const { toast } = useToast();

  const queryClient = useQueryClient();

  useEffect(() => {
    if (!employee?.schedulePreference) {
      return;
    }

    employee?.schedulePreference.shiftModels.forEach((shiftModel) => {
      const input = document.getElementById(shiftModel.id) as HTMLInputElement;
      if (input) {
        input.checked = true;
      }
    });

    setHoursPerMonth(employee.schedulePreference.hoursPerMonth.toString());
  }, [employee, showAddPreference]);

  const createPreferenceMutation =
    api.schedulePreference.createOrUpdate.useMutation({
      onSuccess: () => {
        setShowAddPreference(false);
        void queryClient.invalidateQueries();
        toast({ title: "Schedule preference updated successfully." });
      },
      onError: () => {
        toast({
          title: "There was a problem updating the schedule preference.",
          variant: "destructive",
        });
      },
    });

  function createPreference(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!employee?.id) {
      return;
    }

    const shiftModelIds = Array.from(
      document.querySelectorAll<HTMLInputElement>(
        "input[type=checkbox]:checked"
      )
    ).map((input) => input.value);

    createPreferenceMutation.mutate({
      shiftModelIds,
      employeeId: employee?.id,
      hoursPerMonth: parseInt(hoursPerMonth) || undefined,
    });
  }

  if (!employee) {
    return <Sidebar />;
  }

  return (
    <main className="flex">
      <Sidebar employee={employee} employees={employees} />
      <div className="mt-4 flex flex-col">
        <Heading size={"sm"}>Schedule preferences for {employee?.name}</Heading>
        <Button
          onClick={() => setShowAddPreference(true)}
          className="mt-2 w-fit"
        >
          <Sticker className="mr-2" />
          Edit Schedule Preferences
        </Button>
        <div className="mt-4">
          <Heading size={"xxs"}>
            Shift Models preffered by {employee?.name}:
          </Heading>
          {employee?.schedulePreference?.shiftModels.map((shiftModel) => (
            <Paragraph key={shiftModel.id}>
              ({formatTime(shiftModel.start)} - {formatTime(shiftModel.end)})
            </Paragraph>
          ))}
        </div>
        <div className="mt-4">
          <Heading size={"xxs"}>Hours per month assigned:</Heading>
          {employee?.schedulePreference?.hoursPerMonth! > 0 ? (
            <Paragraph>
              {employee?.schedulePreference?.hoursPerMonth} hours
            </Paragraph>
          ) : (
            <Paragraph>Not assigned</Paragraph>
          )}
        </div>
      </div>

      {showAddPreference && (
        <AlertDialog open>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Edit schedule preferences for {employee?.name}
              </AlertDialogTitle>
              <AlertDialogDescription>
                Select the shift models and the amount of work hours per month.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <form onSubmit={createPreference}>
              <div className="flex w-fit flex-col space-y-2">
                {employee?.shiftModels.map((shiftModel) => (
                  <Label key={shiftModel.id} className="cursor-pointer">
                    <input
                      type="checkbox"
                      id={shiftModel.id}
                      value={shiftModel.id}
                      className="my-0.5 mr-2 cursor-pointer focus:ring-0 focus:ring-offset-0"
                    />
                    {formatTime(shiftModel.start)} -{" "}
                    {formatTime(shiftModel.end)}
                  </Label>
                ))}
              </div>
              <div className="mt-4 flex flex-col">
                <Label>
                  Hours per month:
                  <Input
                    type="number"
                    value={hoursPerMonth}
                    onChange={(e) => setHoursPerMonth(e.target.value)}
                    // hide the up/down arrows
                    className="mt-1 w-fit [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  />
                </Label>
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setShowAddPreference(false)}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction type="submit">Continue</AlertDialogAction>
              </AlertDialogFooter>
            </form>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </main>
  );
}
