import ReactModal from "react-modal";
import { UserX2, X } from "lucide-react";
import { UserCheck2 } from "lucide-react";
import { type MouseEventHandler } from "react";
import Heading from "../ui/Heading";
import { Button } from "../ui/Button";

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
      <div className="relative mx-auto min-w-[26rem] space-y-2 rounded-md border border-slate-300 bg-white px-24 pb-6 pt-3  text-center shadow-lg dark:border-slate-700 dark:bg-slate-750">
        <Button variant={"link"} onClick={close} className="absolute right-0">
          <X size={36} />
        </Button>
        <Heading className="mb-2 mt-6" size={"sm"}>
          How to write a schedule?
        </Heading>

        <Paragraph size={"lg"}>
          Start by selecting a staff member on the left and choosing which month
          you want to make a schedule for.
        </Paragraph>
        <Paragraph size={"lg"}>
          Then, click on one of the inputs in the table on the right, and start
          writing.
        </Paragraph>
        <Paragraph size={"lg"}>
          For each day, there are 2 inputs: one for the start time and one for
          the end time.
        </Paragraph>
        <Paragraph size={"lg"}>
          Type the start time and end time in the format HH:MM (24 hour format).
          For example 09:00 - 16:45.
        </Paragraph>
        <Paragraph size={"lg"}></Paragraph>
        <Paragraph size={"lg"}>
          If you already made the schedule but want to make changes, go to the
          Dashboard and edit that particular day.
        </Paragraph>
      </div>
    </ReactModal>
  );
}
