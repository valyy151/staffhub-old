import { ArrowLeft } from "lucide-react";
import { useSession } from "next-auth/react";
import router from "next/router";
import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "~/components/ui/Button";
import Heading from "~/components/ui/Heading";
import Modal from "~/components/ui/Modal";
import { api } from "~/utils/api";

export default function SettingsPage() {
  const { data } = useSession();
  const [showModal, setShowModal] = useState(false);

  const deleteUser = api.user.delete.useMutation({
    onSuccess: () => {
      window.location.href = "/";
    },

    onError: () => {
      toast.error("There was an error deleting your account.");
    },
  });

  function handleDelete() {
    deleteUser.mutate(data?.user?.id ?? "");
  }

  return (
    <main className="flex flex-col items-center">
      <Heading size={"lg"} className="mt-4">
        {data?.user.name}
      </Heading>
      <Button
        size="lg"
        variant={"subtle"}
        className="mt-4 h-14 w-72 text-2xl"
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
          submit={handleDelete}
          icon="employee"
          showModal={showModal}
          cancel={() => setShowModal(false)}
          text=" Are you sure you want to delete your account? You will also lose all the data that you have. This change is not reversible."
        />
      )}
    </main>
  );
}
