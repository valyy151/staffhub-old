import router from "next/router";
import { useState } from "react";
import { api } from "~/utils/api";
import toast from "react-hot-toast";
import Modal from "~/components/ui/Modal";
import Heading from "~/components/ui/Heading";
import { Button } from "~/components/ui/Button";
import { type GetServerSideProps } from "next/types";
import { getSession, useSession } from "next-auth/react";
import { ArrowLeft, Clock8, UserCog2 } from "lucide-react";

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

export default function SettingsPage() {
  const { data } = useSession();
  const [showModal, setShowModal] = useState(false);

  const deleteUser = api.user.delete.useMutation({
    onSuccess: () => {
      setShowModal(false);
      toast.success("Your account has successfully been deleted.", {
        className: "text-center text-xl",
      });

      setTimeout(() => {
        window.location.href = "/";
      }, 2000);
    },

    onError: () => {
      toast.error("There was an error deleting your account.", {
        className: "text-center text-xl",
      });
    },
  });

  return (
    <main className="flex flex-col items-center">
      <Heading size={"lg"} className="mt-4">
        {data?.user.name}
      </Heading>

      <Button
        size="lg"
        variant={"subtle"}
        className="mt-4 h-14 w-72 text-2xl"
        onClick={() => router.push("/settings/roles")}
      >
        <UserCog2 size={34} className="mr-2" /> Staff Roles
      </Button>

      <Button
        size="lg"
        variant={"subtle"}
        className="mt-2 h-14 w-72 text-2xl"
        onClick={() => router.push("/settings/shift-models")}
      >
        <Clock8 className="mr-2" /> Shift Models
      </Button>

      <Button
        size="lg"
        variant={"subtle"}
        className="mt-8 h-14 w-72 text-2xl"
        onClick={() => router.push("/")}
      >
        <ArrowLeft className="mr-2" /> Go Back
      </Button>

      <Button
        size="lg"
        variant={"danger"}
        className="mt-2 h-14 w-72 text-2xl"
        onClick={() => setShowModal(true)}
      >
        Delete My Account
      </Button>

      {showModal && (
        <Modal
          submit={() => deleteUser.mutate()}
          icon="employee"
          showModal={showModal}
          cancel={() => setShowModal(false)}
          text=" Are you sure you want to delete your account? You will also lose all the data that you have. This change is not reversible."
        />
      )}
    </main>
  );
}
