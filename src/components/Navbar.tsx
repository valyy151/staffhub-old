import Link from "next/link.js";
import { useState } from "react";
import { Button, buttonVariants } from "./ui/Button";
import { useSession, signIn, signOut } from "next-auth/react";
import ThemeSwitcher from "./ThemeSwitcher";

export default function Navbar() {
  const session = useSession();

  const [dropdown, showDropdown] = useState<boolean>(false);

  return (
    <div className="sticky top-0 z-50 flex h-20 items-center justify-between border-b border-slate-300 bg-white shadow-sm backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900">
      <div className="container mx-auto grid w-full grid-cols-3 place-items-center items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            href="/"
            className={`${buttonVariants({ variant: "ghost" })} text-xl`}
          >
            StaffHub
          </Link>
          <ThemeSwitcher />
        </div>

        <div className="md:hidden">
          <ThemeSwitcher />
        </div>

        <div className="space-x-4">
          <Link
            href={"/employees"}
            className={`${buttonVariants({ variant: "ghost" })}`}
          >
            Your Staff
          </Link>
          <Link
            href={"/schedules"}
            className={`${buttonVariants({ variant: "ghost" })}`}
          >
            New Schedule
          </Link>
        </div>

        <div className="hidden space-x-4 md:flex">
          {session.status === "authenticated" ? (
            <>
              <Link href="/dashboard" className={buttonVariants()}>
                Dashboard
              </Link>

              <Button variant={"destructive"} onClick={() => signOut()}>
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Link
                href="/documentation"
                className={buttonVariants({ variant: "subtle" })}
              >
                Documentation
              </Link>
              <Button onClick={() => signIn("google")}>Sign In</Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
