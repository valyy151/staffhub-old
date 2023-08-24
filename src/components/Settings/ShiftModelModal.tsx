import { X } from "lucide-react";
import Heading from "../ui/Heading";
import ReactModal from "react-modal";
import { Button } from "../ui/Button";
import { type MouseEventHandler } from "react";
import Paragraph from "~/components/ui/Paragraph";

interface ModalProps {
  showModal: boolean;
  close: MouseEventHandler<HTMLButtonElement>;
}

export default function Modal({ close, showModal }: ModalProps) {
  return (
    <ReactModal
      isOpen={showModal}
      className="fixed inset-0 flex items-center justify-center bg-[rgba(16,17,30,0.7)]"
    >
      <div className="relative mx-auto min-w-[26rem] animate-fade space-y-1 rounded-md border border-slate-300 bg-white pb-6 pl-12 pr-24 pt-3 shadow-lg dark:border-slate-700 dark:bg-slate-750">
        <Button variant={"link"} onClick={close} className="absolute right-0">
          <X size={36} />
        </Button>
        <Heading className="mb-2 mt-6" size={"sm"}>
          What are shift models?
        </Heading>

        <Paragraph>
          Shift models are a way to describe the different types of shifts
          available that you use most often. For example: 06:00 - 14:00 or 12:00
          - 20:00
        </Paragraph>

        <Paragraph>
          You can use this to create schedules faster by selecting a shift model
          and applying it quickly to a day.
        </Paragraph>

        <Paragraph>
          You can also use it to assign it to your staff if they have a
          preference to work those shifts.
        </Paragraph>
      </div>
    </ReactModal>
  );
}
