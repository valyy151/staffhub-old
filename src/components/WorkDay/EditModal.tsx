import ReactModal from "react-modal";
import { useState } from "react";
import RolesDropdown from "./RolesDropdown";
import { Button } from "../ui/Button";
import { api } from "~/utils/api";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Input from "../ui/Input";
import { formatTime, formatTotal } from "~/utils/dateFormatting";
import Heading from "../ui/Heading";

interface ModalProps {
  shift: {
    employee: { name: string; roles: { name: string; id: string }[] };
    role: { name: string; id: string } | null;
  } & {
    id: string;
    start: number;
    end: number;
    employeeId: string;
    userId: string;
    date: number;
    roleId: string | null;
  };
  setEditMode: (editMode: boolean) => void;
  showModal: boolean;
  shiftModels: { start: number; end: number }[];
}

export default function EditModal({
  shift,
  showModal,
  shiftModels,
  setEditMode,
}: ModalProps) {
  const [end, setEnd] = useState<number>(shift.end);
  const [start, setStart] = useState<number>(shift.start);

  const [openRoles, setOpenRoles] = useState<boolean>(false);
  const [role, setRole] = useState<{ name: string; id: string }>({
    name: "",
    id: "",
  });

  function handleTimeChange(newTime: string, field: "start" | "end"): void {
    const [hour, minute]: string[] = newTime.split(":");
    const newDate: Date = new Date(shift.date * 1000);
    newDate.setHours(Number(hour));
    newDate.setMinutes(Number(minute));
    const newUnixTime = Math.floor(newDate.getTime() / 1000);

    field === "start" ? setStart(newUnixTime) : setEnd(newUnixTime);
  }
  const queryClient = useQueryClient();
  const updateShiftMutation = api.shift.update.useMutation({
    onSuccess: () => {
      void queryClient.invalidateQueries();
      toast.success("Shift updated successfully.");
    },

    onError: () => {
      toast.error("There was a problem updating the shift.");
    },
  });

  function updateShift(e: React.FormEvent) {
    e.preventDefault();

    updateShiftMutation.mutate({
      shiftId: shift.id,
      shift: { start, end, roleId: role.id },
    });

    setEditMode(false);
  }

  return (
    <ReactModal
      isOpen={showModal}
      className="fixed inset-0 flex items-center justify-center bg-[rgba(16,17,30,0.7)]"
    >
      <div className="mx-auto min-w-[48rem] max-w-3xl animate-fade rounded-xl border border-slate-300 bg-white px-12 pb-6 text-left shadow-lg dark:border-slate-600 dark:bg-slate-750">
        <div className="mt-6 flex flex-col">
          <Heading size={"sm"} className="mb-4">
            {shift.employee.name} -{"  "}
            {new Date(shift.date * 1000).toLocaleDateString("en-GB", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </Heading>
          <div className="flex w-fit items-center space-x-2">
            {shift.employee.roles.length > 1 && (
              <div>
                <label className="ml-2">Role</label>
                <RolesDropdown
                  role={role}
                  setRole={setRole}
                  isOpen={openRoles}
                  setIsOpen={setOpenRoles}
                  roles={shift.employee.roles}
                />
              </div>
            )}
            <div>
              <label className="ml-2">Start</label>
              <Input
                value={formatTime(start)}
                className="h-14 w-36 text-2xl"
                onChange={(e) => {
                  handleTimeChange(e.target.value, "start");
                }}
              />
            </div>
            <div>
              <label className="ml-2">End</label>
              <Input
                value={formatTime(end)}
                className="h-14 w-36 text-2xl"
                onChange={(e) => {
                  handleTimeChange(e.target.value, "end");
                }}
              />
            </div>
            <div>
              <label className="ml-2">Total</label>
              <Heading
                size={"xs"}
                className="h-14 w-16 border-none px-4 py-3 text-2xl disabled:cursor-default"
              >
                {formatTotal(start, end)}
              </Heading>
            </div>
          </div>
          <div className="mt-4">
            <Heading size={"sm"}>Choose a shift:</Heading>
            <div className="mt-1 flex space-x-8">
              {shiftModels
                .sort((a, b) => a.start - b.start)
                .map((shiftModel) => (
                  <Heading
                    size={"xs"}
                    onClick={() => {
                      handleTimeChange(formatTime(shiftModel.start)!!, "start");
                      handleTimeChange(
                        formatTime(shiftModel.end) === "00:00"
                          ? "24:00"
                          : formatTime(shiftModel.end)!!,
                        "end"
                      );
                    }}
                    className="cursor-pointer font-normal underline-offset-8 hover:text-sky-500 hover:underline"
                  >
                    {formatTime(shiftModel.start)} -{" "}
                    {formatTime(shiftModel.end)}
                  </Heading>
                ))}
            </div>
          </div>
          <div className="ml-auto mt-4 flex space-x-2">
            <Button
              size={"lg"}
              variant={"subtle"}
              className="text-xl"
              onClick={() => setEditMode(false)}
            >
              Cancel
            </Button>
            <Button size={"lg"} onClick={updateShift} className="text-xl">
              Save
            </Button>
          </div>
        </div>
      </div>
    </ReactModal>
  );
}
