import { useSession } from "next-auth/react";

export default function Home() {
  const { data, status } = useSession();

  return (
    <main className="mt-8 text-center text-2xl">
      Hello {status === "authenticated" ? data?.user.name : "World"}
    </main>
  );
}
