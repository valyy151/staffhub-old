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
      <div className="relative mx-auto min-w-[26rem] animate-fade space-y-2 rounded-md border border-slate-300 bg-white px-24 pb-6 pt-3  text-center shadow-lg dark:border-slate-700 dark:bg-slate-750">
        <Button variant={"link"} onClick={close} className="absolute right-0">
          <X size={36} />
        </Button>
        <Heading className="mb-2 mt-6" size={"sm"}>
          What are shift models?
        </Heading>

        <Paragraph size={"lg"}></Paragraph>

        <Paragraph size={"lg"}></Paragraph>

        <Paragraph size={"lg"}></Paragraph>
      </div>
    </ReactModal>
  );
}
