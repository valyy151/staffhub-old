import { api } from "~/utils/api";

export default function Home() {
  const { data } = api.example.hello.useQuery({ text: "World" });

  return <main className="mt-8 text-center text-2xl">{data?.greeting}</main>;
}
