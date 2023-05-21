import Heading from "./Heading";
import { Button } from "./Button";
import ReactModal from "react-modal";
import { Check, X } from "lucide-react";

interface ModalProps {
  text: string;
  cancel: any;
  submit: any;
  showModal: boolean;
}

export default function Modal({ text, submit, cancel, showModal }: ModalProps) {
  return (
    <ReactModal
      isOpen={showModal}
      className="fixed inset-0 flex items-center justify-center bg-[rgba(16,17,30,0.7)]"
    >
      <div className="mx-auto h-56 w-[42rem] rounded-md bg-white p-6 text-center shadow-lg dark:bg-slate-700">
        <Heading size={"xs"} className="mt-8 font-normal">
          {text}
        </Heading>
        <div className="mt-6 flex h-full justify-center space-x-2">
          <Button variant="danger" onClick={submit}>
            Yes <Check className="ml-2" />
          </Button>
          <Button variant="outline" onClick={cancel}>
            No <X className="ml-2" />
          </Button>
        </div>
      </div>
    </ReactModal>
  );
}
