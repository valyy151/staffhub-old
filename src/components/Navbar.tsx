import Link from "next/link.js";
import ThemeSwitcher from "./ThemeSwitcher";
import { Button, buttonVariants } from "./ui/Button";
import { useSession, signIn, signOut } from "next-auth/react";
import router from "next/router";

export default function Navbar() {
  const { status } = useSession();

  const authenticatedLinks = (
    <div className="w-[26rem] space-x-2">
      <Link href="/dashboard" className={buttonVariants()}>
        Dashboard
      </Link>

      <Link
        href="/documentation"
        className={buttonVariants({ variant: "subtler" })}
      >
        Documentation
      </Link>

      <Button
        variant={"destructive"}
        onClick={() => {
          void signOut();
          router.push("/");
        }}
      >
        Sign Out
      </Button>
    </div>
  );

  const unauthenticatedLinks = (
    <div className="space-x-2">
      <Link
        href="/documentation"
        className={buttonVariants({ variant: "subtler" })}
      >
        Documentation
      </Link>

      <Button onClick={() => void signIn("google")}>Sign In</Button>
    </div>
  );

  return (
    <div className="sticky top-0 z-50 flex h-20 items-center justify-between border-b border-slate-300 bg-white shadow-sm backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900">
      <div className="container mx-auto flex justify-between">
        <div className="flex w-[26rem] items-center space-x-4">
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

        {status === "authenticated" && (
          <div className="space-x-4">
            <Link
              href={"/employees"}
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
        )}

        {status === "authenticated" ? authenticatedLinks : unauthenticatedLinks}
      </div>
    </div>
  );
}
