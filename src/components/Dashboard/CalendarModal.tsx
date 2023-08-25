import ReactModal from "react-modal";
import { type MouseEventHandler } from "react";
import Heading from "../ui/Heading";
import Paragraph from "../ui/Paragraph";
import { Button } from "../ui/Button";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { X } from "lucide-react";

interface ModalProps {
  showModal: boolean;
  cancel: MouseEventHandler<HTMLButtonElement>;
}

export default function CalendarModal({ cancel, showModal }: ModalProps) {
  return (
    <ReactModal
      isOpen={showModal}
      className="fixed inset-0 flex items-center justify-center bg-[rgba(16,17,30,0.7)]"
    >
      <div className="mx-auto min-w-[26rem] max-w-3xl animate-fade rounded-xl border border-slate-300 bg-white px-2 pb-6 pt-2  text-left shadow-lg dark:border-slate-600 dark:bg-slate-750">
        <div className="flex">
          <div className="ml-auto">
            {" "}
            <Button variant={"ghost"} onClick={cancel}>
              <X size={30} />
            </Button>
          </div>
        </div>

        <div className="flex flex-col px-8 py-2">
          <Heading size={"xs"} className="mb-1 ml-1">
            Choose a month
          </Heading>
          <Calendar view="month" maxDetail="year" />
        </div>
      </div>
    </ReactModal>
  );
}
