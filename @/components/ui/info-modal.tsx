import {
    Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle
} from '@/components/ui/dialog';

type ModalProps = {
  heading: string;
  text: { data: string[] };
  close: (showModal: boolean) => void;
};

export default function InfoModal({ text, close, heading }: ModalProps) {
  return (
    <Dialog open onOpenChange={close}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">{heading}</DialogTitle>
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
