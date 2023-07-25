import { useSession } from "next-auth/react";
import Heading from "~/components/ui/Heading";
import Spinner from "~/components/ui/Spinner";

export default function Home() {
  const { data, status } = useSession();

  if (!data) {
    return <Spinner />;
  }

  return (
    <main className="mt-8 text-center text-2xl">
      <Heading>
        Hello {status === "authenticated" ? data?.user.name : "World"}
      </Heading>
    </main>
  );
}
