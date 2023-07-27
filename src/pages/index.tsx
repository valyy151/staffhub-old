import { useSession } from "next-auth/react";
import Heading from "~/components/ui/Heading";

export default function Home() {
  const { data, status } = useSession();

  return (
    <main className="mt-8 text-center text-2xl">
      <Heading>
        Hello {status === "authenticated" ? data?.user.name : "World"}
      </Heading>
    </main>
  );
}
