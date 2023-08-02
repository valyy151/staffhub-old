import { User2, ArrowLeft, ScrollText, Clock8 } from "lucide-react";
import { useRouter } from "next/router";
import { set } from "zod";

interface SidebarProps {
  showNotes: boolean;
  showShifts: boolean;
  setShowNotes: (showNotes: boolean) => void;
  setShowShifts: (showShifts: boolean) => void;
  setShowAddNote: (showAddNote: boolean) => void;
  setShowAddShift: (showAddShift: boolean) => void;
}

export default function Sidebar({
  showNotes,
  showShifts,
  setShowNotes,
  setShowShifts,
  setShowAddNote,
  setShowAddShift,
}: SidebarProps) {
  const router = useRouter();

  return (
    <div className="mr-[26rem]">
      <ul className="fixed h-full w-fit border-r border-slate-500 text-2xl">
        <li
          onClick={() => {
            setShowShifts(false);
            setShowNotes(false);
            setShowAddNote(false);
            setShowAddShift(false);
            !showShifts && !showNotes && router.push("/dashboard");
          }}
          className="flex w-96 cursor-pointer items-center p-4 hover:bg-slate-150 dark:hover:bg-slate-750"
        >
          <ArrowLeft className="mr-2" />
          {!showShifts && !showNotes ? "Dashboard" : "Back"}
        </li>
        <li
          onClick={() => {
            setShowShifts(true);
            setShowNotes(false);
            setShowAddNote(false);
            setShowAddShift(false);
          }}
          className={`flex w-96 cursor-pointer items-center p-4 ${
            showShifts
              ? "bg-slate-200 text-sky-600 dark:bg-slate-700 dark:text-sky-400"
              : "hover:bg-slate-150 dark:hover:bg-slate-750"
          }`}
        >
          <Clock8 className="mr-2" /> Shifts
        </li>
        <li
          onClick={() => {
            setShowNotes(true);
            setShowShifts(false);
            setShowAddNote(false);
            setShowAddShift(false);
          }}
          className={`flex w-96 cursor-pointer items-center p-4 ${
            showNotes
              ? "bg-slate-200 text-sky-600 dark:bg-slate-700 dark:text-sky-400"
              : "hover:bg-slate-150 dark:hover:bg-slate-750"
          }`}
        >
          <ScrollText className="mr-2" /> Notes
        </li>
      </ul>
    </div>
  );
}
