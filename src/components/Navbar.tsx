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
      <div className="container mx-auto flex w-full items-center justify-between">
        <div className="flex w-1/2 items-center">
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

        <div className="hidden w-1/2 justify-end gap-4 md:flex">
          {session.status === "authenticated" ? (
            <>
              <Link className={buttonVariants()} href="/dashboard">
                Dashboard
              </Link>
              <Link
                href="/documentation"
                className={buttonVariants({ variant: "subtle" })}
              >
                Documentation
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
