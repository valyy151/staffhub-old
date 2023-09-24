import { X } from "lucide-react";
import Heading from "./heading";
import ReactModal from "react-modal";
import { type MouseEventHandler } from "react";
import { Button } from "@/components/ui/button";
import Paragraph from "./paragraph";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type ModalProps = {
  heading: string;
  text: { data: string[] };
  close: (showModal: boolean) => void;
};

export default function InfoModal({ text, close, heading }: ModalProps) {
  return (
    <Dialog open onOpenChange={close}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl">{heading}</DialogTitle>
          {text.data.map((paragraph) => (
            <DialogDescription className="text-md pb-2">
              {paragraph}
            </DialogDescription>
          ))}
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
