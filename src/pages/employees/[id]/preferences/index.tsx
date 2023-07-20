import { useState } from "react";
import { ArrowLeft, Check, MoreVertical, Save, Sticker, X } from "lucide-react";
import { Button } from "~/components/ui/Button";
import Dropdown from "~/components/Employees/Dropdown";
import Heading from "~/components/ui/Heading";
import type { ShiftPreference } from "@prisma/client";
import ShiftPreferenceComponent from "~/components/Employees/ShiftPreference";
import Input from "~/components/ui/Input";
import { api } from "~/utils/api";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Sidebar from "~/components/Employees/Sidebar";
import Paragraph from "~/components/ui/Paragraph";

interface ShiftPreferencesProps {
  query: { id: string };
}

ShiftPreferencesPage.getInitialProps = ({ query }: ShiftPreferencesProps) => {
  return { query };
};

export default function ShiftPreferencesPage({ query }: ShiftPreferencesProps) {
  const [content, setContent] = useState<string>("");
  const [showAddPreference, setShowAddPreference] = useState<boolean>(false);

  const queryClient = useQueryClient();

  const createPreferenceMutation = api.shiftPreference.create.useMutation({
    onSuccess: () => {
      setShowAddPreference(false);
      queryClient.invalidateQueries();
      toast.success("Shift preference created successfully.");
    },
  });

  function createPreference(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    createPreferenceMutation.mutate({
      content,
      employeeId: query.id,
    });
  }

  const response = api.employee?.findOne.useQuery({
    id: query.id,
  });

  const employee: any = response.data;

  return (
    <main className="flex flex-col items-center">
      <Sidebar employee={employee} />
      <div className="mx-auto mt-4 flex w-fit flex-col items-center">
        <Heading>Shift preferences for {employee?.name}</Heading>
        <Button
          size={"lg"}
          className="mt-2 h-14 text-2xl"
          onClick={() => setShowAddPreference(true)}
        >
          <Sticker size={32} className="mr-2" />
          New Shift Preference
        </Button>
        {employee?.shiftPreferences.length > 0 && !showAddPreference && (
          <Paragraph size={"lg"} className="mr-auto mt-8">
            {employee?.name} has {employee?.shiftPreferences.length}{" "}
            {employee?.shiftPreferences.length === 1
              ? "shift preference"
              : "shift preferences"}
          </Paragraph>
        )}

        {employee?.shiftPreferences.length > 0 &&
          !showAddPreference &&
          employee?.shiftPreferences.map((preference: ShiftPreference) => (
            <ShiftPreferenceComponent
              key={preference.id}
              shiftPreference={preference}
            />
          ))}

        {employee?.shiftPreferences.length === 0 && !showAddPreference && (
          <Paragraph size={"lg"} className="mt-8">
            There are no shift preferences for {employee.name}.
          </Paragraph>
        )}
      </div>

      {showAddPreference && (
        <form
          onSubmit={createPreference}
          className="mx-auto mt-8 flex w-5/12 flex-col"
        >
          <Heading size={"xs"} className="mb-3">
            Add a new shift preference
          </Heading>

          <Input
            type="text"
            placeholder=" Add a shift preference..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
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
    </main>
  );
}
