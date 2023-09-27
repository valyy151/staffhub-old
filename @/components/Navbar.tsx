import { signIn, useSession } from 'next-auth/react';
import React from 'react';

import { Button } from '@/components/ui/button';
import {
    NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink,
    NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle
} from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';

import ThemeSwitcher from './ThemeSwitcher';

const links: { title: string; href: string; description: string }[] = [
  {
    title: "Staff Roles",
    href: "/settings/roles",
    description: "Manage the roles that your staff can have.",
  },
  {
    title: "Shift Models",
    href: "/settings/shift-models",
    description: "Manage the shift models that your staff can have.",
  },
  {
    title: "Account",
    href: "/settings",
    description: "Manage your account settings.",
  },
  {
    title: "Sign Out",
    href: "/api/auth/signout",
    description: "Sign out of your account.",
  },
];

export default function Navbar() {
  const { status } = useSession();

  if (status === "loading") {
    return null;
  }

  return (
    <nav className="flex border-b  py-2">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink
              href={"/"}
              className={navigationMenuTriggerStyle()}
            >
              StaffHub
            </NavigationMenuLink>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <ThemeSwitcher />
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      <NavigationMenu>
        <NavigationMenuList>
          {status === "authenticated" && (
            <>
              <NavigationMenuItem>
                <NavigationMenuLink
                  href={"/dashboard"}
                  className={navigationMenuTriggerStyle()}
                >
                  Dashboard
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  href={"/staff"}
                  className={navigationMenuTriggerStyle()}
                >
                  Staff
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  href={"/schedule"}
                  className={navigationMenuTriggerStyle()}
                >
                  Schedule
                </NavigationMenuLink>
              </NavigationMenuItem>
            </>
          )}
          <NavigationMenuItem>
            <NavigationMenuLink
              target="_blank"
              className={navigationMenuTriggerStyle()}
              href="https://staffhub-docs.vercel.app"
            >
              Getting Started
            </NavigationMenuLink>
          </NavigationMenuItem>

          {status === "authenticated" ? (
            <NavigationMenuItem>
              <NavigationMenuTrigger>Settings</NavigationMenuTrigger>

              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                  {links.map((link) => (
                    <ListItem
                      key={link.title}
                      title={link.title}
                      href={link.href}
                    >
                      {link.description}
                    </ListItem>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          ) : (
            <NavigationMenuItem>
              <Button
                variant={"ghost"}
                className={navigationMenuTriggerStyle()}
                onClick={() => signIn("google")}
              >
                Sign In
              </Button>
            </NavigationMenuItem>
          )}
        </NavigationMenuList>
      </NavigationMenu>
    </nav>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
