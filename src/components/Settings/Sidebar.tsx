import { useRouter } from "next/router";
import { User2, ArrowLeft, ScrollText } from "lucide-react";

export default function Sidebar() {
  const router = useRouter();
  const path = router.asPath.split("/")[2];

  return (
    <div className="mr-[26rem]">
      <ul className="fixed h-full w-fit border-r border-slate-500 text-2xl">
        <li
          onClick={() => router.back()}
          className="flex w-96 cursor-pointer items-center p-4 hover:bg-slate-150 dark:hover:bg-slate-750"
        >
          <ArrowLeft className="mr-2" /> Back
        </li>
        <li
          onClick={() => router.push(`/settings/roles`)}
          className={`flex w-96 cursor-pointer items-center p-4 ${
            path === "roles"
              ? "bg-slate-200 text-sky-600 dark:bg-slate-700 dark:text-sky-400"
              : "hover:bg-slate-150 dark:hover:bg-slate-750"
          }`}
        >
          <User2 className="mr-2" /> Staff Roles
        </li>
        <li
          onClick={() => router.push(`/settings/shift-models`)}
          className={`flex w-96 cursor-pointer items-center p-4 ${
            path === "shift-models"
              ? "bg-slate-200 text-sky-600 dark:bg-slate-700 dark:text-sky-400"
              : "hover:bg-slate-150 dark:hover:bg-slate-750"
          }`}
        >
          <ScrollText className="mr-2" /> Shift Models
        </li>
      </ul>
    </div>
  );
}
