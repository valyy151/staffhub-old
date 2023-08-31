import Heading from "./Heading";
import { Button } from "./Button";
import ReactModal from "react-modal";
import { type MouseEventHandler } from "react";
import Paragraph from "./Paragraph";

interface ModalProps {
  text: string;
  heading?: string;
  showModal: boolean;
  cancel: MouseEventHandler<HTMLButtonElement>;
  submit: MouseEventHandler<HTMLButtonElement>;
}

export default function FormModal({
  text,
  submit,
  cancel,
  heading,
  showModal,
}: ModalProps) {
  return (
    <ReactModal
      isOpen={showModal}
      className="fixed inset-0 flex items-center justify-center bg-[rgba(16,17,30,0.7)]"
    >
      <div className="mx-auto min-w-[26rem] max-w-3xl animate-fade rounded-xl border border-slate-300 bg-white px-12 pb-6 text-left shadow-lg dark:border-slate-600 dark:bg-slate-700">
        <Heading size={"xs"} className="mb-2 mt-8">
          {heading}
        </Heading>
        <Paragraph className="font-normal">{text}</Paragraph>
        <div className="mt-6 flex h-full justify-end space-x-2">
          <Button size={"lg"} onClick={cancel} className="text-xl">
            No
          </Button>
          <Button
            size={"lg"}
            variant="danger"
            onClick={submit}
            className="text-xl"
          >
            Yes
          </Button>
        </div>
      </div>
    </ReactModal>
  );
}
