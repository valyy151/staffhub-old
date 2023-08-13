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
      <div className="relative mx-auto min-w-[26rem] space-y-2 rounded-md border border-slate-300 bg-white px-24 pb-6 pt-3  text-center shadow-lg dark:border-slate-700 dark:bg-slate-750">
        <Button variant={"link"} onClick={close} className="absolute right-0">
          <X size={36} />
        </Button>
        <Heading className="mb-2 mt-6" size={"sm"}>
          What are staff roles?
        </Heading>

        <Paragraph size={"lg"}>
          Staff roles are used to assign permissions to staff members.
        </Paragraph>

        <Paragraph size={"lg"}>
          For example, you can create a role called "Manager" or "Driver" and
          assign it to one of your staff members.
        </Paragraph>

        <Paragraph size={"lg"}>
          You can then use these roles when planning your schedules to know what
          roles are filled and what roles need to be filled.
        </Paragraph>
      </div>
    </ReactModal>
  );
}