import { useState } from "react";
import { getSession } from "next-auth/react";
import Heading from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { type GetServerSideProps } from "next/types";
import sentences from "~/data/staffRole.json";
import { Input } from "@/components/ui/input";
import { api } from "~/utils/api";
import { useToast } from "@/components/ui/use-toast";
import Sidebar from "@/components/Settings/Sidebar";
import { useQueryClient } from "@tanstack/react-query";
import InfoModal from "@/components/ui/info-modal";
import { Label } from "@/components/ui/label";
import StaffRole from "@/components/Settings/StaffRole";
import { ArrowLeft, Info, Save, UserCog } from "lucide-react";

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

export default function StaffRolesPage() {
  const [role, setRole] = useState("");
  const [number, setNumber] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [showCreateRole, setShowCreateRole] = useState(false);

  const { toast } = useToast();

  const queryClient = useQueryClient();

  const { data } = api.staffRole.find.useQuery();

  const createStaffRole = api.staffRole.create.useMutation({
    onSuccess: ({ name }) => {
      toast({
        title: `Staff Role ${name} created successfully.`,
      });
      setRole("");
      setNumber("");
      setShowCreateRole(false);
      queryClient.invalidateQueries();
    },

    onError: () => {
      toast({
        title: "There was a problem creating the staff role.",
        variant: "destructive",
      });
    },
  });

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!role) {
      return toast({
        title: "Please enter a role name.",
      });
    }

    createStaffRole.mutate({
      name: role,
      numberPerDay: parseInt(number) | 0,
    });
  }

  if (!data) {
    return (
      <main className="flex">
        <Sidebar />
        <div role="status" className="ml-64 mt-16">
          <svg
            aria-hidden="true"
            className="mr-2 h-8 w-8 animate-spin fill-slate-800 text-gray-300 dark:fill-slate-200 dark:text-gray-600"
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
      <div className="hidden sm:block">
        <Sidebar />
      </div>
      <section className="mt-4">
        <Heading size={"sm"} className="mb-2">
          Add and manage Staff Roles
        </Heading>
        <div className="space-x-1">
          <Button size={"lg"} onClick={() => setShowCreateRole(true)}>
            <UserCog className="mr-2" /> New Staff Role
          </Button>
          <Button
            size={"lg"}
            variant={"subtle"}
            onClick={() => setShowModal(true)}
          >
            <Info className="mr-2" /> What are Staff Roles?
          </Button>
        </div>
        {!showCreateRole && data.length > 0 && (
          <div>
            <Heading className="mt-4 border-b border-slate-300 py-1 dark:border-slate-500">
              My Staff Roles
            </Heading>
            {data
              .sort((a, b) => a.numberPerDay! - b.numberPerDay!)
              .map((role) => (
                <StaffRole role={role} key={role.id} />
              ))}
          </div>
        )}
        {showCreateRole && (
          <form className="mt-4" onSubmit={handleSubmit}>
            <Label>Staff Role</Label>
            <Input
              value={role}
              className="mb-4"
              placeholder="Enter the role name..."
              onChange={(e) => setRole(e.target.value)}
            />
            <Label>
              How many staff members with this role do you need in one work day?
              <br />
              (Leave blank if not sure)
            </Label>
            <Input
              type="number"
              value={number}
              placeholder="Enter the number..."
              onChange={(e) => setNumber(parseInt(e.target.value).toString())}
              className="[appearance:textfield]  [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
            <div className="mt-4 space-x-2">
              <Button size={"lg"}>
                <Save className="mr-2" />
                Submit
              </Button>
              <Button
                size={"lg"}
                type="button"
                variant={"subtle"}
                onClick={() => setShowCreateRole(false)}
              >
                <ArrowLeft className="mr-2" /> Back
              </Button>
            </div>
          </form>
        )}
      </section>

      {showModal && (
        <InfoModal
          text={sentences}
          showModal={showModal}
          heading="What are Staff Roles?"
          close={() => setShowModal(false)}
        />
      )}
    </main>
  );
}
