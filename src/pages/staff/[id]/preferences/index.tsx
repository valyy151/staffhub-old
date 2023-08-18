import { useState } from "react";
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
import SchedulePreference from "~/components/Staff/SchedulePreference";

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
  });

  if (failureReason?.data?.httpStatus === 401) {
    router.push("/");
  }

  const queryClient = useQueryClient();

  const createPreferenceMutation = api.schedulePreference.create.useMutation({
    onSuccess: () => {
      setShowAddPreference(false);
      void queryClient.invalidateQueries();
      toast.success("Shift preference created successfully.");
    },
    onError: () => {
      toast.error("There was an error creating the shift preference.");
    },
  });

  function createPreference(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    createPreferenceMutation.mutate({
      shiftModelIds: [],
      employeeId: query.id,
      hoursPerMonth: parseInt(hoursPerMonth),
    });
  }

  function renderschedulePreferences() {
    if (showAddPreference) {
      return null;
    }

    if (employee?.schedulePreferences.length === 0) {
      return (
        <Paragraph size={"lg"} className="mt-8">
          There are no shift preferences for {employee.name}.
        </Paragraph>
      );
    }

    return (
      <>
        <Paragraph size={"lg"} className="mr-auto mt-8">
          {employee?.name} has {employee?.schedulePreferences.length}{" "}
          {employee?.schedulePreferences.length === 1
            ? "shift preference"
            : "shift preferences"}
        </Paragraph>
        {employee?.schedulePreferences.map((preference) => (
          <SchedulePreference
            key={preference.id}
            schedulePreference={preference}
          />
        ))}
      </>
    );
  }

  if (!employee) {
    return <Sidebar />;
  }

  return (
    <main className="flex">
      <Sidebar employee={employee} />
      <div className="mt-4 flex flex-col">
        <Heading>Shift preferences for {employee?.name}</Heading>
        <Button
          size={"lg"}
          className="mt-2 h-14 w-fit text-2xl"
          onClick={() => setShowAddPreference(true)}
        >
          <Sticker size={32} className="mr-2" />
          New Shift Preference
        </Button>

        {renderschedulePreferences()}

        {showAddPreference && (
          <form onSubmit={createPreference} className="mt-8 flex-col">
            <Heading size={"xs"} className="mb-3">
              Add a new shift preference
            </Heading>

            <Input
              type="text"
              placeholder=" Add a shift preference..."
              // value={content}
              // onChange={(e) => setContent(e.target.value)}
              className="h-14 text-lg"
            />
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
