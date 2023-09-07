import { X } from "lucide-react";
import ReactModal from "react-modal";
import Heading from "../ui/Heading";
import { Button } from "../ui/Button";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { type MouseEventHandler } from "react";

type ModalProps = {
  value: Date;
  showModal: boolean;
  lastDay: number | undefined;
  firstDay: number | undefined;
  setValue: (date: Date) => void;
  close: MouseEventHandler<HTMLButtonElement>;
};

export default function CalendarModal({
  close,
  value,
  lastDay,
  setValue,
  firstDay,
  showModal,
}: ModalProps) {
  return (
    <ReactModal
      isOpen={showModal}
      className="fixed inset-0 flex items-center justify-center bg-[rgba(16,17,30,0.7)]"
    >
      <div className="mx-auto min-w-[26rem] max-w-3xl animate-fade rounded-xl border border-slate-300 bg-white px-2 pb-6 pt-2  text-left shadow-lg dark:border-slate-600 dark:bg-slate-750">
        <div className="flex">
          <div className="ml-auto">
            {" "}
            <Button variant={"ghost"} onClick={close}>
              <X size={30} />
            </Button>
          </div>
        </div>

        <div className="flex flex-col px-8 py-2">
          <Heading size={"xs"} className="mb-1 ml-1">
            Choose a month
          </Heading>
          <Calendar
            view="month"
            maxDetail="year"
            next2Label={null}
            prev2Label={null}
            activeStartDate={value!}
            maxDate={new Date(1000 * lastDay!)}
            minDate={new Date(1000 * firstDay!)}
            onChange={(value: any, e) => {
              setValue(value);
              close(e);
            }}
          />
        </div>
      </div>
    </ReactModal>
  );
}
