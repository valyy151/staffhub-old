import { useEffect, useState } from "react";
import { api } from "~/utils/api";
import router from "next/router";
import toast from "react-hot-toast";
import Input from "~/components/ui/Input";
import Heading from "~/components/ui/Heading";
import { Button } from "~/components/ui/Button";
import Paragraph from "~/components/ui/Paragraph";
import Sidebar from "~/components/Staff/Sidebar";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Save, Sticker } from "lucide-react";
import { formatTime } from "~/utils/dateFormatting";

interface schedulePreferencesProps {
  query: { id: string };
}

schedulePreferencesPage.getInitialProps = ({
  query,
}: schedulePreferencesProps) => {
  return { query };
};

export default function schedulePreferencesPage({
  query,
}: schedulePreferencesProps) {
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
      hoursPerMonth: parseInt(hoursPerMonth) || 0,
    });
  }

  if (!employee) {
    return <Sidebar />;
  }

  return (
    <main className="flex">
      <Sidebar employee={employee} />
      <div className="mt-4 flex flex-col">
        <Heading>Schedule preferences for {employee?.name}</Heading>
        <Button
          size={"lg"}
          className="mt-2 h-14 w-fit text-2xl"
          onClick={() => setShowAddPreference(true)}
        >
          <Sticker size={32} className="mr-2" />
          Edit Schedule Preferences
        </Button>

        {showAddPreference && (
          <form onSubmit={createPreference} className="mt-8 flex-col">
            <Heading size={"xs"} className="mb-3">
              How many hours per month would this employee like to work?
            </Heading>
            <div>
              <Input
                type="text"
                value={hoursPerMonth}
                className="h-14 text-lg"
                placeholder="Enter hours per month  "
                onChange={(e) => setHoursPerMonth(e.target.value)}
              />
            </div>
            <Heading size={"xs"} className="my-2">
              Which shifts does {employee.name} prefer?
            </Heading>
            <div className="my-4 space-y-2">
              {employee?.shiftModels.map((shiftModel) => (
                <div key={shiftModel.id} className="my-2">
                  <input
                    type="checkbox"
                    className="h-8 w-8 cursor-pointer"
                    id={shiftModel.id}
                    name={shiftModel.id}
                    value={shiftModel.id}
                  />
                  <label
                    htmlFor={shiftModel.id}
                    className="ml-2 cursor-pointer text-3xl"
                  >
                    {formatTime(shiftModel.start)} -{" "}
                    {formatTime(shiftModel.end)}
                  </label>
                </div>
              ))}
            </div>
            <div className="mt-2 flex w-full space-x-1">
              <Button
                className="h-14 w-full text-2xl"
                title="Add shift preference"
              >
                <Save size={36} className="mr-2" /> Save
              </Button>
              <Button
                onClick={() => setShowAddPreference(false)}
                className="h-14 w-full text-2xl"
                title="Cancel shift preference creation"
                variant={"subtle"}
                type="button"
              >
                <ArrowLeft size={36} className="mr-2" /> Cancel
              </Button>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}
