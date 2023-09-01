import { X } from "lucide-react";
import Heading from "../ui/Heading";
import ReactModal from "react-modal";
import { Button } from "../ui/Button";
import { type MouseEventHandler } from "react";
import Paragraph from "~/components/ui/Paragraph";

interface ModalProps {
  text: { data: string[] };
  heading: string;
  showModal: boolean;
  close: MouseEventHandler<HTMLButtonElement>;
}

export default function InfoModal({
  close,
  text,
  heading,
  showModal,
}: ModalProps) {
  return (
    <ReactModal
      isOpen={showModal}
      className="fixed inset-0 flex items-center justify-center bg-[rgba(16,17,30,0.7)]"
    >
      <div className="relative mx-auto min-w-[26rem] animate-fade space-y-1 rounded-md border border-slate-300 bg-white pb-12 pl-12 pr-24 pt-3 shadow-lg dark:border-slate-700 dark:bg-slate-750">
        <Button
          variant={"link"}
          onClick={close}
          className="absolute right-0 focus:ring-0 focus:ring-offset-0"
        >
          <X size={36} />
        </Button>
        <Heading className="mb-2 pt-4" size={"sm"}>
          {heading}
        </Heading>

        <div className="space-y-2">
          {text.data.map((text) => (
            <Paragraph key={text}>{text}</Paragraph>
          ))}
        </div>
      </div>
    </ReactModal>
  );
}
