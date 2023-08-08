import { useState } from "react";
import { getSession } from "next-auth/react";
import { ArrowLeft, Info, Save, UserCog } from "lucide-react";
import Heading from "~/components/ui/Heading";
import { Button } from "~/components/ui/Button";
import { type GetServerSideProps } from "next/types";
import StaffRoleModal from "~/components/Settings/StaffRoleModal";
import Input from "~/components/ui/Input";
import { api } from "~/utils/api";
import toast from "react-hot-toast";
import Sidebar from "~/components/Settings/Sidebar";
import { useQueryClient } from "@tanstack/react-query";
import Paragraph from "~/components/ui/Paragraph";

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

  const queryClient = useQueryClient();

  const { data } = api.staffRole.find.useQuery();

  const createStaffRole = api.staffRole.create.useMutation({
    onSuccess: () => {
      toast.success("Staff Role Created", {
        className: "text-xl text-center",
      });
      setShowCreateRole(false);
      queryClient.invalidateQueries();
    },

    onError: () => {
      toast.error("Failed to create Staff Role", {
        className: "text-xl text-center",
      });
    },
  });

  const deleteStaffRole = api.staffRole.delete.useMutation({
    onSuccess: () => {
      toast.success("Staff Role Deleted", {
        className: "text-xl text-center",
      });
      queryClient.invalidateQueries();
    },

    onError: () => {
      toast.error("Failed to delete Staff Role", {
        className: "text-xl text-center",
      });
    },
  });

  if (!data) {
    return <Sidebar />;
  }

  return (
    <main className="flex">
      <Sidebar />
      <section className="mt-4">
        <Heading size={"lg"} className="mb-2">
          Add and manage Staff Roles
        </Heading>
        <div className="space-x-1">
          <Button
            className="h-14 text-2xl"
            onClick={() => setShowCreateRole(true)}
          >
            <UserCog className="mr-2" /> New Staff Role
          </Button>
          <Button
            variant={"subtle"}
            className="h-14 text-2xl"
            onClick={() => setShowModal(true)}
          >
            <Info className="mr-2" /> What are Staff Roles?
          </Button>
        </div>
        {data.length > 0 && (
          <div>
            <Heading className="mt-4 border-b border-slate-300 py-1 dark:border-slate-500">
              My Staff Roles
            </Heading>
            {data.map((role, index) => (
              <div
                key={index}
                className="flex items-center justify-between border-b border-slate-300 py-2 dark:border-slate-500"
              >
                <div className="flex items-center space-x-2">
                  <UserCog size={28} />
                  <Heading size={"xs"}>{role.name}</Heading>
                </div>
                <div className="flex items-center space-x-2">
                  {role.numberPerDay !== null && role.numberPerDay > 0 && (
                    <>
                      <Paragraph size={"lg"} className="text-2xl">
                        Minimum
                      </Paragraph>
                      <Paragraph size={"lg"} className="text-2xl font-bold">
                        {role.numberPerDay}
                      </Paragraph>
                      <Paragraph size={"lg"} className="text-2xl">
                        per work day
                      </Paragraph>
                    </>
                  )}

                  <Button
                    variant={"subtle"}
                    className="h-14 text-2xl"
                    onClick={() => deleteStaffRole.mutate({ id: role.id })}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
        {showCreateRole && (
          <form
            className="mt-4"
            onSubmit={() =>
              createStaffRole.mutate({
                name: role,
                numberPerDay: parseInt(number) | 0,
              })
            }
          >
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
