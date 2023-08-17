import { getSession } from "next-auth/react";
import Heading from "~/components/ui/Heading";
import Sidebar from "~/components/Settings/Sidebar";
import { type GetServerSideProps } from "next/types";
import { Button } from "~/components/ui/Button";
import { ArrowLeft, Info, Save, UserCog } from "lucide-react";
import { useState } from "react";
import ShiftModelModal from "~/components/Settings/ShiftModelModal";
import Input from "~/components/ui/Input";
import { formatTime, formatTotal } from "~/utils/dateFormatting";

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

  const [end, setEnd] = useState<number>(0);
  const [start, setStart] = useState<number>(0);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
  }

  function handleTimeChange(newTime: string, field: "start" | "end") {
    const [hour, minute]: string[] = newTime.split(":");
    const newDate: any = new Date();
    newDate.setHours(hour);
    newDate.setMinutes(minute);
    const newUnixTime = Math.floor(newDate.getTime() / 1000);

    field === "start" ? setStart(newUnixTime) : setEnd(newUnixTime);
  }

  return (
    <main className="flex">
      <Sidebar />
      <section className="mt-4">
        <Heading size={"lg"} className="mb-2">
          Add and manage Shift Models
        </Heading>
        <div className="space-x-1">
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
        {/* {!showCreateModel && data.length > 0 && (
          <div>
            <Heading className="mt-4 border-b border-slate-300 py-1 dark:border-slate-500">
              My Staff Roles
            </Heading>
            {data.map((role) => (
              <StaffRole role={role} key={role.id} />
            ))}
          </div>
        )} */}
        {showCreateModel && (
          <form className="mt-4" onSubmit={handleSubmit}>
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
            <div>
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
