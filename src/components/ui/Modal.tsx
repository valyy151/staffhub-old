import Heading from "./Heading";
import { Button } from "./Button";
import ReactModal from "react-modal";
import { Trash2, UserX2 } from "lucide-react";
import { UserCheck2 } from "lucide-react";
import { type MouseEventHandler } from "react";

interface ModalProps {
  text: string;
  icon?: string;
  showModal: boolean;
  cancel: MouseEventHandler<HTMLButtonElement>;
  submit: MouseEventHandler<HTMLButtonElement>;
}

export default function Modal({
  icon,
  text,
  submit,
  cancel,
  showModal,
}: ModalProps) {
  return (
    <ReactModal
      isOpen={showModal}
      className="fixed inset-0 flex items-center justify-center bg-[rgba(16,17,30,0.7)]"
    >
      <div className="mx-auto min-w-[26rem] max-w-3xl rounded-xl border border-slate-300 bg-white px-12 pb-6 text-left shadow-lg dark:border-slate-600 dark:bg-slate-700">
        <Heading size={"xs"} className="mt-8 font-normal">
          {text}
        </Heading>
        <div className="mt-6 flex h-full justify-end space-x-2">
          <Button size={"lg"} onClick={cancel} className="text-xl">
            {icon === "employee" && <UserCheck2 size={30} className="mr-2" />}No
          </Button>
          <Button
            size={"lg"}
            variant="danger"
            onClick={submit}
            className="text-xl"
          >
            {icon === "employee" && <UserX2 size={30} className="mr-2" />} Yes
          </Button>
        </div>
      </div>
    </ReactModal>
  );
}
