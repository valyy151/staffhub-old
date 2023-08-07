import { useState } from "react";
import { getSession } from "next-auth/react";
import { Info, UserCog2 } from "lucide-react";
import Heading from "~/components/ui/Heading";
import { Button } from "~/components/ui/Button";
import { type GetServerSideProps } from "next/types";
import StaffRoleModal from "~/components/Settings/StaffRoleModal";

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
  const [showModal, setShowModal] = useState(false);

  return (
    <main className="flex flex-col items-center">
      <Heading className="mt-4">Add and manage Staff Roles</Heading>

      <section className="mt-4 flex items-center space-x-2">
        <Button size={"lg"} className="h-14 text-2xl">
          <UserCog2 size={34} className="mr-2" /> New Staff Role
        </Button>
        <Button
          size={"lg"}
          variant={"subtle"}
          className="h-14 text-2xl"
          onClick={() => setShowModal(true)}
        >
          <Info className="mr-2" /> What are Staff Roles?
        </Button>
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
