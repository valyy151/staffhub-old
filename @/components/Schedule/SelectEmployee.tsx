import { Check, ChevronsUpDown } from "lucide-react";
import { useRouter } from "next/router";
import * as React from "react";
import { Employee } from "~/utils/api";

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

type Props = {
  links?: boolean;
  name?: string;
  employee?: Employee;
  employees?: Employee[];
  setEmployee?: (employee: Employee) => void;
};

export default function SelectEmployee({
  links,
  name,
  employee,
  employees,
  setEmployee,
}: Props) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(employee?.name);

  const router = useRouter();

  const employeeId = router.asPath.split("/")[2];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {employee?.name || name
            ? employee?.name || name
            : "Select an employee..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="h-96 w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search employees..." />
          <CommandEmpty>No employees found.</CommandEmpty>
          <CommandGroup className="overflow-y-scroll ">
            {employees
              ?.sort((a, b) => a.name.localeCompare(b.name))
              .map((employee) => (
                <CommandItem
                  key={employee?.id}
                  onSelect={(value) => {
                    setValue(value);
                    setEmployee && setEmployee(employee);
                    links &&
                      router.push(
                        `/staff/${employee?.id}/${
                          router.asPath.split("/")[3] ?? ""
                        }`
                      );
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === employee.name.toLowerCase() ||
                        employeeId === employee.id
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
