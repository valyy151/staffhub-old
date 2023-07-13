import { useState } from "react";
import { Check, MoreVertical, Sticker, X } from "lucide-react";
import { Button } from "~/components/ui/Button";
import Dropdown from "~/components/Employees/Dropdown";
import Heading from "~/components/ui/Heading";
import type { ShiftPreference } from "@prisma/client";
import ShiftPreferenceComponent from "~/components/Employees/ShiftPreferences/ShiftPreference";
import Input from "~/components/ui/Input";
import { api } from "~/utils/api";

interface ShiftPreferencesPageProps {
  query: { id: string };
}

ShiftPreferencesPage.getInitialProps = ({
  query,
}: ShiftPreferencesPageProps) => {
  return { query };
};

export default function ShiftPreferencesPage({
  query,
}: ShiftPreferencesPageProps) {
  const [content, setContent] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [showAddPreference, setShowAddPreference] = useState<boolean>(false);

  const addShiftPreference = async (e: React.FormEvent) => {};

  const { data: employee }: any = api.employee?.findOne.useQuery({
    id: query.id,
  });

  return (
    <main className="pt-20">
      <div className="relative ml-auto flex">
        <Button
          className="ml-auto min-w-0 rounded-full hover:bg-slate-50 dark:hover:bg-slate-600"
          variant={"link"}
          onClick={() => setShowDropdown(!showDropdown)}
        >
          <MoreVertical size={24} />
        </Button>
        {showDropdown && (
          <Dropdown
            employee={employee}
            setShowModal={setShowModal}
            setShowDropdown={setShowDropdown}
          />
        )}
      </div>
      <div className="flex w-full items-center justify-center space-x-8 border-b-2 border-slate-300 pb-4 dark:border-slate-600">
        <Heading size={"sm"}>Shift preferences for {employee?.name}</Heading>
        {showAddPreference ? (
          <Button
            size={"sm"}
            className="w-48 min-w-0"
            onClick={() => setShowAddPreference(false)}
            variant={"outline"}
          >
            Cancel
            <X className="ml-2 h-5 w-5" />
          </Button>
        ) : (
          <Button
            size={"sm"}
            className="w-48"
            onClick={() => setShowAddPreference(true)}
          >
            New Shift Preference
            <Sticker className="ml-2 h-5 w-5" />
          </Button>
        )}
      </div>

      {!showAddPreference && (
        <div className="mt-32">
          {employee?.shiftPreferences &&
            employee?.shiftPreferences.length > 0 && (
              <Heading size={"xs"} className="mb-3 text-center">
                {employee?.shiftPreferences.length}{" "}
                {employee?.shiftPreferences.length === 1
                  ? "shift preference"
                  : "shift preferences"}
              </Heading>
            )}
          {employee?.shiftPreferences &&
          employee?.shiftPreferences.length > 0 ? (
            employee?.shiftPreferences.map(
              (shiftPreference: ShiftPreference) => (
                <ShiftPreferenceComponent
                  employee={employee}
                  key={shiftPreference.id}
                  shiftPreference={shiftPreference}
                />
              )
            )
          ) : (
            <>
              {!showAddPreference && (
                <Heading className="font-normal" size={"xs"}>
                  There are no shift preferences for this employee.
                </Heading>
              )}
            </>
          )}
        </div>
      )}
      {showAddPreference && (
        <form
          onSubmit={addShiftPreference}
          className="mt-32 flex flex-col space-x-4"
        >
          <Heading size={"xs"} className="mb-3 text-center">
            New shift preference
          </Heading>
          <div className=" flex w-[48rem]">
            <Input
              type="text"
              placeholder=" Add a shift preference..."
              onChange={(e) => setContent(e.target.value)}
            />
            <Button
              title="Add shift preference"
              variant={"link"}
              className="w-20 min-w-0"
            >
              <Check size={36} className="mt-2" />
            </Button>
          </div>
        </form>
      )}
    </main>
  );
}
