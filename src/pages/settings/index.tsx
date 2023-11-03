import { getSession, useSession } from "next-auth/react";
import Head from "next/head";
import { GetServerSideProps } from "next/types";
import { useState } from "react";
import { api } from "~/utils/api";

import { Button } from "@/components/ui/button";
import FormModal from "@/components/ui/form-modal";
import Heading from "@/components/ui/heading";
import { useToast } from "@/components/ui/use-toast";

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

  const { toast } = useToast();

  const deleteUser = api.user.delete.useMutation({
    onSuccess: () => {
      setShowModal(false);
      toast({
        title: "Account deleted successfully.",
      });

      setTimeout(() => {
        window.location.href = "/";
      }, 2000);
    },

    onError: () => {
      toast({
        title: "There was a problem deleting your account.",
        variant: "destructive",
      });
    },
  });

  return (
    <main className="mx-auto flex w-fit flex-col items-center">
      <Head>
        <title>Settings | StaffHub</title>
        <meta name="Settings" content="Manage your account" />
      </Head>
      <Heading className="mt-4">{data?.user.name}</Heading>

      {/* <Button
       
        variant={"subtle"}
        className="mt-2 h-14 w-56"
        onClick={() => router.push("/settings/theme")}
      >
        <Palette className="mr-2" /> Theme
      </Button> */}

      <Button variant={"danger"} onClick={() => setShowModal(true)} className="mt-2 w-full">
        Delete My Account
      </Button>

      {showModal && (
        <FormModal
          showModal={showModal}
          cancel={() => setShowModal(false)}
          submit={() => deleteUser.mutate()}
          heading="Are you sure you want to delete your account?"
          text="You will also lose all the data that you have. This change is not reversible."
        />
      )}
    </main>
  );
}
