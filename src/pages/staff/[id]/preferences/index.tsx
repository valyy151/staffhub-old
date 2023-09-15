import { useEffect, useState } from "react";
import { api } from "~/utils/api";
import router from "next/router";
import toast from "react-hot-toast";

import Heading from "~/components/ui/Heading";

import Paragraph from "~/components/ui/Paragraph";
import Sidebar from "~/components/Staff/Sidebar";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Save, Sticker } from "lucide-react";
import { formatTime } from "~/utils/dateFormatting";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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

  if (failureReason?.data?.httpStatus === 401) {
    router.push("/");
  }

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
        toast.success("Schedule preference updated successfully.");
      },
      onError: () => {
        toast.error("There was an error updating the schedule preference.");
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
      <Sidebar employee={employee} />
      <div className="mt-4 flex flex-col">
        <Heading size={"xs"}>Schedule preferences for {employee?.name}</Heading>
        <Button
          size={"lg"}
          onClick={() => setShowAddPreference(true)}
          className="mt-2 w-fit"
        >
          <Sticker className="mr-2" />
          Edit Schedule Preferences
        </Button>

        {showAddPreference ? (
          <form onSubmit={createPreference} className="mt-8 flex-col">
            <Heading size={"xxs"} className="mb-3">
              How many hours per month would this employee like to work?
            </Heading>
            <div>
              <Input
                type="text"
                value={hoursPerMonth}
                placeholder="Enter hours per month  "
                onChange={(e) => setHoursPerMonth(e.target.value)}
              />
            </div>
            <Heading size={"xxs"} className="my-2">
              Which shifts does {employee.name} prefer?
            </Heading>
            <div className="my-4 space-y-2">
              {employee?.shiftModels.length > 1 ? (
                employee?.shiftModels
                  ?.sort((a, b) => a.start - b.start)
                  .map((shiftModel) => (
                    <div key={shiftModel.id} className="my-2">
                      <input
                        type="checkbox"
                        className="h-5 w-5 cursor-pointer"
                        id={shiftModel.id}
                        name={shiftModel.id}
                        value={shiftModel.id}
                      />
                      <Label
                        htmlFor={shiftModel.id}
                        className="ml-2 cursor-pointer text-xl"
                      >
                        {formatTime(shiftModel.start)} -{" "}
                        {formatTime(shiftModel.end)}
                      </Label>
                    </div>
                  ))
              ) : (
                <Link href="/settings/shift-models">
                  <Paragraph className="underline-offset-8 hover:text-sky-600 hover:underline dark:hover:text-sky-300">
                    No shifts models have been created.
                  </Paragraph>
                </Link>
              )}
            </div>
            <div className="mt-2 flex w-full space-x-1">
              <Button size={"lg"} title="Add shift preference">
                <Save className="mr-2" /> Save
              </Button>
              <Button
                size={"lg"}
                onClick={() => setShowAddPreference(false)}
                title="Cancel shift preference creation"
                variant={"subtle"}
                type="button"
              >
                <ArrowLeft className="mr-2" /> Cancel
              </Button>
            </div>
          </form>
        ) : (
          <div className="mt-8 flex-col">
            <Heading size={"xxs"} className="mb-3">
              How many hours per month would this employee like to work?
            </Heading>
            <div className="mt-6">
              {employee?.schedulePreference?.hoursPerMonth === 0 ||
              !employee?.schedulePreference?.hoursPerMonth ? (
                <Paragraph>No preference has been set.</Paragraph>
              ) : (
                <Paragraph>
                  {employee?.schedulePreference?.hoursPerMonth}h
                </Paragraph>
              )}
            </div>
            <Heading size={"xxs"} className="mb-2 mt-6">
              Which shifts does {employee.name} prefer?
            </Heading>
            <div className="mb-4 mt-6 space-y-2">
              {employee?.schedulePreference?.shiftModels.length! > 0 ? (
                employee?.schedulePreference?.shiftModels
                  .sort((a, b) => a.start - b.start)
                  .map((shiftModel) => (
                    <div key={shiftModel.id} className="my-2">
                      <Paragraph>
                        {formatTime(shiftModel.start)} -{" "}
                        {formatTime(shiftModel.end)}
                      </Paragraph>
                    </div>
                  ))
              ) : (
                <Paragraph>No preference has been set.</Paragraph>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
