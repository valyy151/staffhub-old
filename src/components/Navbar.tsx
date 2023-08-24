import Link from "next/link.js";
import ThemeSwitcher from "./ThemeSwitcher";
import { Button, buttonVariants } from "./ui/Button";
import { useSession, signIn, signOut } from "next-auth/react";
import { useState } from "react";
import { AlignJustify, FlipVertical } from "lucide-react";

export default function Navbar() {
  const { status } = useSession();
  const [showMenu, setShowMenu] = useState(false);

  const sidebarLinks = (
    <div className="flex flex-col">
      <Link href="/dashboard" className={buttonVariants({ variant: "ghost" })}>
        Dashboard
      </Link>
      <Link
        href={"/staff"}
        className={`${buttonVariants({ variant: "ghost" })} w-full`}
      >
        Your Staff
      </Link>

      <Link
        href={"/schedule"}
        className={`${buttonVariants({ variant: "ghost" })} w-full`}
      >
        New Schedule
      </Link>

      <Link
        href="/documentation"
        className={buttonVariants({ variant: "ghost" })}
      >
        Documentation
      </Link>

      <Button variant={"destructive"} onClick={() => signOut()}>
        Sign Out
      </Button>
    </div>
  );

  const authenticatedLinks = (
    <>
      <div className="hidden justify-center space-x-2 sm:flex lg:w-1/3">
        <Link
          href={"/staff"}
          className={`${buttonVariants({ variant: "ghost" })}`}
        >
          Your Staff
        </Link>

        <Link
          href={"/schedule"}
          className={`${buttonVariants({ variant: "ghost" })}`}
        >
          New Schedule
        </Link>
      </div>

      <div className="hidden justify-center space-x-2 sm:flex lg:w-1/3">
        <Link href="/dashboard" className={buttonVariants()}>
          Dashboard
        </Link>

        <Link
          href="/documentation"
          className={buttonVariants({ variant: "subtler" })}
        >
          Documentation
        </Link>

        <Button variant={"destructive"} onClick={() => signOut()}>
          Sign Out
        </Button>
      </div>
    </>
  );

  const unauthenticatedLinks = (
    <div className="ml-auto hidden justify-center space-x-2 sm:flex lg:w-1/3">
      <Link
        href="/documentation"
        className={buttonVariants({ variant: "subtler" })}
      >
        Documentation
      </Link>

      <Button onClick={() => signIn("google")}>Sign In</Button>
    </div>
  );

  if (status === "loading") {
    return null;
  }

  return (
    <div className="sticky top-0 z-50 flex h-20 items-center justify-between border-b border-slate-300 bg-white shadow-sm backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900">
      <div className="container mx-auto flex">
        <div className="hidden items-center justify-center space-x-4 sm:flex lg:w-1/3">
          <Link
            href="/"
            className={`${buttonVariants({ variant: "ghost" })} text-xl`}
          >
            StaffHub
          </Link>

          <ThemeSwitcher />
        </div>

        {status === "authenticated" ? authenticatedLinks : unauthenticatedLinks}

        <div className="ml-4 sm:hidden">
          <ThemeSwitcher />
        </div>

        <Button
          variant={"link"}
          className="ml-auto mr-4 sm:hidden"
          onClick={() => setShowMenu(!showMenu)}
        >
          <AlignJustify size={30} />
        </Button>

        {showMenu && (
          <div className="absolute right-0 top-20 z-50 w-64 rounded border border-slate-300 bg-white p-4 shadow-lg dark:border-slate-700 dark:bg-slate-900">
            {sidebarLinks}
          </div>
        )}
      </div>
    </div>
  );
}
