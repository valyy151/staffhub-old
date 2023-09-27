import { ScrollText, User2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Sidebar() {
  const router = useRouter();
  const path = router.asPath.split("/")[2];

  return (
    <aside className="sticky top-0 mr-4 h-screen w-56 border-r p-4">
      <nav className="space-y-2">
        <Link
          href="/settings/roles"
          className={`flex w-full items-center space-x-2 rounded-lg px-2 py-2 hover:bg-accent ${
            path === "roles" && "bg-secondary"
          }`}
        >
          <User2 />
          <span className="text-sm font-medium">Staff Roles</span>
        </Link>
        <Link
          href="/settings/shift-models"
          className={`flex w-full items-center space-x-2 rounded-lg px-2 py-2 hover:bg-accent ${
            path === "shift-models" && "bg-secondary"
          }`}
        >
          <ScrollText />
          <span className="text-sm font-medium">Shift Models</span>
        </Link>
      </nav>
    </aside>
  );
}
