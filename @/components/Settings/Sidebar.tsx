import { useRouter } from "next/router";
import { User2, ArrowLeft, ScrollText } from "lucide-react";
import Link from "next/link";

export default function Sidebar() {
  const router = useRouter();
  const path = router.asPath.split("/")[2];

  return (
    <aside className="sticky top-0 mr-4 h-screen w-56 bg-gray-100 p-4 text-gray-800 dark:bg-gray-800">
      <nav className="space-y-2">
        <Link
          href="/settings/roles"
          className={`flex w-full items-center space-x-2 rounded-lg px-2 py-2 ${
            path === "roles"
              ? "bg-gray-200 text-gray-800 active:bg-gray-300 dark:bg-gray-700 dark:text-gray-200"
              : "text-gray-500 hover:bg-gray-200 active:bg-gray-300  dark:text-gray-400 dark:hover:bg-gray-700"
          }`}
        >
          <User2 />
          <span className="text-sm font-medium">Staff Roles</span>
        </Link>
        <Link
          href="/settings/shift-models"
          className={`flex w-full items-center space-x-2 rounded-lg px-2 py-2 ${
            path === "shift-models"
              ? "bg-gray-200 text-gray-800 active:bg-gray-300 dark:bg-gray-700 dark:text-gray-200"
              : "text-gray-500 hover:bg-gray-200 active:bg-gray-300  dark:text-gray-400 dark:hover:bg-gray-700"
          }`}
        >
          <ScrollText />
          <span className="text-sm font-medium">Shift Models</span>
        </Link>
      </nav>
    </aside>
  );
}
