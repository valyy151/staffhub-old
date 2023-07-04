import Link from "next/link.js";
import { useState } from "react";
import { Menu, Moon } from "lucide-react";
import { Button, buttonVariants } from "./ui/Button";
import { useSession } from "next-auth/react";
import ThemeSwitcher from "./ThemeSwitcher";

const Navbar = () => {
  const session = useSession();

  const [dropdown, showDropdown] = useState<boolean>(false);

  return (
    <div className="sticky top-0 z-50 flex h-20 items-center justify-between border-b border-slate-300 bg-white shadow-sm backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900">
      <div className="container mx-auto flex w-full items-center justify-between">
        <div className="md:w-80">
          {" "}
          <Link
            href="/"
            className={`${buttonVariants({ variant: "ghost" })} text-xl`}
          >
            StaffHub
          </Link>
        </div>

        <div className="md:hidden">
          <ThemeSwitcher />
        </div>

        <div className="hidden gap-4 md:flex md:w-80">
          <ThemeSwitcher />

          <Link
            href="/documentation"
            className={buttonVariants({ variant: "subtle" })}
          >
            Documentation
          </Link>
          {session.status === "authenticated" ? (
            <>
              <Link
                className={buttonVariants({ variant: "ghost" })}
                href="/dashboard"
              >
                Dashboard
              </Link>
              <Button>Sign Out</Button>
            </>
          ) : (
            <Button>Sign In</Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
