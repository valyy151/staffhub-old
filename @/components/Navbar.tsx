import Link from "next/link.js";
import ThemeSwitcher from "./ThemeSwitcher";

import { useSession, signIn, signOut } from "next-auth/react";
import { useState } from "react";
import { AlignJustify } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button";

export default function Navbar() {
  const { status } = useSession();
  const [showMenu, setShowMenu] = useState(false);

  if (status === "loading") {
    return null;
  }

  return (
    <div className="sticky top-0 z-50 flex items-center justify-between border-b border-slate-300 bg-slate-50 py-2 shadow-sm backdrop-blur-sm dark:border-slate-700 dark:bg-slate-800">
      <div className="container flex justify-between">
        <div className="hidden items-center justify-center space-x-4 sm:flex">
          <Link href="/" className={`${buttonVariants({ variant: "link" })}`}>
            StaffHub
          </Link>
          <ThemeSwitcher />
        </div>
        <div className="hidden space-x-1 sm:flex">
          {status === "authenticated" ? (
            <>
              <Link
                href={"/dashboard"}
                className={`${buttonVariants({
                  variant: "link",
                })}`}
              >
                Dashboard
              </Link>
              <Link
                href={"/staff"}
                className={`${buttonVariants({
                  variant: "link",
                })}`}
              >
                My Staff
              </Link>
              <Link
                href={"/schedule"}
                className={`${buttonVariants({
                  variant: "link",
                })}`}
              >
                New Schedule
              </Link>
              <Link
                href={"/documentation"}
                className={`${buttonVariants({
                  variant: "link",
                })}`}
              >
                Documentation
              </Link>
              <Link
                href={"/settings"}
                className={`${buttonVariants({
                  variant: "link",
                })}`}
              >
                Settings
              </Link>
              <Button variant={"destructive"} onClick={() => signOut()}>
                Sign out
              </Button>
            </>
          ) : (
            <>
              <Link
                href={"/documentation"}
                className={`${buttonVariants({
                  variant: "link",
                })}`}
              >
                Documentation
              </Link>
              <Button variant={"default"} onClick={() => signIn("google")}>
                Sign in
              </Button>
            </>
          )}
        </div>
        {/* Mobile begin */}
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
            <div className="flex flex-col space-y-2">
              {status === "authenticated" ? (
                <>
                  <Link
                    href={"/dashboard"}
                    className={`${buttonVariants({
                      variant: "link",
                    })}`}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href={"/staff"}
                    className={`${buttonVariants({
                      variant: "link",
                    })}`}
                  >
                    My Staff
                  </Link>
                  <Link
                    href={"/schedule"}
                    className={`${buttonVariants({
                      variant: "link",
                    })}`}
                  >
                    New Schedule
                  </Link>
                  <Link
                    href={"/documentation"}
                    className={`${buttonVariants({
                      variant: "link",
                    })}`}
                  >
                    Documentation
                  </Link>
                  <Link
                    href={"/settings"}
                    className={`${buttonVariants({
                      variant: "link",
                    })}`}
                  >
                    Settings
                  </Link>

                  <Button variant={"destructive"} onClick={() => signOut()}>
                    Sign out
                  </Button>
                </>
              ) : (
                <>
                  <Link
                    href={"/documentation"}
                    className={`${buttonVariants({
                      variant: "link",
                    })}`}
                  >
                    Documentation
                  </Link>
                  <Button variant={"default"} onClick={() => signIn("google")}>
                    Sign in
                  </Button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Mobile end */}
      </div>
    </div>
  );
}
