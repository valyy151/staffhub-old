import { getSession } from "next-auth/react";
import { type GetServerSideProps } from "next/types";
import Sidebar from "~/components/Settings/Sidebar";
import Heading from "~/components/ui/Heading";

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
  return (
    <main className="flex">
      <Sidebar />
      <div className="mt-4">
        <Heading size={"lg"}>Coming soon</Heading>
      </div>
    </main>
  );
}
