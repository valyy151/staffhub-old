import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
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
import { Employee } from "~/utils/api";
import router from "next/router";

type Props = {
  links?: boolean;
  employee?: Employee;
  employees?: Employee[];
  setEmployee?: (employee: Employee) => void;
};

export default function SelectEmployee({
  links,
  employee,
  employees,
  setEmployee,
}: Props) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(employee?.name);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {employee?.name ? employee.name : "Select an employee..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search employees..." />
          <CommandEmpty>No employees found.</CommandEmpty>
          <CommandGroup>
            {employees
              ?.sort((a, b) => a.name.localeCompare(b.name))
              .map((employee) => (
                <CommandItem
                  key={employee?.id}
                  onSelect={(value) => {
                    setValue(value);
                    setEmployee && setEmployee(employee);
                    links && router.push(`/staff/${employee.id}`);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === employee.name.toLowerCase()
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {employee?.name}
                </CommandItem>
              ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
