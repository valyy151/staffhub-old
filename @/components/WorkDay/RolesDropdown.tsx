import { Input } from "@/components/ui/input";

type RolesDropdownProps = {
  isOpen: boolean;
  role: { name: string; id: string };
  setIsOpen: (isOpen: boolean) => void;
  roles: { name: string; id: string }[];
  setOpenStaff?: (openStaff: boolean) => void;
  setRole: (role: { name: string; id: string }) => void;
};

export default function RolesDropdown({
  role,
  roles,
  isOpen,
  setRole,
  setIsOpen,
  setOpenStaff,
}: RolesDropdownProps) {
  function handleSelect(role: { name: string; id: string }) {
    setRole(role);
    setIsOpen(false);
  }
  return (
    <main className="relative w-full">
      <div
        className="group cursor-pointer rounded bg-white shadow hover:shadow-md dark:bg-gray-800 dark:shadow-gray-950 "
        onClick={() => {
          setIsOpen(!isOpen);
          setOpenStaff && setOpenStaff(false);
        }}
      >
        <Input
          readOnly
          type="text"
          value={role.name}
          placeholder={"Choose a Role..."}
          className="text-md group m-0 cursor-pointer caret-transparent ring-offset-0 focus:ring-0 focus:ring-offset-0 dark:placeholder:text-gray-400"
        />
      </div>
      {isOpen && (
        <div
          className={`animate-slideDown absolute z-10 mt-1 w-full rounded-md bg-white shadow-md dark:bg-gray-800 dark:text-gray-300`}
        >
          <ul
            className={`${
              roles.length > 8 && "h-[28.5rem] overflow-y-scroll"
            } p-1`}
          >
            {roles.map((role) => (
              <li
                className="flex cursor-pointer items-center rounded-md px-2 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                key={role.id}
                onClick={() => handleSelect(role)}
              >
                {role.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </main>
  );
}
