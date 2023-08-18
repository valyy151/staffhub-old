import { useState } from "react";
import { api } from "~/utils/api";
import { toast } from "react-hot-toast";
import Input from "~/components/ui/Input";
import { getSession } from "next-auth/react";
import Heading from "~/components/ui/Heading";
import { Button } from "~/components/ui/Button";
import Sidebar from "~/components/Settings/Sidebar";
import { type GetServerSideProps } from "next/types";
import { useQueryClient } from "@tanstack/react-query";
import ShiftModel from "~/components/Settings/ShiftModel";
import { ArrowLeft, Info, Save, UserCog } from "lucide-react";
import { formatTime, formatTotal } from "~/utils/dateFormatting";
import ShiftModelModal from "~/components/Settings/ShiftModelModal";

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

  const queryClient = useQueryClient();

  const { data } = api.shiftModel.find.useQuery();

  const [end, setEnd] = useState<number>(0);
  const [start, setStart] = useState<number>(0);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    createShiftModel.mutate({ start, end });
  }

  const createShiftModel = api.shiftModel.create.useMutation({
    onSuccess: () => {
      setEnd(0);
      setStart(0);
      setShowCreateModel(false);
      queryClient.invalidateQueries();
      toast.success("Shift model created");
    },

    onError: () => {
      toast.error("Error creating shift model");
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

  if (!data) {
    return <Sidebar />;
  }

  return (
    <main className="flex">
      <Sidebar />
      <section className="mt-4">
        <Heading size={"lg"} className="mb-2">
          Add and manage Shift Models
        </Heading>
        <div className="space-x-2">
          <Button
            className="h-14 text-2xl"
            onClick={() => setShowCreateModel(true)}
          >
            <UserCog className="mr-2" /> New Shift Model
          </Button>
          <Button
            variant={"subtle"}
            className="h-14 text-2xl"
            onClick={() => setShowModal(true)}
          >
            <Info className="mr-2" /> What are Shift Models?
          </Button>
        </div>
        {!showCreateModel && data.length > 0 && (
          <div>
            <Heading className="mt-4 border-b border-slate-300 py-1 dark:border-slate-500">
              My Shift Models
            </Heading>
            {data.map((shiftModel) => (
              <ShiftModel key={shiftModel.id} shiftModel={shiftModel} />
            ))}
          </div>
        )}
        {showCreateModel && (
          <form onSubmit={handleSubmit}>
            <Heading className="mb-2 mt-5">New Shift Model</Heading>
            <div className="flex space-x-2">
              <div>
                <label htmlFor="start" className="ml-2 text-xl">
                  Start
                </label>

                <Input
                  type="text"
                  name="start"
                  placeholder="Start time"
                  value={formatTime(start)}
                  className="m-0 h-14 w-44 text-xl"
                  onChange={(e) => handleTimeChange(e.target.value, "start")}
                />
              </div>

              <div>
                <label htmlFor="end" className="ml-2 text-xl">
                  End
                </label>

                <Input
                  name="end"
                  type="text"
                  placeholder="End time"
                  value={formatTime(end)}
                  className="m-0 h-14 w-44 text-xl"
                  onChange={(e) => handleTimeChange(e.target.value, "end")}
                />
              </div>
              <div>
                <label htmlFor="end" className="ml-2 text-xl">
                  Total
                </label>

                <Heading size={"xs"} className="ml-3 mt-2">
                  {formatTotal(start, end)}
                </Heading>
              </div>
            </div>
            <div className="mt-4 space-x-2">
              <Button size={"lg"} className="h-14 text-2xl">
                <Save size={28} className="mr-2" />
                Submit
              </Button>
              <Button
                size={"lg"}
                type="button"
                variant={"subtle"}
                className="h-14 text-2xl"
                onClick={() => setShowCreateModel(false)}
              >
                <ArrowLeft size={28} className="mr-2" /> Back
              </Button>
            </div>
          </form>
        )}
      </section>

      {showModal && (
        <ShiftModelModal
          showModal={showModal}
          close={() => setShowModal(false)}
        />
      )}
    </main>
  );
}
