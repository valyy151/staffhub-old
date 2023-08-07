import { useState } from "react";
import { getSession } from "next-auth/react";
import { ArrowLeft, Info, Save, UserCog2 } from "lucide-react";
import Heading from "~/components/ui/Heading";
import { Button } from "~/components/ui/Button";
import { type GetServerSideProps } from "next/types";
import StaffRoleModal from "~/components/Settings/StaffRoleModal";
import Input from "~/components/ui/Input";
import { api } from "~/utils/api";
import toast from "react-hot-toast";

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

  const createStaffRole = api.staffRole.create.useMutation({
    onSuccess: () => {
      toast.success("Staff Role Created", {
        className: "text-xl text-center",
      });
    },
  });

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    createStaffRole.mutate({ name: role, numberPerDay: parseInt(number) });
  }

  return (
    <main className="mx-auto flex w-fit flex-col items-center">
      <section className="mt-4 flex flex-col items-start">
        <Heading className="mb-2">Add and manage Staff Roles</Heading>
        <Button
          size={"lg"}
          className="h-14 w-96 text-2xl"
          onClick={() => setShowCreateRole(true)}
        >
          <UserCog2 size={34} className="mr-2" /> New Staff Role
        </Button>
        <Button
          size={"lg"}
          variant={"subtle"}
          className="mt-2 h-14 w-96 text-2xl"
          onClick={() => setShowModal(true)}
        >
          <Info className="mr-2" /> What are Staff Roles?
        </Button>

        {showCreateRole && (
          <form className="mt-4" onSubmit={handleSubmit}>
            <label className="text-xl">Staff Role</label>
            <Input
              value={role}
              className="mb-4 h-14 text-2xl"
              placeholder="Enter the role name..."
              onChange={(e) => setRole(e.target.value)}
            />
            <label className="text-xl">
              How many staff members with this role do you need in one work day?
              <br />
              (Leave blank if not sure)
            </label>
            <Input
              type="number"
              value={number}
              placeholder="Enter the number..."
              onChange={(e) => setNumber(parseInt(e.target.value).toString())}
              className="h-14 text-2xl [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
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
                onClick={() => setShowCreateRole(false)}
              >
                <ArrowLeft size={28} className="mr-2" /> Back
              </Button>
            </div>
          </form>
        )}
      </section>

      {showModal && (
        <StaffRoleModal
          showModal={showModal}
          close={() => setShowModal(false)}
        />
      )}
    </main>
  );
}
