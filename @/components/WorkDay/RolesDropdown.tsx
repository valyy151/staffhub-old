import { Check, ChevronsUpDown } from "lucide-react";
import React from "react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type RolesDropdownProps = {
  role: { name: string; id: string };
  roles: { name: string; id: string }[] | undefined;
  setRole: (role: { name: string; id: string }) => void;
};

export default function RolesDropdown({
  role,
  roles,
  setRole,
}: RolesDropdownProps) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(role?.name);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {role?.name ? role.name : "Select a role..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search roles..." />
          <CommandEmpty>No employees found.</CommandEmpty>
          <CommandGroup>
            {roles
              ?.sort((a, b) => a.name.localeCompare(b.name))
              .map((role) => (
                <CommandItem
                  key={role?.id}
                  onSelect={(value) => {
                    setValue(value);
                    setRole && setRole(role);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === role.name.toLowerCase()
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {role?.name}
                </CommandItem>
              ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
