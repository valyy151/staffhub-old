import { Info, UserCog } from "lucide-react";
import { getSession } from "next-auth/react";
import { GetServerSideProps } from "next/types";
import { useState } from "react";
import sentences from "~/data/shiftModel.json";
import { api } from "~/utils/api";
import { formatTime, formatTotal } from "~/utils/dateFormatting";

import ShiftModel from "@/components/Settings/ShiftModel";
import Sidebar from "@/components/Settings/Sidebar";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import InfoModal from "@/components/ui/info-modal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx);

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
};

export default function ShiftModelsPage() {
  const [showModal, setShowModal] = useState(false);
  const [showCreateModel, setShowCreateModel] = useState(false);

  const { toast } = useToast();

  const queryClient = useQueryClient();

  const { data } = api.shiftModel.find.useQuery();

  const [end, setEnd] = useState<number>(0);
  const [start, setStart] = useState<number>(0);

  const createShiftModel = api.shiftModel.create.useMutation({
    onSuccess: () => {
      setEnd(0);
      setStart(0);
      setShowCreateModel(false);
      queryClient.invalidateQueries();
      toast({ title: "Shift model created successfully." });
    },

    onError: () => {
      toast({
        title: "There was a problem creating the shift model.",
        variant: "destructive",
      });
    },
  });

  function handleTimeChange(newTime: string, field: "start" | "end") {
    const [hour, minute]: string[] = newTime.split(":");
    const newDate: any = new Date();
    newDate.setHours(hour);
    newDate.setMinutes(minute);
    const newUnixTime = Math.floor(newDate.getTime() / 1000);

    field === "start" ? setStart(newUnixTime) : setEnd(newUnixTime);
  }

  function handleSubmit() {
    if (!start || !end) {
      return toast({
        title: "Please enter a start and end time.",
      });
    }

    createShiftModel.mutate({ start, end });
  }

  if (!data) {
    return (
      <main className="flex">
        <Sidebar />
        <div role="status" className="ml-64 mt-16">
          <svg
            aria-hidden="true"
            className="mr-2 h-8 w-8 animate-spin fill-gray-800 text-gray-300 dark:fill-gray-200 dark:text-gray-600"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <span className="sr-only">Loading...</span>
        </div>
      </main>
    );
  }

  return (
    <main className="flex">
      <Sidebar />
      <section className="mt-4">
        <Heading size={"sm"} className="mb-2">
          Add and manage Shift Models
        </Heading>
        <div className="space-x-2">
          <Button size={"lg"} onClick={() => setShowCreateModel(true)}>
            <UserCog className="mr-2" /> New Shift Model
          </Button>
          <Button
            size={"lg"}
            variant={"subtle"}
            onClick={() => setShowModal(true)}
          >
            <Info className="mr-2" /> What are Shift Models?
          </Button>
        </div>
        {data.length > 0 && (
          <div>
            <Heading className="mt-4 border-b   py-1">My Shift Models</Heading>
            {data
              .sort((a, b) => a.start - b.start)
              .map((shiftModel) => (
                <ShiftModel key={shiftModel.id} shiftModel={shiftModel} />
              ))}
          </div>
        )}
        {showCreateModel && (
          <AlertDialog open>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle> New Shift Model</AlertDialogTitle>
              </AlertDialogHeader>
              <div className="flex space-x-2">
                <div>
                  <Label htmlFor="start">Start</Label>

                  <Input
                    type="text"
                    name="start"
                    className="w-44"
                    placeholder="Start time"
                    value={formatTime(start)}
                    onKeyDown={(e) => {
                      if (e.key === "Backspace") {
                        e.currentTarget.select();
                        handleTimeChange("", "start");
                      }
                    }}
                    onChange={(e) => handleTimeChange(e.target.value, "start")}
                  />
                </div>

                <div>
                  <Label htmlFor="end">End</Label>

                  <Input
                    name="end"
                    type="text"
                    className="w-44"
                    placeholder="End time"
                    value={formatTime(end)}
                    onKeyDown={(e) => {
                      if (e.key === "Backspace") {
                        e.currentTarget.select();
                        handleTimeChange("", "end");
                      }
                    }}
                    onChange={(e) => handleTimeChange(e.target.value, "end")}
                  />
                </div>
                <div>
                  <Label htmlFor="end" className="ml-2">
                    Total
                  </Label>

                  <Heading size={"xxs"} className="ml-2 mt-2">
                    {formatTotal(start, end)}
                  </Heading>
                </div>
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setShowCreateModel(false)}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction onClick={handleSubmit}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </section>

      {showModal && (
        <InfoModal
          text={sentences}
          heading={"What are Shift Models?"}
          close={() => setShowModal(false)}
        />
      )}
    </main>
  );
}
